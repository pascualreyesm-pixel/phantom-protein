import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { Resend } from "resend";

export const runtime = "nodejs";

function tokenValido(recibido: string | null, esperado: string | undefined) {
  if (!recibido || !esperado) return false;
  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const esperado = process.env.EMAIL_TEST_TOKEN;
  const recibido = request.headers.get("x-email-test-token");
  if (!tokenValido(recibido, esperado)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.PEDIDO_EMAIL_DESTINO;
  if (!apiKey || !destino) {
    return NextResponse.json({ error: "Falta configurar RESEND_API_KEY o PEDIDO_EMAIL_DESTINO." }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM_EMAIL || "Phantom Protein <onboarding@resend.dev>";
    const fecha = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
    const { data, error } = await resend.emails.send({
      from,
      to: [destino],
      subject: "Prueba de correo — Phantom Protein",
      html: `
        <div style="background:#f5f5f5;padding:28px;font-family:Arial,sans-serif;color:#171717">
          <div style="max-width:560px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e5e5e5">
            <div style="background:#050505;padding:24px;color:#fff">
              <p style="margin:0;color:#EBD6A8;letter-spacing:3px;font-size:12px;font-weight:bold">PHANTOM PROTEIN</p>
              <h1 style="margin:12px 0 0;font-size:24px">Correo de prueba</h1>
            </div>
            <div style="padding:24px;line-height:1.6">
              <p>Este es un correo de prueba de la tienda Phantom Protein.</p>
              <p>Si recibiste este mensaje, la conexión de Resend y el destinatario están funcionando.</p>
              <p style="color:#666;font-size:12px">Enviado el ${fecha}. No corresponde a una compra ni a un pago real.</p>
            </div>
          </div>
        </div>`,
    }, { idempotencyKey: `phantom-email-test/${new Date().toISOString().slice(0, 16)}` });

    if (error) {
      console.error("Resend test email error:", error);
      return NextResponse.json({ error: "Resend no pudo enviar el correo de prueba.", detail: error.message }, { status: 502 });
    }
    return NextResponse.json({ ok: true, id: data?.id, destino });
  } catch (error) {
    console.error("Error enviando correo de prueba:", error);
    return NextResponse.json({ error: "No se pudo enviar el correo de prueba." }, { status: 500 });
  }
}
