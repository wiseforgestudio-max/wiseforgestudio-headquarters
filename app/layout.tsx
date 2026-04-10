import type { Metadata } from 'next'

import './globals.css'

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
