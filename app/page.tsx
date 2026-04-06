'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  useInView,
  AnimatePresence,
} from 'framer-motion'
import {
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  CheckCircle2,
  Boxes,
  Cpu,
  GitMerge,
  LayoutDashboard,
  ChevronRight,
  Mail,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const HeroScene = dynamic(() => import('@/components/3d/hero-scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
    </div>
  ),
})

/* ── Utilities ───────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
}

function useTilt() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 25 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 25 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onMouseLeave() { x.set(0); y.set(0) }

  return { rotateX, rotateY, onMouseMove, onMouseLeave }
}

/* ── Navbar ──────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Productos', href: '#productos' },
  { label: 'Capacidades', href: '#capacidades' },
  { label: 'Método', href: '#metodo' },
  { label: 'Contacto', href: '#contacto' },
]

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
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'glass border-b border-border' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-brand/10 border border-brand/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-brand" />
          </div>
          <span className="font-display font-700 text-[15px] tracking-tight text-ink">
            WiseForge <span className="text-ink-muted font-400">Studio</span>
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-ink-muted hover:text-ink transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#contacto">
            <button className="h-8 px-4 rounded-lg bg-brand text-bg-base text-[13px] font-semibold hover:bg-brand/90 transition-colors">
              Contactar
            </button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-ink-muted" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-border px-6 pb-5"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-[14px] text-ink-muted hover:text-ink border-b border-border last:border-0"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

/* ── Hero ────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-grid">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-[#050508]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_65%_50%,rgba(52,216,116,0.07)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_60%,rgba(99,102,241,0.05)_0%,transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand/30 bg-brand/8 mb-7"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[12px] font-semibold text-brand tracking-wide uppercase">
              Studio de software operativo
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-display font-800 text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.08] tracking-tight text-ink mb-6"
          >
            Software que
            <br />
            <span className="gradient-text">opera tu empresa</span>
            <br />
            de verdad.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-[15px] leading-[1.7] text-ink-muted max-w-[460px] mb-10"
          >
            Diseñamos soluciones para empresas que necesitan control, trazabilidad y
            una capa digital más seria. No piezas sueltas — sistemas completos.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap gap-4"
          >
            <a href="#productos">
              <button className="group h-11 px-7 rounded-xl bg-brand text-bg-base font-semibold text-[14px] flex items-center gap-2 hover:bg-brand/90 transition-all hover:gap-3">
                Ver productos <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </a>
            <a href="#contacto">
              <button className="h-11 px-7 rounded-xl border border-border bg-bg-surface/50 text-ink text-[14px] font-medium hover:border-border-strong hover:bg-bg-surface transition-all">
                Contactar estudio
              </button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex gap-8 mt-12 pt-10 border-t border-border"
          >
            {[
              { n: '2', label: 'Productos en mercado' },
              { n: '100%', label: 'Local-first' },
              { n: '0→1', label: 'Desde cero' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-700 text-ink">{s.n}</div>
                <div className="text-[12px] text-ink-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          className="relative h-[480px] lg:h-[580px]"
        >
          {/* Glow behind canvas */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 rounded-full bg-brand/8 blur-[80px] animate-glow-pulse" />
          </div>
          <HeroScene />

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-12 left-0 glass rounded-xl px-4 py-2.5 border border-brand/20"
          >
            <p className="text-[11px] text-ink-muted font-medium">Fase activa</p>
            <p className="text-[13px] font-semibold text-brand">HQ Bootstrap</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-20 right-4 glass rounded-xl px-4 py-2.5 border border-border"
          >
            <p className="text-[11px] text-ink-muted font-medium">Agentes activos</p>
            <p className="text-[13px] font-semibold text-ink">14 agentes</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-dim"
      >
        <ArrowDown size={16} />
      </motion.div>
    </section>
  )
}

