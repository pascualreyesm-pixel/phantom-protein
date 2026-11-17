import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sincronizarPagoMercadoPago } from "@/lib/payment/sincronizar-pago";

export const runtime = "nodejs";

type NotificacionMercadoPago = {
  id?: string | number;
  type?: string;
  action?: string;
  live_mode?: boolean;
  data?: { id?: string | number };
};

function parseSignature(value: string | null) {
  if (!value) return null;
  let ts = "";
  let v1 = "";
  for (const part of value.split(",")) {
    const [key, ...rest] = part.split("=");
    const val = rest.join("=").trim();
    if (key?.trim() === "ts") ts = val;
    if (key?.trim() === "v1") v1 = val;
  }
  return ts && v1 ? { ts, v1 } : null;
}

function firmaValida({
  xSignature, xRequestId, dataId, secret,
}: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  secret: string;
}) {
  const parsed = parseSignature(xSignature);
  if (!parsed || !dataId || !secret.trim()) return false;

  // El manifest incorpora request-id cuando Mercado Pago lo envía.
  const partes = [`id:${dataId.toLowerCase()};`];
  if (xRequestId) partes.push(`request-id:${xRequestId};`);
  partes.push(`ts:${parsed.ts};`);
  const esperado = createHmac("sha256", secret.trim()).update(partes.join("")).digest("hex");
  const a = Buffer.from(esperado, "hex");
  const b = Buffer.from(parsed.v1, "hex");
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryDataId = url.searchParams.get("data.id");
    const queryType = url.searchParams.get("type");
    const body = (await request.json().catch(() => ({}))) as NotificacionMercadoPago;
    const dataId = queryDataId || (body.data?.id != null ? String(body.data.id) : null);
    const type = body.type || queryType || (body.action?.startsWith("payment.") ? "payment" : null);

    // Ignorar otros tópicos. Checkout Pro usa payment y se consulta en /v1/payments/{id}.
    if (type && type !== "payment") return NextResponse.json({ received: true });
    if (!dataId) return NextResponse.json({ received: true });

    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    const signature = request.headers.get("x-signature");
    const requestId = request.headers.get("x-request-id");

    // El botón "Simular notificación" de Mercado Pago manda un evento de ejemplo
    // live_mode=false y sin firma verificable. Se confirma recepción, pero nunca
    // se consulta la API ni se toca Supabase. Los pagos sandbox reales sí vienen firmados.
    if (body.live_mode === false && !signature) {
      return NextResponse.json({ received: true, simulation: true });
    }

    if (!webhookSecret || !firmaValida({
      xSignature: signature,
      xRequestId: requestId,
      dataId,
      secret: webhookSecret,
    })) {
      console.warn("Webhook Mercado Pago rechazado por firma inválida o secreto no configurado.", {
        hasSignature: Boolean(signature),
        hasRequestId: Boolean(requestId),
        hasDataId: Boolean(dataId),
        hasSecret: Boolean(webhookSecret),
        liveMode: body.live_mode,
      });
      return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
    }

    // La misma rutina se usa en el retorno del comprador: consulta el pago por API,
    // valida external_reference, monto y moneda, actualiza Supabase y envía el correo.
    await sincronizarPagoMercadoPago(dataId);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Mercado Pago:", error);
    return NextResponse.json({ error: "Error procesando webhook." }, { status: 500 });
  }
}
