import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const numero = request.nextUrl.searchParams.get("numero")?.trim();
  if (!numero || numero.length > 64 || !/^[A-Za-z0-9-]+$/.test(numero)) {
    return NextResponse.json({ error: "Número de pedido inválido." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("pedidos")
      .select("numero_pedido, estado, mercadopago_status")
      .eq("numero_pedido", numero)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Pedido no encontrado." }, { status: 404 });

    return NextResponse.json({
      numero: data.numero_pedido,
      estado: data.estado,
      pago: data.mercadopago_status,
      aprobado: data.estado === "pagado" && data.mercadopago_status === "approved",
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    console.error("Error consultando estado del pedido:", error);
    return NextResponse.json({ error: "No se pudo consultar el estado del pedido." }, { status: 500 });
  }
}
