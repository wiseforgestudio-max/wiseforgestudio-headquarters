import { NextResponse } from 'next/server'
import { join } from 'path'

export async function GET() {
  try {
    // Dynamic imports for ESM modules in Next.js
    const dataDir = join(process.cwd(), 'data')
    // @ts-ignore — .mjs ESM modules without type declarations
    const { FileStateStore } = await import('@/src/utils/fs-store.mjs')
    // @ts-ignore
    const { HeadquartersService } = await import('@/src/services/headquarters-service.mjs')
    // @ts-ignore
    const { renderHomePage } = await import('@/src/services/render-html.mjs')

    const store = new FileStateStore(dataDir)
    const service = new HeadquartersService(store)
    const state = service.getState()
    const html = renderHomePage(state, { readonly: true })

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    console.error('HQ render error:', msg)
    return new NextResponse(
      `<!doctype html><html><body style="font-family:system-ui;background:#050508;color:#f0f0f5;display:flex;align-items:center;justify-content:center;height:100vh"><p>Error cargando HQ: ${msg}</p></body></html>`,
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}
