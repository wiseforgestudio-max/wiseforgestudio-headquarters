import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'

import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WiseForge Studio Headquarters | Sistema operativo multiagente',
  description:
    'Headquarters de WiseForge Studio para coordinar agentes de IA con gobierno humano, auditoria, planes, aprobaciones y despliegue trazable.',
  keywords: ['multiagente', 'AI headquarters', 'software operativo', 'automatizacion', 'WiseForge Studio'],
  openGraph: {
    title: 'WiseForge Studio Headquarters',
    description: 'Gobierno, control y trazabilidad para organizaciones multiagente.',
    url: 'https://wiseforgestudio-hq.vercel.app',
    siteName: 'WiseForge Studio Headquarters',
    locale: 'es_CO',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${fraunces.variable} ${manrope.variable}`}>{children}</body>
    </html>
  )
}
