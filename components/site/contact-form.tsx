'use client'

import * as React from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

import { cn } from '@/lib/utils'

const NEEDS = [
  'Gobierno multiagente',
  'Software operativo',
  'Automatizacion con IA',
  'Producto SaaS vertical',
  'Diagnostico inicial',
]

export function ContactForm() {
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [form, setForm] = React.useState({
    nombre: '',
    empresa: '',
    correo: '',
    tipo_necesidad: '',
    contexto: '',
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      setStatus(response.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  const fieldClassName =
    'w-full rounded-[1.25rem] border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder:text-white/35 transition-colors focus:border-cyan-300/50 focus:outline-none'

  if (status === 'ok') {
    return (
      <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-12 text-center backdrop-blur">
        <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-emerald-300" />
        <h3 className="text-2xl font-semibold text-white">Mensaje recibido</h3>
        <p className="mt-3 text-sm leading-7 text-white/65">
          Revisaremos el contexto y responderemos al correo indicado.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur md:grid-cols-2 md:p-8"
    >
      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Nombre
        </label>
        <input
          className={fieldClassName}
          placeholder="Tu nombre"
          value={form.nombre}
          onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Empresa
        </label>
        <input
          className={fieldClassName}
          placeholder="Nombre de la empresa"
          value={form.empresa}
          onChange={(event) => setForm((current) => ({ ...current, empresa: event.target.value }))}
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Correo
        </label>
        <input
          type="email"
          className={fieldClassName}
          placeholder="nombre@empresa.com"
          value={form.correo}
          onChange={(event) => setForm((current) => ({ ...current, correo: event.target.value }))}
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Necesidad
        </label>
        <select
          className={fieldClassName}
          value={form.tipo_necesidad}
          onChange={(event) =>
            setForm((current) => ({ ...current, tipo_necesidad: event.target.value }))
          }
          required
        >
          <option value="">Selecciona una opcion</option>
          {NEEDS.map((need) => (
            <option key={need} value={need}>
              {need}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Contexto
        </label>
        <textarea
          rows={5}
          className={cn(fieldClassName, 'resize-none')}
          placeholder="Describe el sistema, el punto de friccion y el nivel de autonomia que esperas."
          value={form.contexto}
          onChange={(event) => setForm((current) => ({ ...current, contexto: event.target.value }))}
          required
        />
      </div>
      <div className="md:col-span-2 flex items-center justify-between gap-4">
        <p className={cn('text-sm text-red-300', status === 'err' ? 'opacity-100' : 'opacity-0')}>
          Hubo un problema enviando el formulario. Intenta de nuevo.
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="ml-auto inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(255,255,255,0.14)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? 'Enviando...' : 'Abrir conversacion'}
          {status !== 'sending' && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </form>
  )
}
