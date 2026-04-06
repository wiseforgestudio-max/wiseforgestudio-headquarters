import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WiseForge Studio — Software operativo, automatización y productos SaaS',
  description:
    'Studio de producto, automatización y software operativo. Diseñamos soluciones para empresas que necesitan control, trazabilidad y una capa digital más seria.',
  keywords: ['software operativo', 'automatización', 'SaaS', 'Colombia', 'desarrollo de software'],
  openGraph: {
    title: 'WiseForge Studio',
    description: 'Software operativo, automatización y productos SaaS',
    url: 'https://wiseforgestudio-hq.vercel.app',
    siteName: 'WiseForge Studio',
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
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
