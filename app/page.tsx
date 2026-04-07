'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import {
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  Boxes,
  Cpu,
  GitMerge,
  LayoutDashboard,
  Mail,
  ExternalLink,
  Zap,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { Card } from '@/components/ui/card'

/* ── Nav links ───────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Productos', href: '#productos' },
  { label: 'Capacidades', href: '#capacidades' },
  { label: 'Método', href: '#metodo' },
  { label: 'Contacto', href: '#contacto' },
]

/* ── Navbar ─────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <Image src="/logo-wfs.png" alt="WiseForge" width={28} height={28} className="rounded-md" />
          <span className="font-bold text-[15px] text-white tracking-tight">
            WiseForge <span className="text-white/50 font-normal">Studio</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#contacto" className="hidden md:block">
          <button className="h-9 px-5 rounded-xl bg-white text-black text-[13px] font-bold hover:bg-white/90 transition-all">
            Contactar
          </button>
        </a>

        <button className="md:hidden text-white/60" onClick={() => setOpen(v => !v)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/[0.06] px-6 pb-5"
          >
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-sm text-white/60 hover:text-white border-b border-white/[0.06] last:border-0">
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

/* ── Cursor spotlight ───────────────────────────────────────── */
function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return
      ref.current.style.setProperty('--x', `${e.clientX}px`)
      ref.current.style.setProperty('--y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <div ref={ref} className="spotlight-cursor pointer-events-none fixed inset-0 z-[1]" aria-hidden />
}

