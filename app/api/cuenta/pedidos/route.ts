import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Inicia sesión para consultar tus pedidos." }, { status: 401 });
  }

  const accessToken = authorization.slice("Bearer ".length).trim();
  if (!accessToken) {
    return NextResponse.json({ error: "La sesión no es válida." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServer();
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
    const user = authData.user;

    if (authError || !user?.email) {
      return NextResponse.json({ error: "La sesión no es válida. Vuelve a iniciar sesión." }, { status: 401 });
    }
    if (!user.email_confirmed_at) {
      return NextResponse.json({ error: "Confirma tu correo antes de consultar pedidos." }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("pedidos")
      .select("numero_pedido, estado, total, created_at, starken_numero_envio")
      .eq("cliente_email", user.email)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "No pudimos consultar los pedidos. Comprueba la configuración de la tabla pedidos." }, { status: 500 });
    }

    return NextResponse.json(
      { pedidos: data ?? [] },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json({ error: "La cuenta no está configurada todavía. Revisa las variables de Supabase." }, { status: 500 });
  }
}
