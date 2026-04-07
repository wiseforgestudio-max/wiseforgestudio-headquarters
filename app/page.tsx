'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'motion/react'
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
  Mail,
  ExternalLink,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Hero1 } from '@/components/ui/hero-1'
import { SplineScene } from '@/components/ui/splite'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'

/* ── Animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay: i * 0.1,
    },
  }),
}

/* ── Tilt hook ──────────────────────────────────────────────── */
function useTilt() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 25 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 25 })
  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onMouseLeave() { x.set(0); y.set(0) }
  return { rotateX, rotateY, onMouseMove, onMouseLeave }
}

/* ── Navbar ─────────────────────────────────────────────────── */
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
        <a href="#" className="flex items-center gap-2.5">
          <Image src="/logo-wfs.png" alt="WiseForge Studio" width={28} height={28} className="rounded-md" />
          <span className="font-display font-bold text-[15px] tracking-tight text-ink">
            WiseForge <span className="text-ink-muted font-normal">Studio</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[13px] text-ink-muted hover:text-ink transition-colors font-medium">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="#contacto">
            <button className="h-9 px-5 rounded-xl bg-brand text-bg-base text-[13px] font-bold hover:bg-brand/90 transition-all shadow-[0_0_20px_rgba(52,216,116,0.25)]">
              Contactar
            </button>
          </a>
        </div>

        <button className="md:hidden text-ink-muted" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-border px-6 pb-5"
          >
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-[14px] text-ink-muted hover:text-ink border-b border-border last:border-0">
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

/* ── Hero — usa Hero1 component ─────────────────────────────── */
function HeroSection() {
  return <Hero1 />
}

/* ── Spline 3D Showcase ─────────────────────────────────────── */
function SplineShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 relative overflow-hidden bg-[#050508]">
      <div className="absolute top-0 inset-x-0 h-px section-line" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[11px] font-bold text-brand tracking-[0.2em] uppercase mb-3"
          >
            Tecnología
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold tracking-tight text-ink"
          >
            Sistemas interactivos en 3D.
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden border-border">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
            <div className="flex h-full">
              {/* Left content */}
              <div className="flex-1 p-10 relative z-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand/35 bg-brand/[0.07] mb-6 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span className="text-[11px] font-bold text-brand tracking-widest uppercase">3D Interactive</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 font-display leading-tight">
                  Sistemas que
                  <br />se pueden ver.
                </h3>
                <p className="mt-5 text-neutral-400 max-w-xs text-[14px] leading-relaxed">
                  WiseForge construye capas digitales complejas con interfaces claras, modernas y preparadas para operar.
                </p>
                <a href="#productos" className="mt-8 w-fit">
                  <button className="group h-11 px-6 rounded-xl bg-brand text-bg-base font-bold text-[14px] flex items-center gap-2 hover:bg-brand/90 transition-all shadow-[0_0_30px_rgba(52,216,116,0.25)]">
                    Ver productos <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </a>
              </div>

              {/* Right — Spline 3D scene */}
              <div className="flex-1 relative hidden md:block">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
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
      'Control documental con aprobaciones multi-nivel, trazabilidad de activos y flujos de trabajo estructurados. Para organizaciones que necesitan rigor operativo.',
    features: [
      'Aprobaciones multi-nivel',
      'Control de activos',
      'Trazabilidad completa',
      'Reportería ejecutiva',
      'Flujos configurables',
      'Evidencia documental',
    ],
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
    features: [
      'Salud animal',
      'Reproducción',
      'Pesajes y producción',
      'Alertas operativas',
      'Multifinca',
      'Trazabilidad de campo',
    ],
    image: '/ganamaxcol-shot.png',
    logo: '/ganamaxcol-logo.svg',
    href: 'https://ganamaxcol.vercel.app',
    glow: '#34d874',
  },
]

