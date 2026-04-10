'use client'

import * as React from 'react'
import { ArrowRight, Bot, Orbit, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { motion } from 'framer-motion'

import AnimatedTextCycle from '@/components/ui/animated-text-cycle'
import GradientMenu from '@/components/ui/gradient-menu'
import { MouseSpotlight } from '@/components/ui/mouse-spotlight'
import { Card } from '@/components/ui/card'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'

type HeroMetric = {
  label: string
  value: string | number
}

type HQHeroProps = {
  mission: string
  vision: string
  metrics: HeroMetric[]
}

const menuItems = [
  { title: 'Mision', href: '#mision', icon: <Orbit />, gradientFrom: '#14b8a6', gradientTo: '#0f766e' },
  { title: 'Modelo', href: '#modelo', icon: <Bot />, gradientFrom: '#fb7185', gradientTo: '#f97316' },
  { title: 'Control', href: '#control', icon: <ShieldCheck />, gradientFrom: '#3b82f6', gradientTo: '#0891b2' },
  { title: 'Roadmap', href: '#roadmap', icon: <Workflow />, gradientFrom: '#f59e0b', gradientTo: '#ca8a04' },
]

export function HQHero({ mission, vision, metrics }: HQHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-stone-900/10 bg-[linear-gradient(180deg,#f5efe6_0%,#efe5d5_38%,#111111_38%,#111111_100%)] pb-20 pt-6 lg:pb-28">
      <div className="absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_15%_15%,rgba(20,184,166,0.18),transparent_32%),radial-gradient(circle_at_88%_20%,rgba(249,115,22,0.18),transparent_26%)]" />
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3">
          <div className="rounded-2xl bg-stone-950 p-2 text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-stone-950">WiseForge Studio</p>
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Headquarters</p>
          </div>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#mision" className="text-sm text-stone-600 transition hover:text-stone-950">Mision</a>
          <a href="#control" className="text-sm text-stone-600 transition hover:text-stone-950">Control</a>
          <a href="#contacto" className="inline-flex h-11 items-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-stone-50 transition hover:bg-stone-800">Agendar demo</a>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="pb-8 lg:pb-0">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-stone-900/10 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-600"
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              Operacion multiagente con gobierno humano
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-7 font-display text-[clamp(3.2rem,7vw,6.8rem)] leading-[0.9] tracking-[-0.06em] text-stone-950"
            >
              El HQ donde los agentes trabajan con
              <span className="mt-2 block text-transparent bg-[linear-gradient(135deg,#0f766e_0%,#f97316_56%,#7c3aed_100%)] bg-clip-text">
                <AnimatedTextCycle
                  words={['supervision real', 'aprobaciones visibles', 'trazabilidad completa', 'criterio operativo']}
                  interval={2600}
                  className="font-display"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 max-w-2xl text-lg leading-8 text-stone-700"
            >
              {mission} {vision}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#contacto"
                className="group inline-flex h-14 items-center gap-2 rounded-full bg-stone-950 px-7 text-sm font-semibold text-stone-50 shadow-[0_20px_40px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-stone-800"
              >
                Solicitar demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#control"
                className="inline-flex h-14 items-center rounded-full border border-stone-900/10 bg-white/80 px-7 text-sm font-semibold text-stone-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              >
                Ver panel de control
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 grid gap-4 sm:grid-cols-3"
            >
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-[1.5rem] border border-stone-900/10 bg-white/75 p-5">
                  <p className="text-3xl font-semibold tracking-tight text-stone-950">{metric.value}</p>
                  <p className="mt-1 text-sm text-stone-600">{metric.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="relative"
          >
            <Card className="relative overflow-hidden rounded-[2.2rem] border-white/10 bg-black/[0.96] p-0 shadow-[0_50px_120px_rgba(15,23,42,0.4)]">
              <Spotlight className="-top-48 left-0 md:left-24 md:-top-24" fill="white" />
              <MouseSpotlight className="from-orange-100/90 via-teal-200/70 to-fuchsia-200/40" size={260} />

              <div className="relative z-10 flex min-h-[34rem] flex-col lg:h-[42rem] lg:flex-row">
                <div className="flex flex-1 flex-col justify-center p-8 md:p-10 lg:p-12">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-stone-200">
                    <Bot className="h-3.5 w-3.5 text-teal-300" />
                    Live orchestration layer
                  </div>
                  <h2 className="mt-6 max-w-md font-display text-4xl leading-tight text-white md:text-5xl">
                    Robot 3D, gobierno y narrativa en la misma escena.
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-7 text-stone-300 md:text-base">
                    Aqui el `Spline` no es decoracion secundaria. Es la pieza dominante del hero y
                    dialoga con botones, glow, spotlight y paneles de mando.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-teal-200">
                      Planning required
                    </span>
                    <span className="rounded-full border border-orange-400/25 bg-orange-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-orange-200">
                      Audit everything
                    </span>
                    <span className="rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-fuchsia-200">
                      Rollback ready
                    </span>
                  </div>
                </div>

                <div className="relative min-h-[26rem] flex-1 lg:min-h-full">
                  <div className="absolute inset-y-0 left-0 z-10 hidden w-24 bg-gradient-to-r from-black via-black/70 to-transparent lg:block" />
                  <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between rounded-full border border-white/10 bg-black/35 px-4 py-2 backdrop-blur">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-stone-400">3D scene</p>
                      <p className="text-sm text-stone-200">WiseForge HQ Robot</p>
                    </div>
                    <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white">
                      spline live
                    </div>
                  </div>
                  <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="h-full min-h-[26rem] w-full"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="mt-10">
          <GradientMenu items={menuItems} />
        </div>
      </div>
    </section>
  )
}
