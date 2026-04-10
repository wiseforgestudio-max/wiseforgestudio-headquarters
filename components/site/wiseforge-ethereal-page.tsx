import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Boxes,
  BrainCircuit,
  Building2,
  Cable,
  CircuitBoard,
  ClipboardCheck,
  Database,
  FileText,
  Gauge,
  Gem,
  Layers3,
  LucideIcon,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'

type HeroStat = {
  label: string
  value: string
  detail: string
}

type Capability = {
  icon: LucideIcon
  label: string
  title: string
  body: string
}

type ProductCard = {
  logo: string
  name: string
  category: string
  body: string
  bullets: string[]
}

type FeatureStrip = {
  title: string
  body: string
}

const heroStats: HeroStat[] = [
  { label: 'Dirección', value: 'Studio + Systems', detail: 'Marca, producto, operación y software útil en una sola lectura.' },
  { label: 'Enfoque', value: 'AI + Ops', detail: 'Automatización aplicada donde de verdad reduce fricción y acelera control.' },
  { label: 'Entrega', value: 'MVP a plataforma', detail: 'Desde landing premium hasta software operativo y gobierno de procesos.' },
]

const capabilityGroups: Capability[] = [
  {
    icon: Boxes,
    label: 'Producto',
    title: 'Diseño de productos SaaS con una identidad más seria y escalable.',
    body: 'No construimos pantallas sueltas. Diseñamos sistemas de interfaz, narrativas de producto y rutas claras para crecer sin rehacer todo cada trimestre.',
  },
  {
    icon: Workflow,
    label: 'Operación',
    title: 'Software para trazabilidad, control y lectura de estado en contextos reales.',
    body: 'Compras, activos, tareas, evidencia, decisiones y seguimiento viven en flujos legibles. Menos parches, menos hojas dispersas, más continuidad.',
  },
  {
    icon: BrainCircuit,
    label: 'IA aplicada',
    title: 'Copilotos, pipelines y automatización con criterio de producto.',
    body: 'Orion representa esta línea: asistentes locales, análisis de información, tareas multi-step y herramientas conectadas al trabajo real.',
  },
  {
    icon: Building2,
    label: 'Estructura',
    title: 'Base técnica y visual para compañías que ya no pueden improvisar.',
    body: 'WiseForge sirve cuando el negocio necesita claridad: arquitectura, diseño operativo, jerarquía visual y una plataforma que soporte decisiones más serias.',
  },
]

const featureStrips: FeatureStrip[] = [
  {
    title: 'Arquitectura usable',
    body: 'Producto, frontend, APIs, integraciones y capas de negocio alineadas desde el inicio.',
  },
  {
    title: 'Narrativa comercial fuerte',
    body: 'El sitio explica mejor el valor, no solo se ve mejor. Marca y oferta se entienden más rápido.',
  },
  {
    title: 'Performance racional',
    body: 'La home prioriza contenido, tipografía, jerarquía y CSS antes que efectos pesados en tiempo real.',
  },
  {
    title: 'Portafolio vivo',
    body: 'AssetMaster, Orion y GanaMaxcol muestran el estudio como ecosistema y no como piezas aisladas.',
  },
]

const products: ProductCard[] = [
  {
    logo: '/assetmaster-logo.svg',
    name: 'AssetMaster',
    category: 'ERP documental',
    body: 'Control documental, activos, aprobaciones y evidencia para operaciones que necesitan trazabilidad seria.',
    bullets: ['Compras y aprobaciones', 'Activos y custodias', 'Evidencia, actas y cumplimiento'],
  },
  {
    logo: '/orion-logo.svg',
    name: 'Orion',
    category: 'AI workspace',
    body: 'Workspace local-first para procesar información, ejecutar tareas y convertir contexto documental en trabajo accionable.',
    bullets: ['RAG y análisis documental', 'Tareas multi-step', 'Copiloto operativo con tools'],
  },
  {
    logo: '/ganamaxcol-logo.svg',
    name: 'GanaMaxcol',
    category: 'Vertical especializado',
    body: 'Software para operación ganadera, seguimiento de campo, rotación de potreros y continuidad diaria.',
    bullets: ['Operación de finca', 'Salud y trazabilidad', 'Visión táctica del terreno'],
  },
]

const protocol = [
  {
    icon: Radar,
    title: 'Leer la operación',
    body: 'Primero entendemos flujos, actores, fricción y riesgos. El sistema nace de la operación, no del gusto del día.',
  },
  {
    icon: Layers3,
    title: 'Ordenar el sistema',
    body: 'Definimos arquitectura funcional, jerarquía visual y capas de producto para que el software pueda evolucionar sin deformarse.',
  },
  {
    icon: Cable,
    title: 'Conectar herramientas',
    body: 'Integramos IA, servicios, datos y automatización cuando tienen efecto real en velocidad, control o lectura.',
  },
  {
    icon: ClipboardCheck,
    title: 'Entregar con trazabilidad',
    body: 'Deploy, validación, evidencia y gobierno. No cerramos en “bonito”; cerramos en útil y operable.',
  },
]

const stackSignals = [
  { icon: CircuitBoard, title: 'Interfaces intencionales', body: 'Sin layouts genéricos ni estética inflada por moda.' },
  { icon: ShieldCheck, title: 'Gobierno y control', body: 'Flujos, estado, evidencia y permisos con lógica real de negocio.' },
  { icon: Database, title: 'Datos con estructura', body: 'Modelos limpios, contexto reutilizable y menor dependencia de improvisación.' },
  { icon: Bot, title: 'Sistemas de IA útiles', body: 'Asistentes y agentes donde de verdad apoyan producto y operación.' },
  { icon: Gauge, title: 'Performance más disciplinada', body: 'Menos runtime innecesario en home; más foco en contenido y carga rápida.' },
  { icon: FileText, title: 'Oferta comprensible', body: 'Servicios, productos y dirección del estudio explicados sin fricción.' },
]

