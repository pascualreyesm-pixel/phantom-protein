import { NextRequest, NextResponse } from "next/server";
import { sincronizarPagoMercadoPago } from "@/lib/payment/sincronizar-pago";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const numero = typeof body?.numero === "string" ? body.numero.trim() : "";
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const paymentId = typeof body?.paymentId === "string" ? body.paymentId.trim() : "";

    if (!numero || !token || token.length < 30 || !paymentId || paymentId.length > 100) {
      return NextResponse.json({ error: "Datos de confirmación inválidos." }, { status: 400 });
    }

    const resultado = await sincronizarPagoMercadoPago(paymentId, {
      numeroEsperado: numero,
      tokenConfirmacion: token,
    });

    return NextResponse.json(resultado, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Error confirmando pago desde el retorno:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "No pudimos validar el pago.",
    }, { status: 409, headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}