function BrowserMockup({
  image,
  alt,
  glow,
  reverse,
}: {
  image: string
  alt: string
  glow: string
  reverse?: boolean
}) {
  const tilt = useTilt()
  return (
    <div className="perspective relative">
      <motion.div
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        initial={{ opacity: 0, y: 24, rotateY: reverse ? 8 : -8 }}
        whileInView={{ opacity: 1, y: 0, rotateY: reverse ? 4 : -4 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className="rounded-2xl overflow-hidden border border-white/[0.09]"
          style={{ boxShadow: `0 40px 90px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05), 0 0 80px ${glow}18` }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3.5 bg-[#0d0d1a] border-b border-white/[0.07]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div className="ml-3 flex-1 h-5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center px-3 gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <div className="h-2 rounded flex-1 bg-white/[0.06]" />
            </div>
          </div>
          {/* Screenshot */}
          <Image src={image} alt={alt} width={720} height={450} className="w-full object-cover" />
        </div>
        {/* Glow reflection */}
        <div
          className="absolute -bottom-6 inset-x-10 h-10 blur-3xl opacity-35 rounded-full"
          style={{ background: glow }}
        />
      </motion.div>
    </div>
  )
}

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
        'grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center',
        reverse && 'lg:[&>div:first-child]:order-2'
      )}
    >
      {/* Text side */}
      <div>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-7"
          style={{ borderColor: `${product.tagColor}40`, background: `${product.tagColor}0e`, color: product.tagColor }}
        >
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase">{product.tag}</span>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl border border-white/[0.09] bg-white/[0.04] flex items-center justify-center overflow-hidden">
            <Image src={product.logo} alt={product.name} width={26} height={26} />
          </div>
          <h3 className="font-display text-[2.4rem] font-extrabold text-ink tracking-tight leading-none">
            {product.name}
          </h3>
        </div>

        <p className="text-[15px] leading-[1.8] text-ink-muted mb-9 max-w-[400px]">
          {product.description}
        </p>

        <ul className="grid grid-cols-2 gap-3 mb-10">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[13px] text-ink-muted">
              <CheckCircle2 size={14} style={{ color: product.tagColor }} className="shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <a href={product.href} target="_blank" rel="noopener noreferrer">
            <button
              className="group h-11 px-6 rounded-xl text-[14px] font-bold flex items-center gap-2 transition-all"
              style={{
                background: product.tagColor,
                color: '#050508',
                boxShadow: `0 0 30px ${product.tagColor}35`,
              }}
            >
              Ver demo <ExternalLink size={14} />
            </button>
          </a>
          <a href="#contacto">
            <button className="h-11 px-6 rounded-xl border border-border text-[14px] text-ink-muted font-medium hover:border-border-strong hover:text-ink transition-all">
              Solicitar acceso
            </button>
          </a>
        </div>
      </div>

      {/* Browser mockup visual */}
      <BrowserMockup
        image={product.image}
        alt={`${product.name} screenshot`}
        glow={product.glow}
        reverse={reverse}
      />
    </motion.div>
  )
}

function ProductsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="productos" className="py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#050508]" />
      <div className="absolute top-0 inset-x-0 h-px section-line" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[11px] font-bold text-brand tracking-[0.2em] uppercase mb-3"
          >
            Productos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(2.2rem,5vw,4rem)] font-extrabold tracking-tight text-ink leading-[1.0]"
          >
            Software que funciona
            <br />
            <span className="gradient-text-alt">en el mundo real.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="mt-5 text-[15px] text-ink-muted leading-relaxed max-w-md mx-auto"
          >
            Dos sistemas con identidad propia, foco de mercado claro y arquitectura lista para crecer.
          </motion.p>
        </div>

        <div className="space-y-36">
          {PRODUCTS.map((p, i) => (
            <ProductItem key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Capabilities ───────────────────────────────────────────── */
const CAPABILITIES = [
  {
    icon: Boxes,
    title: 'Productos SaaS verticales',
    desc: 'Construimos software específico para industrias con lógica propia. Sin plantillas genéricas — sistemas diseñados desde la operación real con arquitectura lista para escalar.',
    color: '#6366f1',
    large: true,
  },
  {
    icon: LayoutDashboard,
    title: 'Software operativo',
    desc: 'Plataformas que reemplazan Excel y procesos manuales. Digitalizamos la operación real.',
    color: '#34d874',
    large: false,
  },
  {
    icon: GitMerge,
    title: 'Automatización',
    desc: 'Integraciones, flujos y agentes que reducen trabajo repetitivo con criterio operativo.',
    color: '#f59e0b',
    large: false,
  },
  {
    icon: Cpu,
    title: 'Plataformas internas',
    desc: 'Herramientas que amplifican equipos. Governance, aprobaciones y trazabilidad.',
    color: '#a78bfa',
    large: false,
  },
]

function CapabilityCard({ c, i, large }: { c: (typeof CAPABILITIES)[0]; i: number; large?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const Icon = c.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.1 }}
      className={cn(
        'group relative rounded-3xl border border-border bg-bg-surface overflow-hidden hover:border-border-strong transition-all duration-300',
        large ? 'md:col-span-2 p-10 min-h-[260px] flex flex-col justify-between' : 'p-7'
      )}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `radial-gradient(ellipse 70% 80% at ${large ? '15%' : '30%'} 30%, ${c.color}14 0%, transparent 70%)` }}
      />
      {large && (
        <div
          className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full opacity-[0.05]"
          style={{ background: c.color }}
        />
      )}

      <div
        className={cn('rounded-2xl border flex items-center justify-center relative', large ? 'w-14 h-14 mb-8' : 'w-11 h-11 mb-5')}
        style={{ borderColor: `${c.color}35`, background: `${c.color}12` }}
      >
        <Icon size={large ? 24 : 20} style={{ color: c.color }} />
      </div>

      <div>
        <h3 className={cn('font-display font-bold text-ink mb-2.5 leading-snug', large ? 'text-[1.4rem]' : 'text-[15px]')}>
          {c.title}
        </h3>
        <p className={cn('text-ink-muted leading-[1.7]', large ? 'text-[14px] max-w-[380px]' : 'text-[13px]')}>
          {c.desc}
        </p>
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
    <section id="capacidades" className="py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-bg-2" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-0 inset-x-0 h-px section-line" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="text-center max-w-xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[11px] font-bold text-brand tracking-[0.2em] uppercase mb-3"
          >
            Capacidades
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold tracking-tight text-ink leading-[1.0]"
          >
            Lo que construimos.
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

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {CAPABILITIES.map((c, i) => (
            <CapabilityCard key={c.title} c={c} i={i} large={i === 0} />
          ))}
        </div>

        {/* Stats banner */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 24 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-brand/20 bg-brand/[0.04] p-8 flex flex-wrap items-center justify-around gap-8"
        >
          {[
            { n: 'SaaS', label: 'Productos propios en producción' },
            { n: 'ERP', label: 'Software operativo enterprise' },
            { n: 'n8n + IA', label: 'Stack de automatización' },
            { n: 'B2B', label: 'Foco exclusivo de mercado' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-[2.2rem] font-extrabold text-brand leading-none">{s.n}</div>
              <div className="text-[12px] text-ink-dim mt-1.5 tracking-wide">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Method ─────────────────────────────────────────────────── */
const STEPS = [
  {
    n: '01',
    title: 'Discovery',
    desc: 'Entendemos la operación real: fricción, actores, datos y prioridad. Sin suposiciones.',
  },
  {
    n: '02',
    title: 'Definición',
    desc: 'Diseñamos arquitectura, módulos y contratos de datos antes de escribir código.',
  },
  {
    n: '03',
    title: 'Construcción',
    desc: 'Desarrollo incremental con entregas reales. El software funciona desde la primera iteración.',
  },
  {
    n: '04',
    title: 'Evolución',
    desc: 'El sistema crece con el negocio. Monitoreo, mejoras y expansión controlada.',
  },
]

function StepCard({ s, i }: { s: (typeof STEPS)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.12 }}
      className="relative bg-[#050508] p-9 group hover:bg-bg-surface transition-colors duration-300 border-r border-b border-border last:border-r-0 md:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r lg:[&:nth-child(4)]:border-r-0"
    >
      {/* Step badge */}
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-brand/30 bg-brand/[0.07] mb-8 group-hover:border-brand/55 transition-colors">
        <span className="font-display font-extrabold text-[15px] text-brand">{s.n}</span>
      </div>
      <h3 className="font-display font-bold text-[18px] text-ink mb-3">{s.title}</h3>
      <p className="text-[13px] text-ink-muted leading-[1.75]">{s.desc}</p>
    </motion.div>
  )
}

function MethodSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="metodo" className="py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#050508]" />
      <div className="absolute top-0 inset-x-0 h-px section-line" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-[11px] font-bold text-brand tracking-[0.2em] uppercase mb-3"
            >
              Método
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold tracking-tight text-ink leading-[1.0]"
            >
              Cómo trabajamos.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[14px] text-ink-muted max-w-xs leading-relaxed"
          >
            Una secuencia que reduce improvisación y convierte intención en software que funciona.
          </motion.p>
        </div>

        {/* Steps grid with dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-border rounded-3xl overflow-hidden">
          {STEPS.map((s, i) => (
            <StepCard key={s.n} s={s} i={i} />
          ))}
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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-bg-2" />
      <div className="absolute top-0 inset-x-0 h-px section-line" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-bg-surface p-20 text-center"
        >
          {/* Gradient backgrounds */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_130%,rgba(52,216,116,0.12)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_90%_5%,rgba(99,102,241,0.1)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_10%_95%,rgba(167,139,250,0.07)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-grid opacity-20" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand/35 bg-brand/[0.07] backdrop-blur-sm mb-6">
              <Zap size={12} className="text-brand" />
              <span className="text-[11px] font-bold text-brand tracking-[0.15em] uppercase">
                Empieza hoy
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-extrabold tracking-tight text-ink mb-6 max-w-2xl mx-auto leading-[0.97]">
              Convierte tu operación en
              <br />
              <span className="gradient-text">un sistema que escala.</span>
            </h2>
            <p className="text-[15px] text-ink-muted mb-12 max-w-[440px] mx-auto leading-relaxed">
              Un diagnóstico inicial para entender tu fricción y cómo la convertiríamos en sistema.
            </p>
            <a href="#contacto">
              <button className="group h-14 px-12 rounded-2xl bg-brand text-bg-base font-bold text-[16px] flex items-center gap-3 mx-auto hover:bg-brand/90 transition-all hover:gap-4 shadow-[0_0_60px_rgba(52,216,116,0.35)]">
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
  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    correo: '',
    tipo_necesidad: '',
    contexto: '',
  })

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
    'w-full bg-bg-muted border border-border rounded-xl px-4 py-3.5 text-[14px] text-ink placeholder:text-ink-dim focus:border-brand/50 focus:outline-none transition-colors'

  return (
    <section id="contacto" className="py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#050508]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(52,216,116,0.05)_0%,transparent_65%)]" />
      <div className="absolute top-0 inset-x-0 h-px section-line" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-[11px] font-bold text-brand tracking-[0.2em] uppercase mb-3"
            >
              Contacto
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold tracking-tight text-ink mb-5"
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
                  className="rounded-3xl border border-brand/30 bg-brand/5 p-16 text-center"
                >
                  <CheckCircle2 size={48} className="text-brand mx-auto mb-5" />
                  <h3 className="font-display text-xl font-bold text-ink mb-2">Mensaje recibido</h3>
                  <p className="text-[14px] text-ink-muted">Te contactaremos pronto al correo indicado.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="rounded-3xl border border-border bg-bg-surface p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-ink-dim uppercase tracking-widest mb-2">Nombre</label>
                    <input
                      className={fieldCls}
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-ink-dim uppercase tracking-widest mb-2">Empresa</label>
                    <input
                      className={fieldCls}
                      placeholder="Nombre de la empresa"
                      value={form.empresa}
                      onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-ink-dim uppercase tracking-widest mb-2">Correo</label>
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
                    <label className="block text-[11px] font-bold text-ink-dim uppercase tracking-widest mb-2">Necesidad</label>
                    <select
                      className={fieldCls}
                      value={form.tipo_necesidad}
                      onChange={(e) => setForm((f) => ({ ...f, tipo_necesidad: e.target.value }))}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      {NEEDS.map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-ink-dim uppercase tracking-widest mb-2">Contexto</label>
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
                        className="group h-12 px-8 rounded-2xl bg-brand text-bg-base font-bold text-[14px] flex items-center gap-2.5 hover:bg-brand/90 disabled:opacity-50 transition-all shadow-[0_0_30px_rgba(52,216,116,0.25)]"
                      >
                        {status === 'sending' ? (
                          'Enviando…'
                        ) : (
                          <>
                            Enviar mensaje{' '}
                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                          </>
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

/* ── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-[#050508] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/logo-wfs.png" alt="WiseForge Studio" width={26} height={26} className="rounded-md opacity-80" />
          <span className="font-display font-semibold text-[14px] text-ink">WiseForge Studio</span>
        </div>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-ink-dim hover:text-ink-muted transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[13px] text-ink-dim">
          <a
            href="mailto:contacto@wiseforgestudio.com"
            className="flex items-center gap-1.5 hover:text-ink-muted transition-colors"
          >
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
        <SplineShowcase />
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