export function WiseForgeEtherealPage() {
  return (
    <main className="bg-[#060816] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_22%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_24%),linear-gradient(180deg,#050816_0%,#081120_56%,#0a1322_100%)]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-[-6rem] top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute right-[-5rem] top-12 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute bottom-10 left-[18%] h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-8 md:pb-28 lg:px-10">
          <nav className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
                <Image src="/logo-wfs.png" alt="WiseForge Studio" width={30} height={30} priority />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/70">WiseForge Studio</p>
                <p className="mt-1 text-sm text-white/65">Systems with control, product and applied AI.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              <a href="#services" className="rounded-full border border-white/10 px-4 py-2 hover:bg-white/10 hover:text-white">
                Services
              </a>
              <a href="#ecosystem" className="rounded-full border border-white/10 px-4 py-2 hover:bg-white/10 hover:text-white">
                Ecosystem
              </a>
              <a href="#protocol" className="rounded-full border border-white/10 px-4 py-2 hover:bg-white/10 hover:text-white">
                Protocol
              </a>
              <a href="#contact" className="rounded-full border border-white/10 px-4 py-2 hover:bg-white/10 hover:text-white">
                Contact
              </a>
            </div>
          </nav>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/80">
                <Sparkles className="h-3.5 w-3.5" />
                Studio de producto, software operativo e IA aplicada
              </div>
              <h1 className="mt-6 max-w-5xl font-display text-5xl leading-[0.94] tracking-[-0.06em] text-white md:text-7xl xl:text-[6.5rem]">
                WiseForge diseña sistemas digitales más amplios, más legibles y más serios para compañías que necesitan operar mejor.
              </h1>
              <p className="mt-7 max-w-3xl text-base leading-8 text-white/66 md:text-lg">
                Construimos experiencias premium, plataformas SaaS, capas operativas e integración con IA donde
                realmente agrega valor. El objetivo no es solo “verse avanzado”; es que la marca y el sistema
                transmitan control, claridad y capacidad de evolución.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#ecosystem"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  Ver ecosistema
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/showcase"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/86 transition hover:bg-white/10"
                >
                  Ver showcase
                  <Gem className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {heroStats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">{stat.label}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{stat.value}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/62">{stat.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-4">
            {featureStrips.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/10 bg-black/20 px-5 py-4">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="border-b border-white/10 bg-[#07101d] px-6 py-24 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="section-label-dark">Capacidades</p>
            <h2 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
              Una casa de desarrollo más amplia: branding, interfaces, sistemas operativos, automatización e IA.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/64">
              El sitio ahora explica mejor qué hace WiseForge y para quién sirve. No es solo un portfolio de pantallas:
              es una propuesta de estructura para empresas que ya superaron la fase de improvisar.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {capabilityGroups.map((item) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className="rounded-[32px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.22)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">{item.label}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/62">{item.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="ecosystem" className="border-b border-white/10 bg-[#09101d] px-6 py-24 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="section-label-dark">Ecosistema</p>
              <h2 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
                Un studio, tres productos y una lógica compartida de sistema.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/62">
                AssetMaster, Orion y GanaMaxcol muestran tres vectores del estudio: control enterprise, IA operativa
                y software vertical especializado. El sitio necesitaba contarlo mejor y con más amplitud.
              </p>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/75">Rasgo común</p>
                <p className="mt-4 text-lg leading-8 text-white/78">
                  Todos los productos apuntan a lo mismo: menos fragmentación, mejor lectura operativa, interfaces con intención y más capacidad de evolución.
                </p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.name}
                  className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.28)]"
                >
                  <div className="flex min-h-[80px] items-center rounded-[24px] border border-white/10 bg-black/20 px-5">
                    <Image src={product.logo} alt={product.name} width={160} height={52} className="h-auto w-auto" />
                  </div>
                  <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/80">{product.category}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{product.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/62">{product.body}</p>
                  <ul className="mt-5 space-y-2 text-sm text-white/72">
                    {product.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="protocol" className="border-b border-white/10 bg-[#08111f] px-6 py-24 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="section-label-dark">Protocolo</p>
            <h2 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
              WiseForge no entra diseñando pantallas primero. Entra leyendo la operación.
            </h2>
            <p className="mt-6 text-base leading-8 text-white/62">
              Esta sección no existía con suficiente claridad. Ahora el sitio explica mejor el método del estudio:
              entendimiento, orden, conexión y entrega con trazabilidad.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {protocol.map((item, index) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-white/35">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">{item.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#07101b] px-6 py-24 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="section-label-dark">Sistema del estudio</p>
              <h2 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
                Diseño más robusto, pero con una home mucho menos costosa de cargar.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/62">
                El hero anterior levantaba Three.js, GSAP y postprocesado cinematográfico desde la home. Era vistoso,
                pero demasiado caro para la ruta principal. La nueva dirección mantiene atmósfera premium con CSS,
                tipografía y composición, y deja lo experimental para rutas secundarias.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stackSignals.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/60">{item.body}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[radial-gradient(circle_at_left,rgba(34,211,238,0.12),transparent_20%),#060816] px-6 py-24 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_110px_rgba(0,0,0,0.28)] md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Contacto</p>
              <h2 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
                Si la operación ya no cabe en parches, el siguiente paso no es decorar más. Es ordenar el sistema.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/64">
                WiseForge Studio diseña ese siguiente paso: producto, operación, automatización e IA aplicada
                dentro de una estructura que sí pueda sostener crecimiento.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Ver showcase
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:studio@wiseforge.dev"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/86"
              >
                studio@wiseforge.dev
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
