import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const numero = url.searchParams.get("numero")?.trim();
  const token = url.searchParams.get("token")?.trim();
  if (!numero || !token || token.length < 30) {
    return NextResponse.json({ error: "Referencia de pedido inválida." }, { status: 400 });
  }
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.from("pedidos")
      .select("numero_pedido, estado, mercadopago_status, pagado_at, email_enviado_at")
      .eq("numero_pedido", numero).eq("token_confirmacion", token).maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "No encontramos el pedido." }, { status: 404 });
    const pagado = data.estado === "pagado" || Boolean(data.pagado_at);
    return NextResponse.json({ numero: data.numero_pedido, estado: data.estado, pago: data.mercadopago_status, pagado, emailEnviado: Boolean(data.email_enviado_at) }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Error consultando estado del pedido:", error);
    return NextResponse.json({ error: "No pudimos consultar el estado del pedido." }, { status: 500 });
  }
}
