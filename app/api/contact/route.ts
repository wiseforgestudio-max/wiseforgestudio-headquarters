import { NextRequest, NextResponse } from 'next/server'

const CONTACT_EMAIL = 'contacto@wiseforgestudio.com'

function escHtml(v: unknown) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildEmailHtml(d: Record<string, string>) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>body{font-family:system-ui,sans-serif;background:#0d0d16;color:#f0f0f5;padding:24px}
.card{background:#111118;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:24px;max-width:560px;margin:0 auto}
.logo{color:#34d874;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin:0 0 6px}
h1{margin:0 0 20px;font-size:18px;border-bottom:1px solid rgba(52,216,116,.2);padding-bottom:14px}
.row{margin-bottom:12px}.label{font-size:10px;color:#7a7a9a;text-transform:uppercase;letter-spacing:.06em}
.val{font-size:14px;margin:2px 0 0}.tag{display:inline-block;background:rgba(52,216,116,.12);color:#34d874;border:1px solid rgba(52,216,116,.3);border-radius:4px;padding:2px 8px;font-size:12px;font-weight:600}
.ctx{background:#18181f;padding:12px;border-radius:6px;white-space:pre-wrap;font-size:13px;line-height:1.5}
.footer{margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.05);font-size:11px;color:#7a7a9a}
</style></head><body><div class="card">
<p class="logo">WiseForge Studio</p>
<h1>Nuevo contacto recibido</h1>
<div class="row"><p class="label">Nombre</p><p class="val">${escHtml(d.nombre)}</p></div>
<div class="row"><p class="label">Empresa</p><p class="val">${escHtml(d.empresa)}</p></div>
<div class="row"><p class="label">Correo</p><p class="val"><a href="mailto:${escHtml(d.correo)}" style="color:#34d874">${escHtml(d.correo)}</a></p></div>
<div class="row"><p class="label">Necesidad</p><p class="val"><span class="tag">${escHtml(d.tipo_necesidad || 'General')}</span></p></div>
<div class="row"><p class="label">Contexto</p><p class="ctx">${escHtml(d.contexto)}</p></div>
<div class="footer">Recibido: ${new Date(d.submittedAt).toLocaleString('es-CO',{timeZone:'America/Bogota'})} COT · Responder a este correo</div>
</div></body></html>`
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const { nombre, empresa, correo, tipo_necesidad, contexto } = body
  const errors: string[] = []
  if (!nombre?.trim()) errors.push('nombre')
  if (!empresa?.trim()) errors.push('empresa')
  if (!correo?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errors.push('correo')
  if (!contexto?.trim() || contexto.trim().length < 10) errors.push('contexto')

  if (errors.length) return NextResponse.json({ error: 'Campos inválidos', fields: errors }, { status: 400 })

  const submittedAt = new Date().toISOString()
  console.log(JSON.stringify({ event: 'contact', empresa, tipo_necesidad, submittedAt }))

  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'WiseForge Studio <noreply@wiseforgestudio.com>',
          to: [CONTACT_EMAIL],
          reply_to: correo,
          subject: `[WFS] ${empresa} — ${tipo_necesidad || 'Consulta'}`,
          html: buildEmailHtml({ nombre, empresa, correo, tipo_necesidad, contexto, submittedAt }),
        }),
      })
    } catch (e) {
      console.error('Resend error:', e)
    }
  }

  return NextResponse.json({ ok: true, submittedAt })
}