/* ── HERO — Spline 3D full-screen ────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex items-stretch">
      {/* Aceternity spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_50%,rgba(120,119,198,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_20%,rgba(52,216,116,0.07)_0%,transparent_50%)]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* LEFT — content */}
      <div className="relative z-20 flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-[50%]">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm mb-8 w-fit"
        >
          <Sparkles size={12} className="text-green-400" />
          <span className="text-[11px] font-semibold text-white/70 tracking-widest uppercase">
            Studio de software B2B
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[clamp(2.8rem,5vw,5.5rem)] font-extrabold leading-[0.92] tracking-tight text-white mb-6"
        >
          Software que
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-violet-400">
            opera tu empresa
          </span>
          <br />
          de verdad.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-[15px] leading-[1.8] text-white/50 max-w-[400px] mb-10"
        >
          Diseñamos productos SaaS, plataformas internas y automatización para empresas
          que necesitan control, trazabilidad y sistemas operativos serios.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap gap-3 mb-14"
        >
          <a href="#productos">
            <button className="group h-12 px-7 rounded-xl bg-white text-black font-bold text-[14px] flex items-center gap-2 hover:bg-white/90 transition-all">
              Ver productos <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
          </a>
          <a href="#contacto">
            <button className="h-12 px-7 rounded-xl border border-white/15 bg-white/[0.05] text-white text-[14px] font-medium hover:bg-white/[0.1] hover:border-white/25 transition-all backdrop-blur-sm">
              Contactar estudio
            </button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-10 pt-8 border-t border-white/[0.07]"
        >
          {[
            { n: '2', label: 'Productos live' },
            { n: '4', label: 'Líneas de servicio' },
            { n: '0→1', label: 'A producción' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-[2rem] font-extrabold text-white leading-none">{s.n}</div>
              <div className="text-[11px] text-white/35 mt-1.5 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* RIGHT — Spline 3D scene */}
      <div className="flex-1 relative">
        {/* Fade edge left */}
        <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </section>
  )
}

/* ── Products ───────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 'assetmaster',
    name: 'AssetMaster',
    tag: 'ERP Documental',
    tagColor: '#6366f1',
    description:
      'Control documental con aprobaciones multi-nivel, trazabilidad de activos y flujos de trabajo estructurados para organizaciones que necesitan rigor operativo.',
    features: ['Aprobaciones multi-nivel', 'Control de activos', 'Trazabilidad completa', 'Reportería ejecutiva', 'Flujos configurables', 'Evidencia documental'],
    image: '/assetmaster-shot.png',
    logo: '/assetmaster-logo.svg',
    href: 'https://assetwise-hub.vercel.app',
    glow: '#6366f1',
  },
  {
    id: 'ganamaxcol',
    name: 'GanaMaxcol',
    tag: 'ERP Ganadero',
    tagColor: '#34d874',
    description:
      'Software vertical para operación ganadera en campo. Salud animal, reproducción, pesajes y producción — diseñado para el trabajo real en finca.',
    features: ['Salud animal', 'Reproducción', 'Pesajes y producción', 'Alertas operativas', 'Multifinca', 'Trazabilidad de campo'],
    image: '/ganamaxcol-shot.png',
    logo: '/ganamaxcol-logo.svg',
    href: 'https://ganamaxcol.vercel.app',
    glow: '#34d874',
  },
]

function ProductItem({ product, index }: { product: (typeof PRODUCTS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reverse = index % 2 === 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center',
        reverse && 'lg:[&>div:first-child]:order-2'
      )}
    >
      {/* Text */}
      <div>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-7 text-[11px] font-bold tracking-widest uppercase"
          style={{ borderColor: `${product.tagColor}40`, background: `${product.tagColor}0e`, color: product.tagColor }}
        >
          {product.tag}
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center overflow-hidden">
            <Image src={product.logo} alt={product.name} width={26} height={26} />
          </div>
          <h3 className="text-[2.4rem] font-extrabold text-white tracking-tight leading-none">{product.name}</h3>
        </div>
        <p className="text-[15px] leading-[1.8] text-white/50 mb-9 max-w-[400px]">{product.description}</p>
        <ul className="grid grid-cols-2 gap-3 mb-10">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[13px] text-white/50">
              <CheckCircle2 size={14} style={{ color: product.tagColor }} className="shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <div className="flex gap-3">
          <a href={product.href} target="_blank" rel="noopener noreferrer">
            <button
              className="group h-11 px-6 rounded-xl text-[14px] font-bold flex items-center gap-2 transition-all"
              style={{ background: product.tagColor, color: '#050508', boxShadow: `0 0 30px ${product.tagColor}35` }}
            >
              Ver demo <ExternalLink size={14} />
            </button>
          </a>
          <a href="#contacto">
            <button className="h-11 px-6 rounded-xl border border-white/10 text-[14px] text-white/60 font-medium hover:border-white/20 hover:text-white transition-all">
              Solicitar acceso
            </button>
          </a>
        </div>
      </div>

      {/* Browser mockup */}
      <div className="perspective">
        <motion.div
          initial={{ rotateY: reverse ? 6 : -6, opacity: 0 }}
          animate={inView ? { rotateY: reverse ? 3 : -3, opacity: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-2xl overflow-hidden border border-white/10"
          style={{ boxShadow: `0 40px 90px rgba(0,0,0,0.7), 0 0 80px ${product.glow}18` }}
        >
          <div className="flex items-center gap-2 px-4 py-3.5 bg-[#0d0d14] border-b border-white/[0.07]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div className="ml-3 flex-1 h-5 rounded-lg bg-white/[0.04] border border-white/[0.06]" />
          </div>
          <Image src={product.image} alt={product.name} width={720} height={450} className="w-full object-cover" />
        </motion.div>
        <div className="absolute -bottom-6 inset-x-10 h-10 blur-3xl opacity-30 rounded-full" style={{ background: product.glow }} />
      </div>
    </motion.div>
  )
}

function ProductsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="productos" className="py-36 bg-black relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(99,102,241,0.06)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-28">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-[11px] font-bold text-green-400 tracking-[0.2em] uppercase mb-3">
            Productos
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="text-[clamp(2.2rem,5vw,4rem)] font-extrabold tracking-tight text-white leading-[1.0]">
            Software que funciona
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-green-400">en el mundo real.</span>
          </motion.h2>
        </div>

        <div className="space-y-36">
          {PRODUCTS.map((p, i) => <ProductItem key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ── Capabilities ───────────────────────────────────────────── */
const CAPABILITIES = [
  { icon: Boxes, title: 'Productos SaaS verticales', desc: 'Construimos software específico para industrias con lógica propia. Sin plantillas genéricas — sistemas desde la operación real.', color: '#6366f1', large: true },
  { icon: LayoutDashboard, title: 'Software operativo', desc: 'Plataformas que reemplazan Excel y procesos manuales.', color: '#34d874' },
  { icon: GitMerge, title: 'Automatización', desc: 'Integraciones, flujos y agentes que reducen trabajo repetitivo.', color: '#f59e0b' },
  { icon: Cpu, title: 'Plataformas internas', desc: 'Herramientas que amplifican equipos con governance y trazabilidad.', color: '#a78bfa' },
]

function CapabilityCard({ c, i }: { c: (typeof CAPABILITIES)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const Icon = c.icon
  const large = c.large

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.1 }}
      className={cn(
        'group relative rounded-3xl border border-white/[0.07] bg-white/[0.02] overflow-hidden hover:border-white/[0.14] transition-all duration-300',
        large ? 'md:col-span-2 p-10 min-h-[260px] flex flex-col justify-between' : 'p-7'
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `radial-gradient(ellipse 70% 80% at ${large ? '15%' : '30%'} 30%, ${c.color}12 0%, transparent 70%)` }} />
      {large && <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: c.color }} />}

      <div className={cn('rounded-2xl border flex items-center justify-center', large ? 'w-14 h-14 mb-8' : 'w-11 h-11 mb-5')}
        style={{ borderColor: `${c.color}35`, background: `${c.color}12` }}>
        <Icon size={large ? 24 : 20} style={{ color: c.color }} />
      </div>

      <div>
        <h3 className={cn('font-bold text-white mb-2.5 leading-snug', large ? 'text-[1.4rem]' : 'text-[15px]')}>{c.title}</h3>
        <p className={cn('text-white/45 leading-[1.7]', large ? 'text-[14px] max-w-[380px]' : 'text-[13px]')}>{c.desc}</p>
      </div>
    </motion.div>
  )
}

