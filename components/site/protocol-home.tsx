'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Layers3,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'

import { ContactForm } from '@/components/site/contact-form'
import AnimatedTextCycle from '@/components/ui/animated-text-cycle'
import { Card, CardContent } from '@/components/ui/card'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import GradientMenu from '@/components/ui/gradient-menu'
import { MouseSpotlight } from '@/components/ui/mouse-spotlight'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'

type HeadquartersState = typeof import('@/data/headquarters-state.json')

const menuItems = [
  { title: 'Start', href: '#start', icon: <Sparkles />, gradientFrom: '#0ea5e9', gradientTo: '#14b8a6' },
  { title: 'Studio', href: '#studio', icon: <Building2 />, gradientFrom: '#f97316', gradientTo: '#fb7185' },
  { title: 'Flow', href: '#flow', icon: <Workflow />, gradientFrom: '#8b5cf6', gradientTo: '#ec4899' },
  { title: 'Trust', href: '#trust', icon: <ShieldCheck />, gradientFrom: '#84cc16', gradientTo: '#22c55e' },
  { title: 'Contact', href: '#contact', icon: <ArrowRight />, gradientFrom: '#0f172a', gradientTo: '#334155' },
]

export function ProtocolHome({ state }: { state: HeadquartersState }) {
  const departments = state.departments.slice(0, 6).map((department) => {
    const director = state.agents.find((agent) => agent.id === department.directorAgentId)
    return {
      name: department.name,
      director: director?.name ?? 'Unassigned',
      provider: director?.provider ?? 'n/a',
      status: director?.status ?? 'idle',
    }
  })

  const statCards = [
    { label: 'Departments', value: state.departments.length },
    { label: 'Agents', value: state.agents.length },
    { label: 'Approvals', value: state.approvals.length },
    { label: 'Lead Time', value: `${state.metrics.leadTimeHours}h` },
  ]

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5efe6] text-slate-950">
      <section
        id="start"
        className="relative overflow-hidden border-b border-slate-950/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_26%),radial-gradient(circle_at_88%_18%,rgba(244,114,182,0.14),transparent_24%),linear-gradient(180deg,#f5efe6_0%,#f3ebdd_55%,#efe6d7_100%)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:48px_48px] opacity-35" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <a href="#" className="flex items-center gap-3">
            <Image src="/logo-wfs.png" alt="WiseForge Studio" width={40} height={40} className="rounded-xl" />
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-slate-950">WiseForge Studio</p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Fresh UI 2026-04-07</p>
            </div>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#studio" className="text-sm text-slate-600 transition hover:text-slate-950">Studio</a>
            <a href="#flow" className="text-sm text-slate-600 transition hover:text-slate-950">Flow</a>
            <a href="#trust" className="text-sm text-slate-600 transition hover:text-slate-950">Trust</a>
            <a
              href="#contact"
              className="inline-flex h-11 items-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Book a call
            </a>
          </nav>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-6 lg:grid-cols-[0.88fr_1.12fr] lg:pb-24">
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-950/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-600" />
              Brand new landing
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mt-8 font-display text-[clamp(4rem,8vw,8.8rem)] leading-[0.84] tracking-[-0.08em] text-slate-950"
            >
              WiseForge builds
              <span className="mt-2 block bg-[linear-gradient(135deg,#0284c7_0%,#0f766e_34%,#fb7185_72%,#f97316_100%)] bg-clip-text text-transparent">
                <AnimatedTextCycle
                  words={['living systems', 'governed AI', 'serious products', 'operational software']}
                  interval={2300}
                  className="font-display"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-8 max-w-xl text-lg leading-8 text-slate-700"
            >
              {state.meta.mission} Esta página fue reconstruida desde cero: nueva paleta, nueva
              estructura, nuevo hero y otra forma de presentar la misma información del headquarters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                className="group inline-flex h-14 items-center gap-2 rounded-full bg-slate-950 px-7 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5"
              >
                Start with WiseForge
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#flow"
                className="inline-flex h-14 items-center rounded-full border border-slate-950/10 bg-white/70 px-7 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Explore the new page
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              {statCards.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.6rem] border border-slate-950/10 bg-white/70 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
                >
                  <p className="text-4xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <Card className="relative overflow-hidden rounded-[2.5rem] border border-slate-950/10 bg-[#050816] p-0 shadow-[0_45px_120px_rgba(15,23,42,0.24)]">
              <Spotlight className="-top-44 left-8 md:left-36 md:-top-16" fill="white" />
              <MouseSpotlight className="from-cyan-100/95 via-rose-100/60 to-transparent" size={320} />

              <div className="relative min-h-[44rem] overflow-hidden">
                <div className="absolute left-6 top-6 z-20 max-w-[15rem] rounded-[1.4rem] border border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Visible marker</p>
                  <p className="mt-2 text-sm font-medium">If you see this card, you are on the new build.</p>
                </div>
                <div className="absolute bottom-6 right-6 z-20 max-w-[16rem] rounded-[1.4rem] border border-cyan-300/20 bg-cyan-300/10 p-4 text-white backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">HQ phase</p>
                  <p className="mt-2 text-sm leading-6">{state.meta.phase}</p>
                </div>
                <div className="absolute inset-x-6 top-6 z-20 ml-auto flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-white backdrop-blur">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] uppercase tracking-[0.22em]">Spline hero active</span>
                </div>
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="h-full min-h-[44rem] w-full"
                />
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-10">
          <GradientMenu items={menuItems} />
        </div>
      </section>

      <section id="studio" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-label">Studio layer</p>
            <h2 className="section-title mt-5 text-slate-950">
              This is not the old dark dashboard layout with minor tweaks.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Building2,
                title: 'Studio identity',
                copy: 'La narrativa ahora parece una marca editorial de producto, no un dashboard reciclado.',
              },
              {
                icon: Bot,
                title: 'Agent systems',
                copy: 'La información del HQ se reutiliza, pero como historia visual de orquestación y confianza.',
              },
              {
                icon: Layers3,
                title: 'Layered UX',
                copy: 'Hero, cards, menu y scroll sequence trabajan como un sistema visual nuevo.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.65 }}
                  className="rounded-[1.8rem] border border-slate-950/10 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="flow" className="border-y border-slate-950/10 bg-[#111827] py-24 text-white">
        <ContainerScroll
          titleComponent={
            <div className="mx-auto max-w-4xl px-4">
              <p className="section-label-dark">Flow sequence</p>
              <h2 className="mt-5 font-display text-4xl leading-tight md:text-6xl">
                Scroll, depth and framing now work as a central experience block.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/62">
                Aquí `ContainerScroll` ya no es un demo escondido: es una sección principal de la landing,
                con otra atmósfera y otra lectura de producto.
              </p>
            </div>
          }
        >
          <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] bg-[#0b1022]">
            <Image
              src="/landing-shot-hero-refined.png"
              alt="WiseForge headquarters visual"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,16,34,0)_0%,rgba(11,16,34,0.1)_35%,rgba(11,16,34,0.72)_100%)]" />
          </div>
        </ContainerScroll>
      </section>

      <section id="trust" className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-label">Trust layer</p>
            <h2 className="section-title mt-5 text-slate-950">
              Named departments and governance metrics, but shown with a totally different visual grammar.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-slate-600">
            La capa de confianza usa `Card` de shadcn, pero con una composición nueva, luminosa y editorial.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.58fr_0.42fr]">
          <Card className="rounded-[2rem] border border-slate-950/10 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <CardContent className="grid gap-4 p-6">
              {departments.map((department) => (
                <div
                  key={department.name}
                  className="flex flex-col gap-4 rounded-[1.4rem] border border-slate-950/10 bg-[#f8f4ee] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{department.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{department.director}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-slate-950/10 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-700">
                      {department.provider}
                    </span>
                    <span className="rounded-full border border-slate-950/10 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-700">
                      {department.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-5">
            {statCards.map((item) => (
              <Card
                key={item.label}
                className="rounded-[2rem] border border-slate-950/10 bg-[linear-gradient(180deg,#ffffff_0%,#f6f0e8_100%)] shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
              >
                <CardContent className="p-6">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                  <p className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#050816] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="section-label-dark">Contact layer</p>
              <h2 className="mt-5 font-display text-4xl leading-tight md:text-6xl">
                The whole site is now a different page.
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  'Cream editorial shell instead of the previous overall composition',
                  'A completely new hero frame with visible version marker',
                  'All requested components placed as core sections, not hidden demos',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-cyan-300" />
                    <p className="text-base leading-7 text-white/62">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