/* ── Products ────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 'assetmaster',
    name: 'AssetMaster',
    tag: 'ERP Documental',
    tagColor: 'text-accent border-accent/30 bg-accent/8',
    description:
      'Control documental con aprobaciones, trazabilidad de activos y flujos de trabajo estructurados. Para organizaciones que necesitan rigor operativo.',
    features: ['Aprobaciones multi-nivel', 'Control de activos', 'Trazabilidad completa', 'Reportería ejecutiva'],
    image: '/assetmaster-shot.png',
    logo: '/assetmaster-logo.svg',
    glow: 'rgba(99,102,241,0.12)',
    accent: '#6366f1',
  },
  {
    id: 'ganamaxcol',
    name: 'GanaMaxcol',
    tag: 'ERP Ganadero',
    tagColor: 'text-brand border-brand/30 bg-brand/8',
    description:
      'Software vertical para operación ganadera en campo. Salud animal, reproducción, pesajes y producción — diseñado para el trabajo real.',
    features: ['Salud animal', 'Reproducción', 'Pesajes y producción', 'Alertas operativas'],
    image: '/ganamaxcol-shot.png',
    logo: '/ganamaxcol-logo.svg',
    glow: 'rgba(52,216,116,0.12)',
    accent: '#34d874',
  },
]

function ProductCard({ product, index }: { product: (typeof PRODUCTS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const tilt = useTilt()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.15 }}
      className="perspective"
    >
      <motion.div
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="relative rounded-2xl border border-border bg-bg-surface overflow-hidden group cursor-default"
      >
        {/* Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${product.glow} 0%, transparent 70%)` }}
        />

        <div className="p-8 lg:p-10">
          <div className="flex items-start justify-between mb-7">
            <div>
              <div
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide uppercase mb-4',
                  product.tagColor
                )}
              >
                {product.tag}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center overflow-hidden bg-bg-muted">
                  <Image src={product.logo} alt={product.name} width={24} height={24} />
                </div>
                <h3 className="font-display text-2xl font-700 text-ink">{product.name}</h3>
              </div>
            </div>
          </div>

          <p className="text-[14px] leading-[1.7] text-ink-muted mb-7 max-w-[420px]">{product.description}</p>

          <ul className="grid grid-cols-2 gap-2 mb-8">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[13px] text-ink-muted">
                <CheckCircle2 size={13} style={{ color: product.accent }} className="shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {/* Product screenshot — 3D float effect */}
          <div
            className="relative rounded-xl overflow-hidden border border-border bg-bg-muted"
            style={{ transform: 'translateZ(20px)' }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
              style={{ background: `linear-gradient(to bottom, transparent 60%, ${product.glow} 100%)` }}
            />
            <Image
              src={product.image}
              alt={`${product.name} screenshot`}
              width={680}
              height={400}
              className="w-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProductsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="productos" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#050508]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="max-w-xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[12px] font-semibold text-brand tracking-widest uppercase mb-3"
          >
            Productos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(2rem,4vw,3rem)] font-700 tracking-tight text-ink leading-[1.1]"
          >
            Software que funciona
            <br />
            <span className="text-ink-muted font-400">en el mundo real.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Capabilities ────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    icon: Boxes,
    title: 'Productos SaaS verticales',
    desc: 'Construimos software específico para industrias con lógica propia. Sin plantillas genéricas.',
    color: '#6366f1',
  },
  {
    icon: LayoutDashboard,
    title: 'Software operativo',
    desc: 'Plataformas internas que reemplazan Excel y procesos manuales. Digitalizamos operaciones reales.',
    color: '#34d874',
  },
  {
    icon: GitMerge,
    title: 'Consultoría de automatización',
    desc: 'Integraciones, flujos y agentes que reducen trabajo repetitivo. Diagnosticamos, diseñamos y construimos.',
    color: '#f59e0b',
  },
  {
    icon: Cpu,
    title: 'Plataformas internas',
    desc: 'Herramientas que amplifican equipos de operación. Governance, aprobaciones y trazabilidad.',
    color: '#a78bfa',
  },
]