function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-40px' })

  return (
    <section id="capacidades" className="py-36 bg-[#030303] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="text-center max-w-xl mx-auto mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-[11px] font-bold text-green-400 tracking-[0.2em] uppercase mb-3">
            Capacidades
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold tracking-tight text-white leading-[1.0]">
            Lo que construimos.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {CAPABILITIES.map((c, i) => <CapabilityCard key={c.title} c={c} i={i} />)}
        </div>

        <motion.div ref={statsRef} initial={{ opacity: 0, y: 24 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
          className="rounded-3xl border border-green-500/15 bg-green-500/[0.04] p-8 flex flex-wrap items-center justify-around gap-8">
          {[
            { n: 'SaaS', label: 'Productos propios en producción' },
            { n: 'ERP', label: 'Software operativo enterprise' },
            { n: 'n8n + IA', label: 'Stack de automatización' },
            { n: 'B2B', label: 'Foco exclusivo' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[2.2rem] font-extrabold text-green-400 leading-none">{s.n}</div>
              <div className="text-[12px] text-white/35 mt-1.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Method ─────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Discovery', desc: 'Entendemos la operación real: fricción, actores, datos y prioridad. Sin suposiciones.' },
  { n: '02', title: 'Definición', desc: 'Diseñamos arquitectura, módulos y contratos de datos antes de escribir código.' },
  { n: '03', title: 'Construcción', desc: 'Desarrollo incremental con entregas reales. El software funciona desde la primera iteración.' },
  { n: '04', title: 'Evolución', desc: 'El sistema crece con el negocio. Monitoreo, mejoras y expansión controlada.' },
]

function StepCard({ s, i }: { s: (typeof STEPS)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: i * 0.12 }}
      className="relative bg-black p-9 group hover:bg-white/[0.02] transition-colors duration-300 border-r border-b border-white/[0.07] last:border-r-0 md:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r lg:[&:nth-child(4)]:border-r-0">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-green-500/25 bg-green-500/[0.07] mb-8 group-hover:border-green-500/50 transition-colors">
        <span className="font-extrabold text-[15px] text-green-400">{s.n}</span>
      </div>
      <h3 className="font-bold text-[18px] text-white mb-3">{s.title}</h3>
      <p className="text-[13px] text-white/45 leading-[1.75]">{s.desc}</p>
    </motion.div>
  )
}

function MethodSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="metodo" className="py-36 bg-black relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-[11px] font-bold text-green-400 tracking-[0.2em] uppercase mb-3">
              Método
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold tracking-tight text-white leading-[1.0]">
              Cómo trabajamos.
            </motion.h2>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="text-[14px] text-white/40 max-w-xs leading-relaxed">
            Una secuencia que reduce improvisación y convierte intención en software que funciona.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/[0.07] rounded-3xl overflow-hidden">
          {STEPS.map((s, i) => <StepCard key={s.n} s={s} i={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ── CTA Banner ─────────────────────────────────────────────── */
function CtaBanner() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 bg-[#030303] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div ref={ref} initial={{ opacity: 0, y: 32, scale: 0.98 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.85 }}
          className="relative rounded-3xl overflow-hidden border border-white/[0.07] bg-white/[0.02] p-20 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_130%,rgba(52,216,116,0.1)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_90%_5%,rgba(99,102,241,0.08)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-grid opacity-15" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-500/30 bg-green-500/[0.07] mb-6">
              <Zap size={12} className="text-green-400" />
              <span className="text-[11px] font-bold text-green-400 tracking-widest uppercase">Empieza hoy</span>
            </div>
            <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-extrabold tracking-tight text-white mb-6 max-w-2xl mx-auto leading-[0.97]">
              Convierte tu operación en
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-violet-400">un sistema que escala.</span>
            </h2>
            <p className="text-[15px] text-white/45 mb-12 max-w-[420px] mx-auto leading-relaxed">
              Un diagnóstico inicial para entender tu fricción y cómo la convertiríamos en sistema.
            </p>
            <a href="#contacto">
              <button className="group h-14 px-12 rounded-2xl bg-white text-black font-bold text-[16px] flex items-center gap-3 mx-auto hover:bg-white/90 transition-all">
                Iniciar conversación <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Contact ─────────────────────────────────────────────────── */
const NEEDS = ['Software operativo', 'Automatización por consultoría', 'Producto SaaS', 'Plataforma interna', 'Exploración inicial']

function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [form, setForm] = useState({ nombre: '', empresa: '', correo: '', tipo_necesidad: '', contexto: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setStatus(res.ok ? 'ok' : 'err')
    } catch { setStatus('err') }
  }

  const field = 'w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-[14px] text-white placeholder:text-white/25 focus:border-green-500/50 focus:outline-none transition-colors'

  return (
    <section id="contacto" className="py-36 bg-black relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(52,216,116,0.04)_0%,transparent_65%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-[11px] font-bold text-green-400 tracking-[0.2em] uppercase mb-3">Contacto</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold tracking-tight text-white mb-5">Trabajemos juntos.</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="text-[14px] text-white/40 max-w-md mx-auto leading-relaxed">Entre más claro llegue el caso, mejor podemos responder con criterio.</motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }}>
            <AnimatePresence mode="wait">
              {status === 'ok' ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-green-500/25 bg-green-500/5 p-16 text-center">
                  <CheckCircle2 size={48} className="text-green-400 mx-auto mb-5" />
                  <h3 className="text-xl font-bold text-white mb-2">Mensaje recibido</h3>
                  <p className="text-[14px] text-white/45">Te contactaremos pronto al correo indicado.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">Nombre</label>
                    <input className={field} placeholder="Tu nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">Empresa</label>
                    <input className={field} placeholder="Nombre de la empresa" value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">Correo</label>
                    <input type="email" className={field} placeholder="nombre@empresa.com" value={form.correo} onChange={e => setForm(f => ({ ...f, correo: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">Necesidad</label>
                    <select className={field} value={form.tipo_necesidad} onChange={e => setForm(f => ({ ...f, tipo_necesidad: e.target.value }))} required>
                      <option value="">Selecciona una opción</option>
                      {NEEDS.map(n => <option key={n} className="bg-[#111]">{n}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">Contexto</label>
                    <textarea className={cn(field, 'resize-none')} rows={5} placeholder="Describe brevemente la operación, el problema actual y qué te gustaría resolver." value={form.contexto} onChange={e => setForm(f => ({ ...f, contexto: e.target.value }))} required />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between gap-4">
                    {status === 'err' && <p className="text-[13px] text-red-400">Hubo un problema. Intenta de nuevo.</p>}
                    <div className="ml-auto">
                      <button type="submit" disabled={status === 'sending'} className="group h-12 px-8 rounded-2xl bg-white text-black font-bold text-[14px] flex items-center gap-2.5 hover:bg-white/90 disabled:opacity-50 transition-all">
                        {status === 'sending' ? 'Enviando…' : (<>Enviar mensaje <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></>)}
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/logo-wfs.png" alt="WiseForge Studio" width={26} height={26} className="rounded-md opacity-70" />
          <span className="font-semibold text-[14px] text-white/70">WiseForge Studio</span>
        </div>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-[13px] text-white/30 hover:text-white/60 transition-colors">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[13px] text-white/30">
          <a href="mailto:contacto@wiseforgestudio.com" className="flex items-center gap-1.5 hover:text-white/60 transition-colors">
            <Mail size={13} /> contacto@wiseforgestudio.com
          </a>
          <span>·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function Page() {
  return (
    <>
      <CursorSpotlight />
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <CapabilitiesSection />
        <MethodSection />
        <CtaBanner />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
