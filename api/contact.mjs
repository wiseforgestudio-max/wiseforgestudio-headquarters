/**
 * POST /api/contact
 * Recibe envíos del formulario de contacto.
 * - Valida campos requeridos
 * - Envía email vía Resend (RESEND_API_KEY en env vars de Vercel)
 * - Registra en Vercel logs para trazabilidad
 * Vercel auto-parsea body JSON cuando Content-Type: application/json
 */

const CONTACT_EMAIL = "contacto@wiseforgestudio.com";
const ALLOWED_NECESIDADES = [
  "Software operativo",
  "Automatización por consultoría",
  "Producto SaaS",
  "Plataforma interna",
  "Exploración inicial"
];

function buildEmailHtml({ nombre, empresa, correo, tipo_necesidad, contexto, submittedAt }) {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><style>
  body { font-family: system-ui, sans-serif; background: #0d0d16; color: #f0f0f5; margin: 0; padding: 24px; }
  .card { background: #111118; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 24px; max-width: 560px; margin: 0 auto; }
  .header { border-bottom: 1px solid rgba(52,216,116,0.3); padding-bottom: 16px; margin-bottom: 20px; }
  .logo { color: #34d874; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px; }
  h1 { margin: 0; font-size: 18px; color: #f0f0f5; }
  .field { margin-bottom: 14px; }
  .label { font-size: 11px; color: #7a7a9a; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
  .value { font-size: 15px; color: #f0f0f5; }
  .contexto .value { white-space: pre-wrap; background: #18181f; padding: 12px; border-radius: 6px; font-size: 14px; line-height: 1.5; }
  .tag { display: inline-block; background: rgba(52,216,116,0.15); color: #34d874; border: 1px solid rgba(52,216,116,0.3); border-radius: 4px; padding: 2px 8px; font-size: 12px; font-weight: 600; }
  .footer { margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #7a7a9a; }
</style></head>
<body>
  <div class="card">
    <div class="header">
      <p class="logo">WiseForge Studio</p>
      <h1>Nuevo contacto recibido</h1>
    </div>
    <div class="field">
      <p class="label">Nombre</p>
      <p class="value">${escHtml(nombre)}</p>
    </div>
    <div class="field">
      <p class="label">Empresa</p>
      <p class="value">${escHtml(empresa)}</p>
    </div>
    <div class="field">
      <p class="label">Correo</p>
      <p class="value"><a href="mailto:${escHtml(correo)}" style="color:#34d874;">${escHtml(correo)}</a></p>
    </div>
    <div class="field">
      <p class="label">Tipo de necesidad</p>
      <p class="value"><span class="tag">${escHtml(tipo_necesidad || "No especificado")}</span></p>
    </div>
    <div class="field contexto">
      <p class="label">Contexto</p>
      <p class="value">${escHtml(contexto)}</p>
    </div>
    <div class="footer">
      Recibido: ${new Date(submittedAt).toLocaleString("es-CO", { timeZone: "America/Bogota" })} COT
      &nbsp;·&nbsp; Responder directamente a este correo
    </div>
  </div>
</body>
</html>`;
}

function escHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function validate(body) {
  const errors = [];
  const nombre = body?.nombre?.trim() ?? "";
  const empresa = body?.empresa?.trim() ?? "";
  const correo = body?.correo?.trim() ?? "";
  const contexto = body?.contexto?.trim() ?? "";

  if (!nombre) errors.push("nombre");
  if (!empresa) errors.push("empresa");
  if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errors.push("correo");
  if (!contexto || contexto.length < 10) errors.push("contexto");

  return { errors, nombre, empresa, correo, contexto };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://wiseforgestudio-hq.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { errors, nombre, empresa, correo, contexto } = validate(req.body);
  const tipo_necesidad = req.body?.tipo_necesidad?.trim() ?? "";

  if (errors.length) {
    return res.status(400).json({ error: "Campos requeridos o inválidos", fields: errors });
  }

  if (tipo_necesidad && !ALLOWED_NECESIDADES.includes(tipo_necesidad)) {
    return res.status(400).json({ error: "Tipo de necesidad inválido" });
  }

  const submittedAt = new Date().toISOString();

  // Trazabilidad en logs de Vercel (siempre)
  console.log(JSON.stringify({
    event: "contact_submission",
    empresa,
    tipo_necesidad,
    submittedAt,
    correo: correo.replace(/(.{2}).+(@.+)/, "$1***$2") // parcialmente enmascarado
  }));

  // Envío de email vía Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "WiseForge Studio <noreply@wiseforgestudio.com>",
          to: [CONTACT_EMAIL],
          reply_to: correo,
          subject: `[WFS] ${empresa} — ${tipo_necesidad || "Consulta"}`,
          html: buildEmailHtml({ nombre, empresa, correo, tipo_necesidad, contexto, submittedAt })
        })
      });

      if (!emailRes.ok) {
        const detail = await emailRes.text().catch(() => "");
        console.error("Resend error:", emailRes.status, detail);
      }
    } catch (err) {
      // Email falla silenciosamente — el log ya tiene el registro
      console.error("Resend fetch error:", err.message);
    }
  } else {
    console.warn("RESEND_API_KEY no configurada — email no enviado.");
  }

  return res.status(200).json({ ok: true, submittedAt });
}
