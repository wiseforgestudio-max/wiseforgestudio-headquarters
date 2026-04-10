'use client'

import Image from 'next/image'
import { Bot, Boxes, BriefcaseBusiness, CircuitBoard, Workflow } from 'lucide-react'
import {
  IoAnalyticsOutline,
  IoConstructOutline,
  IoGitBranchOutline,
  IoLayersOutline,
  IoSparklesOutline,
} from 'react-icons/io5'

import ScrollHero from '@/components/ui/ethereal'
import GradientMenu from '@/components/ui/gradient-menu'

const sections = [
  {
    id: 'work',
    headline: 'WiseForge',
    subheadline: 'Systems With Control',
    body: 'Producto digital, software operativo y automatizacion para empresas que necesitan una base mas clara, trazable y seria.',
  },
  {
    id: 'about',
    headline: 'From Friction',
    subheadline: 'To Structure',
    body: 'El estudio lee la operacion real, ordena la complejidad y la convierte en sistemas que si se pueden usar, medir y evolucionar.',
  },
  {
    id: 'services',
    headline: 'Built',
    subheadline: 'For Operations',
    body: 'Diseñamos SaaS, plataformas internas e integraciones con criterio de negocio, no solo con criterio visual.',
  },
  {
    id: 'contact',
    headline: 'AssetMaster, Orion',
    subheadline: 'And GanaMaxcol',
    body: 'Tres productos que muestran la direccion del estudio: control documental enterprise, IA operativa y software vertical especializado.',
  },
]

const serviceMenu = [
  { title: 'SaaS', href: '#services-grid', icon: <IoLayersOutline />, gradientFrom: '#81fbb8', gradientTo: '#28c76f' },
  { title: 'Ops', href: '#services-grid', icon: <IoAnalyticsOutline />, gradientFrom: '#7dd3fc', gradientTo: '#2563eb' },
  { title: 'Flows', href: '#services-grid', icon: <IoGitBranchOutline />, gradientFrom: '#f9a8d4', gradientTo: '#ec4899' },
  { title: 'Internal', href: '#services-grid', icon: <IoConstructOutline />, gradientFrom: '#ffd166', gradientTo: '#f97316' },
  { title: 'AI', href: '#services-grid', icon: <IoSparklesOutline />, gradientFrom: '#c4b5fd', gradientTo: '#7c3aed' },
]

const offerings = [
  {
    icon: <Boxes className="h-5 w-5" />,
    label: 'Producto',
    title: 'Productos SaaS con estructura y posicionamiento claro',
    body: 'Software con identidad, jerarquia visual y una base lista para evolucionar con el negocio.',
  },
  {
    icon: <Workflow className="h-5 w-5" />,
    label: 'Operacion',
    title: 'Sistemas para seguimiento, control y trazabilidad',
    body: 'Herramientas internas para compras, activos, evidencia, coordinacion y lectura de estado.',
  },
  {
    icon: <CircuitBoard className="h-5 w-5" />,
    label: 'Automatizacion',
    title: 'Flujos, integraciones e IA aplicada con criterio',
    body: 'Analizamos donde automatizar, que integrar y que debe sostener una capa de producto mas estable.',
  },
  {
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    label: 'Consultoria',
    title: 'Direccion tecnica para decisiones de producto y sistema',
    body: 'Intervenciones para alinear experiencia, arquitectura y operacion antes de construir de mas.',
  },
]

const products = [
  {
    logo: '/assetmaster-logo.svg',
    name: 'AssetMaster',
    category: 'ERP documental',
    body: 'Control documental, activos, evidencia y trazabilidad para contextos operativos con mayor rigor.',
  },
  {
    logo: '/orion-logo.svg',
    name: 'Orion',
    category: 'AI workspace',
    body: 'Copiloto local-first para procesar informacion, analizar documentos, ejecutar tareas y convertir contexto en trabajo util.',
  },
  {
    logo: '/ganamaxcol-logo.svg',
    name: 'GanaMaxcol',
    category: 'Vertical especializado',
    body: 'Software para operacion ganadera, seguimiento de campo y continuidad diaria en un contexto real.',
  },
]

export function WiseForgeEtherealPage() {
  return (
    <main className="bg-[#050816] text-white">
      <ScrollHero
        sections={sections}
        logo="WISEFORGE"
        menuItems={['Work', 'About', 'Services', 'Contact']}
        colorPalette={{
          primary: '#2dd4bf',
          secondary: '#38bdf8',
          tertiary: '#a855f7',
          accent: '#9eff00',
          dark: '#050816',
        }}
      />

      <section className="relative z-10 border-t border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_20%),#07111f] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="section-label-dark">Servicios</p>
            <h2 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
              WiseForge Studio diseña sistemas digitales para operaciones que ya no pueden vivir en parches.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">
              Esta capa usa el nuevo hero ethereal como entrada y debajo organiza los servicios del estudio con
              una lectura mas clara y mas util para negocio.
            </p>
          </div>

          <div className="mt-12">
            <GradientMenu items={serviceMenu} />
          </div>

          <div id="services-grid" className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {offerings.map((offering) => (
              <article
                key={offering.title}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                  {offering.icon}
                </div>
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                  {offering.label}
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">{offering.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/62">{offering.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#09101d] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="section-label-dark">Ecosistema</p>
              <h2 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
                Un studio, tres productos y una misma logica de sistema.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/62">
                AssetMaster, Orion y GanaMaxcol muestran tres direcciones concretas del trabajo de WiseForge:
                control enterprise, IA aplicada a trabajo real y software vertical con operacion diaria.
              </p>

              <div className="mt-8 flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
                  <Image src="/logo-wfs.png" alt="WiseForge Studio" width={34} height={34} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Studio</p>
                  <p className="mt-2 text-lg font-semibold text-white">WiseForge Studio</p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.name}
                  className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.28)]"
                >
                  <div className="flex min-h-[72px] items-center rounded-[24px] border border-white/10 bg-black/20 px-5">
                    <Image src={product.logo} alt={product.name} width={160} height={48} className="h-auto w-auto" />
                  </div>
                  <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                    {product.category}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{product.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/62">{product.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_left,rgba(34,211,238,0.12),transparent_20%),rgba(255,255,255,0.04)] p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Direccion operativa</p>
                <h3 className="mt-4 font-display text-3xl leading-tight text-white md:text-5xl">
                  El objetivo no es solo verse moderno. Es operar con mas control.
                </h3>
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white/80 backdrop-blur">
                <Bot className="mr-2 inline-block h-4 w-4" />
                Producto + automatizacion + software operativo
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