function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="capacidades" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-bg-2" />
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[12px] font-semibold text-brand tracking-widest uppercase mb-3"
          >
            Capacidades
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-700 tracking-tight text-ink leading-[1.1]"
          >
            Lo que construimos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[14px] text-ink-muted leading-relaxed"
          >
            Cuatro líneas de trabajo, un solo objetivo: que tu operación funcione mejor.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CAPABILITIES.map((c, i) => {
            const Icon = c.icon
            const ref2 = useRef<HTMLDivElement>(null)
            const inV = useInView(ref2, { once: true, margin: '-40px' })
            return (
              <motion.div
                key={c.title}
                ref={ref2}
                initial={{ opacity: 0, y: 32 }}
                animate={inV ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group relative rounded-2xl border border-border bg-bg-surface p-7 hover:border-border-strong transition-all duration-300 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse 60% 60% at 30% 30%, ${c.color}12 0%, transparent 70%)` }}
                />
                <div
                  className="w-10 h-10 rounded-xl border mb-5 flex items-center justify-center relative"
                  style={{ borderColor: `${c.color}30`, background: `${c.color}10` }}
                >
                  <Icon size={18} style={{ color: c.color }} />
                </div>
                <h3 className="font-display font-600 text-[15px] text-ink mb-2 leading-snug">{c.title}</h3>
                <p className="text-[13px] text-ink-muted leading-[1.65]">{c.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Method ──────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Discovery', desc: 'Entendemos la operación real: fricción, actores, datos y prioridad. Sin suposiciones.' },
  { n: '02', title: 'Definición del sistema', desc: 'Diseñamos la arquitectura, los módulos y los contratos de datos antes de escribir código.' },
  { n: '03', title: 'Construcción', desc: 'Desarrollo incremental con entregas reales. El software funciona desde la primera iteración.' },
  { n: '04', title: 'Evolución', desc: 'El sistema crece con el negocio. Monitoreo, mejoras y expansión controlada.' },
]

function MethodSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="metodo" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#050508]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="max-w-xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[12px] font-semibold text-brand tracking-widest uppercase mb-3"
          >
            Método
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-700 tracking-tight text-ink"
          >
            Cómo trabajamos.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

          {STEPS.map((s, i) => {
            const refS = useRef<HTMLDivElement>(null)
            const inV = useInView(refS, { once: true, margin: '-40px' })
            return (
              <motion.div
                key={s.n}
                ref={refS}
                initial={{ opacity: 0, y: 28 }}
                animate={inV ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="relative px-6 py-8 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-bg-surface border border-border flex items-center justify-center mb-6 group-hover:border-brand/40 transition-colors duration-300 relative z-10">
                  <span className="font-display font-700 text-[15px] text-brand">{s.n}</span>
                </div>
                <h3 className="font-display font-600 text-[16px] text-ink mb-2">{s.title}</h3>
                <p className="text-[13px] text-ink-muted leading-[1.65]">{s.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Contact ─────────────────────────────────────────────────── */
const NEEDS = [
  'Software operativo',
  'Automatización por consultoría',
  'Producto SaaS',
  'Plataforma interna',
  'Exploración inicial',
]

function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [form, setForm] = useState({ nombre: '', empresa: '', correo: '', tipo_necesidad: '', contexto: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  const fieldCls =
    'w-full bg-bg-muted border border-border rounded-xl px-4 py-3 text-[14px] text-ink placeholder:text-ink-dim focus:border-brand/50 focus:outline-none transition-colors'

  return (
    <section id="contacto" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-bg-2" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(52,216,116,0.06)_0%,transparent_65%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-[12px] font-semibold text-brand tracking-widest uppercase mb-3"
            >
              Contacto
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-700 tracking-tight text-ink mb-4"
            >
              Trabajemos juntos.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="text-[14px] text-ink-muted max-w-md mx-auto leading-relaxed"
            >
              Entre más claro llegue el caso, mejor podemos responder con criterio.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
          >
            <AnimatePresence mode="wait">
              {status === 'ok' ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-brand/30 bg-brand/5 p-12 text-center"
                >
                  <CheckCircle2 size={40} className="text-brand mx-auto mb-4" />
                  <h3 className="font-display text-xl font-600 text-ink mb-2">Mensaje recibido</h3>
                  <p className="text-[14px] text-ink-muted">Te contactaremos pronto al correo indicado.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border bg-bg-surface p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <div>
                    <label className="block text-[12px] font-semibold text-ink-muted uppercase tracking-wide mb-2">Nombre</label>
                    <input
                      className={fieldCls}
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-ink-muted uppercase tracking-wide mb-2">Empresa</label>
                    <input
                      className={fieldCls}
                      placeholder="Nombre de la empresa"
                      value={form.empresa}
                      onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-ink-muted uppercase tracking-wide mb-2">Correo</label>
                    <input
                      type="email"
                      className={fieldCls}
                      placeholder="nombre@empresa.com"
                      value={form.correo}
                      onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-ink-muted uppercase tracking-wide mb-2">Necesidad</label>
                    <select
                      className={fieldCls}
                      value={form.tipo_necesidad}
                      onChange={(e) => setForm((f) => ({ ...f, tipo_necesidad: e.target.value }))}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      {NEEDS.map((n) => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[12px] font-semibold text-ink-muted uppercase tracking-wide mb-2">Contexto</label>
                    <textarea
                      className={cn(fieldCls, 'resize-none')}
                      rows={5}
                      placeholder="Describe brevemente la operación, el problema actual y qué te gustaría resolver."
                      value={form.contexto}
                      onChange={(e) => setForm((f) => ({ ...f, contexto: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between gap-4">
                    {status === 'err' && (
                      <p className="text-[13px] text-red-400">Hubo un problema. Intenta de nuevo.</p>
                    )}
                    <div className="ml-auto">
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="group h-11 px-8 rounded-xl bg-brand text-bg-base font-semibold text-[14px] flex items-center gap-2 hover:bg-brand/90 disabled:opacity-50 transition-all"
                      >
                        {status === 'sending' ? 'Enviando…' : (
                          <>Enviar mensaje <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></>
                        )}
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

/* ── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-[#050508] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-brand/10 border border-brand/30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-sm bg-brand" />
          </div>
          <span className="font-display font-600 text-[14px] text-ink">WiseForge Studio</span>
        </div>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[13px] text-ink-dim hover:text-ink-muted transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:contacto@wiseforgestudio.com"
            className="flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink transition-colors"
          >
            <Mail size={13} /> contacto@wiseforgestudio.com
          </a>
          <a
            href="/hq"
            className="flex items-center gap-1.5 text-[13px] text-ink-dim hover:text-ink-muted transition-colors"
          >
            <ExternalLink size={12} /> HQ
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-border text-center text-[12px] text-ink-dim">
        © {new Date().getFullYear()} WiseForge Studio. Todos los derechos reservados.
      </div>
    </footer>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <CapabilitiesSection />
        <MethodSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
