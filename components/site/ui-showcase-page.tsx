'use client'

import Image from 'next/image'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

import AnimatedTextCycle from '@/components/ui/animated-text-cycle'
import { Card } from '@/components/ui/card'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import GradientMenu from '@/components/ui/gradient-menu'
import { MouseSpotlight } from '@/components/ui/mouse-spotlight'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'

const menuItems = [
  { title: 'Hero', href: '#hero', icon: <Sparkles />, gradientFrom: '#7dd3fc', gradientTo: '#38bdf8' },
  { title: 'Menu', href: '#menu', icon: <Play />, gradientFrom: '#f9a8d4', gradientTo: '#f97316' },
  { title: 'Scroll', href: '#scroll', icon: <ArrowRight />, gradientFrom: '#a3e635', gradientTo: '#22c55e' },
]

export function UIShowcasePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030712] text-white">
      <section
        id="hero"
        className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(244,114,182,0.16),transparent_24%),linear-gradient(180deg,#030712_0%,#0b1120_100%)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />
        <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-2 text-slate-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-white">UI Showcase</p>
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Only today components</p>
            </div>
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/70 backdrop-blur">
            Hero visible build
          </div>
        </div>

        <div className="relative z-20 mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-6 pb-16 pt-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-200"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Página nueva de prueba
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-8 font-display text-[clamp(4rem,8vw,8.5rem)] leading-[0.84] tracking-[-0.08em]"
            >
              Hero 3D
              <span className="mt-2 block bg-[linear-gradient(135deg,#7dd3fc_0%,#60a5fa_35%,#c084fc_70%,#fb7185_100%)] bg-clip-text text-transparent">
                <AnimatedTextCycle
                  words={['visible ahora', 'con spotlight', 'con botones', 'con motion']}
                  interval={2200}
                  className="font-display"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8 max-w-xl text-lg leading-8 text-white/68"
            >
              Esta página ignora la landing anterior y solo muestra los componentes visuales del hero
              y la UI que pediste agregar hoy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#menu"
                className="group inline-flex h-14 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-slate-950 shadow-[0_20px_60px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5"
              >
                Ver botones
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#scroll"
                className="inline-flex h-14 items-center rounded-full border border-white/15 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Ver scroll demo
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            className="relative"
          >
            <Card className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-black/[0.96] p-0 shadow-[0_45px_140px_rgba(0,0,0,0.55)]">
              <Spotlight className="-top-40 left-0 md:left-36 md:-top-16" fill="white" />
              <MouseSpotlight className="from-cyan-100/95 via-fuchsia-200/60 to-transparent" size={320} />

              <div className="relative min-h-[44rem] overflow-hidden">
                <div className="absolute left-6 top-6 z-20 rounded-[1.3rem] border border-white/10 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur">
                  Nuevo hero activo
                </div>
                <div className="absolute right-6 top-6 z-20 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white backdrop-blur">
                  Spline + Spotlight
                </div>
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="h-full min-h-[44rem] w-full"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="menu" className="border-y border-white/10 bg-[#07111f] px-6 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="section-label-dark">Gradient menu demo</p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
            Solo botones y navegación visual.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/62">
            Esta sección existe para que se vea el `GradientMenu` claramente, sin competir con el contenido anterior.
          </p>
          <div className="mt-12">
            <GradientMenu items={menuItems} />
          </div>
        </div>
      </section>

      <section id="scroll" className="bg-[#0b1324] py-24">
        <ContainerScroll
          titleComponent={
            <div className="mx-auto max-w-4xl px-4">
              <p className="section-label-dark">Container scroll demo</p>
              <h2 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
                Scroll animation isolated in its own showcase block.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/62">
                Este bloque deja visible `ContainerScroll` con una sola imagen de apoyo, separado del resto de la web.
              </p>
            </div>
          }
        >
          <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] bg-[#0a1024]">
            <Image
              src="/landing-shot-hero-refined.png"
              alt="UI showcase visual"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,36,0)_0%,rgba(10,16,36,0.12)_40%,rgba(10,16,36,0.78)_100%)]" />
          </div>
        </ContainerScroll>
      </section>
    </main>
  )
}
