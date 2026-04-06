/**
 * GET /hq
 * Renderiza el dashboard del WiseForgeStudio Headquarters en modo lectura pública.
 * Lee data/headquarters-state.json (bundled con el deploy) y genera HTML.
 * Los datos se actualizan con cada redeploy a Vercel.
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import { FileStateStore } from "../src/utils/fs-store.mjs";
import { HeadquartersService } from "../src/services/headquarters-service.mjs";
import { renderHomePage } from "../src/services/render-html.mjs";

const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data");

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const store = new FileStateStore(dataDir);
    const service = new HeadquartersService(store);
    const state = service.getState();
    const html = renderHomePage(state, { readonly: true });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Refresca con cada visita pero puede usar caché por 60s en CDN
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).send(html);
  } catch (err) {
    console.error("HQ render error:", err.message);
    return res.status(500).send(`<!doctype html><html lang="es"><body style="font-family:system-ui;background:#08080f;color:#f0f0f5;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><p>Error cargando el headquarters. Intenta más tarde.</p></body></html>`);
  }
}
