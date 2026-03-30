function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

document.getElementById("year").textContent = new Date().getFullYear();

const progressBar = document.getElementById("scroll-progress-bar");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const revealTargets = Array.from(document.querySelectorAll(".reveal"));
const productScreens = Array.from(document.querySelectorAll(".screen-window[data-product]"));
const illustrationGalleries = Array.from(document.querySelectorAll(".illustration-gallery"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const galleryDefinitions = {
  systems: [
    "Arquitectura de control",
    "Equipo conectando flujos",
    "Núcleo de aprobaciones",
    "Sistema documental vivo",
    "Vista de coordinación",
    "Malla operativa",
    "Panel de continuidad",
    "Orquestación de tareas",
    "Capa de trazabilidad",
    "Centro de decisiones",
    "Nodos de validación",
    "Lectura de estados",
    "Superficie de seguimiento",
    "Motor de integraciones",
    "Red de operaciones",
    "Circuito de evidencia",
    "Diseño de plataforma",
    "Sistema en despliegue",
    "Mesa de producto",
    "Operación expandida"
  ],
  method: [
    "Discovery guiado",
    "Mapa de fricción",
    "Lógica del sistema",
    "Secuencia de módulos",
    "Diseño de experiencia",
    "Capas de validación",
    "Sprint de definición",
    "Orquestación técnica",
    "Entrega incremental",
    "Circuito de pruebas",
    "Flujo entre áreas",
    "Ajuste con usuarios",
    "Release controlado",
    "Lectura de señales",
    "Backlog estructurado",
    "Ruta de evolución",
    "Sistema en revisión",
    "Escena de colaboración",
    "Paso a producción",
    "Expansión medida"
  ],
  methodVertical: [
    "Señales de fricción",
    "Actores del proceso",
    "Costo invisible",
    "Decisión de alcance",
    "Mapa de dependencias",
    "Núcleo del sistema",
    "Jerarquía funcional",
    "Módulos prioritarios",
    "Flujos de aprobación",
    "Trazabilidad base",
    "Experiencia operativa",
    "Reglas del negocio",
    "Backlog ejecutable",
    "Riesgos de integración",
    "Validación con usuarios",
    "Release controlado",
    "Medición inicial",
    "Documentación viva",
    "Ruta de evolución",
    "Sistema sostenible"
  ]
};

const gallerySummaries = {
  systems: [
    "WiseForge Studio diseña capas digitales que conectan personas, flujos y decisiones.",
    "Cada escena representa una operación más clara, trazable y preparada para crecer.",
    "El foco no es solo interfaz: es estructura, continuidad y lectura ejecutiva.",
    "La propuesta combina producto, automatización y una lógica operativa seria.",
    "Diseñamos software que se integra al trabajo real y reduce fricción sistémica."
  ],
  method: [
    "Cada etapa traduce complejidad en una decisión concreta de producto, sistema o implementación.",
    "El método organiza hallazgos, prioriza señales y define qué construir primero.",
    "La secuencia reduce improvisación y convierte intención en entregables legibles.",
    "Discovery, estructura y despliegue conviven como un solo sistema de trabajo.",
    "El proceso existe para sostener decisiones mejores, no para añadir ceremonia."
  ],
  methodVertical: [
    "Identificamos dónde se pierde tiempo, control o continuidad antes de proponer solución.",
    "Leemos personas, áreas y puntos de transferencia para entender la operación real.",
    "Hacemos visible el costo del estado actual: reproceso, retrasos, errores y opacidad.",
    "Definimos qué sí entra en la primera intervención y qué debe esperar.",
    "Ordenamos vínculos entre datos, tareas, documentos y responsables.",
    "Encontramos el núcleo que debe sostener el resto del sistema.",
    "Priorizamos lectura, control y acciones según el tipo de usuario.",
    "Convertimos la complejidad en módulos que sí pueden implementarse.",
    "Diseñamos recorridos de validación y pasos de control con criterio.",
    "Definimos la base mínima para seguimiento, evidencia y estado.",
    "Buscamos que operar sea más claro, no solo más bonito.",
    "Modelamos reglas, excepciones y decisiones del negocio dentro del sistema.",
    "Traducimos estrategia en una secuencia construible y medible.",
    "Evaluamos acoples, datos y dependencias antes de conectar sistemas.",
    "Probamos comprensión y utilidad con quienes sí van a operar la solución.",
    "Desplegamos con orden para reducir ruido y proteger continuidad.",
    "Definimos qué mirar primero cuando el sistema entra en uso real.",
    "Dejamos una base de lectura que permita crecer sin perder contexto.",
    "Planeamos la siguiente fase desde señales reales, no por intuición.",
    "El objetivo final es un sistema que pueda sostener negocio y evolución."
  ]
};

const methodVerticalCards = [
  { eyebrow: "Lectura", metric: "01", title: "Señales de fricción", body: "Detectamos reprocesos, cuellos de botella, pasos manuales y puntos donde la operación pierde ritmo.", bullets: ["repetición", "retraso"] },
  { eyebrow: "Contexto", metric: "02", title: "Actores del proceso", body: "Mapeamos quién solicita, quién valida, quién ejecuta y dónde se rompe el relevo entre áreas.", bullets: ["roles", "handoffs"] },
  { eyebrow: "Impacto", metric: "03", title: "Costo invisible", body: "Convertimos molestias difusas en costo real: tiempo, errores, opacidad y dependencia de personas clave.", bullets: ["tiempo", "errores"] },
  { eyebrow: "Alcance", metric: "04", title: "Decisión de alcance", body: "Definimos qué entra en la primera versión y qué debe esperar para no construir de más.", bullets: ["foco", "prioridad"] },
  { eyebrow: "Mapa", metric: "05", title: "Dependencias", body: "Ordenamos relaciones entre documentos, tareas, estados y datos para evitar piezas sueltas.", bullets: ["datos", "vínculos"] },
  { eyebrow: "Base", metric: "06", title: "Núcleo del sistema", body: "Encontramos la capa que debe sostener control, continuidad y crecimiento futuro.", bullets: ["núcleo", "estructura"] },
  { eyebrow: "UX", metric: "07", title: "Jerarquía funcional", body: "Priorizamos qué debe ver cada actor primero y qué acciones necesitan estar al frente.", bullets: ["lectura", "acciones"] },
  { eyebrow: "Diseño", metric: "08", title: "Módulos prioritarios", body: "Partimos la complejidad en módulos ejecutables con valor claro para la operación.", bullets: ["módulos", "valor"] },
  { eyebrow: "Control", metric: "09", title: "Flujos de aprobación", body: "Diseñamos validaciones, estados y responsables con trazabilidad desde el inicio.", bullets: ["aprobación", "estado"] },
  { eyebrow: "Seguimiento", metric: "10", title: "Trazabilidad base", body: "Definimos cómo quedarán evidencia, historial y lectura del estado de cada proceso.", bullets: ["historial", "evidencia"] },
  { eyebrow: "Operación", metric: "11", title: "Experiencia operativa", body: "La interfaz debe facilitar trabajo real, no añadir otra capa de confusión.", bullets: ["claridad", "uso real"] },
  { eyebrow: "Lógica", metric: "12", title: "Reglas del negocio", body: "Llevamos decisiones, excepciones y condiciones al sistema con criterio explícito.", bullets: ["reglas", "excepciones"] },
  { eyebrow: "Plan", metric: "13", title: "Backlog ejecutable", body: "Traducimos estrategia en entregables construibles, medibles y ordenados por impacto.", bullets: ["backlog", "impacto"] },
  { eyebrow: "Integración", metric: "14", title: "Riesgos de integración", body: "Leemos dependencias técnicas antes de conectar procesos o automatizar sobre caos.", bullets: ["riesgo", "acople"] },
  { eyebrow: "Validación", metric: "15", title: "Usuarios clave", body: "Validamos comprensión y recorrido con quienes sí usarán el sistema todos los días.", bullets: ["adopción", "feedback"] },
  { eyebrow: "Release", metric: "16", title: "Despliegue controlado", body: "Entramos a producción con orden, visibilidad y cuidado por la continuidad operativa.", bullets: ["release", "continuidad"] },
  { eyebrow: "Señales", metric: "17", title: "Medición inicial", body: "Definimos qué mirar primero para decidir la siguiente mejora con información real.", bullets: ["KPIs", "lectura"] },
  { eyebrow: "Base viva", metric: "18", title: "Documentación útil", body: "La documentación acompaña el sistema para sostener contexto y decisiones futuras.", bullets: ["contexto", "soporte"] },
  { eyebrow: "Ruta", metric: "19", title: "Evolución", body: "Planeamos la siguiente fase desde datos, uso real y nuevas capacidades del negocio.", bullets: ["fases", "crecimiento"] },
  { eyebrow: "Resultado", metric: "20", title: "Sistema sostenible", body: "El objetivo no es solo lanzar, sino dejar una base que pueda sostener la operación.", bullets: ["estabilidad", "escala"] }
];

function updateScrollProgress() {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable <= 0 ? 0 : window.scrollY / scrollable;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

function updateActiveSection() {
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  let currentId = sections[0]?.id ?? "";
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 160) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
  });
}

function setupReveal() {
  if (reduceMotion.matches) return;
  document.documentElement.classList.add("motion-ready");
  revealTargets.forEach((node, index) => {
    node.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 60}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((node) => observer.observe(node));
}

function updateProductNote(product, title, copy, activeNode) {
  const titleNode = document.getElementById(`${product}-note-title`);
  const copyNode = document.getElementById(`${product}-note-copy`);
  if (titleNode) titleNode.textContent = title;
  if (copyNode) copyNode.textContent = copy;

  productScreens
    .filter((node) => node.dataset.product === product)
    .forEach((node) => node.classList.toggle("is-focus", node === activeNode));
}

function setupProductInteractions() {
  productScreens.forEach((node) => {
    const activate = () =>
      updateProductNote(node.dataset.product, node.dataset.screenTitle, node.dataset.screenCopy, node);

    node.addEventListener("mouseenter", activate);
    node.addEventListener("focus", activate);
  });

  const firstByProduct = new Map();
  productScreens.forEach((node) => {
    if (!firstByProduct.has(node.dataset.product)) {
      firstByProduct.set(node.dataset.product, node);
    }
  });

  firstByProduct.forEach((node) => {
    updateProductNote(node.dataset.product, node.dataset.screenTitle, node.dataset.screenCopy, node);
  });
}

function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildIllustrationSvg(kind, index) {
  if (kind === "methodVertical") {
    const card = methodVerticalCards[index % methodVerticalCards.length];
    const seed = index + 1;
    const bars = Array.from({ length: 4 }, (_, barIndex) => {
      const width = 72 + ((seed * 17 + barIndex * 29) % 96);
      return `<rect x="54" y="${292 + barIndex * 20}" width="${width}" height="8" rx="4" fill="${barIndex === 0 ? "#163326" : "#8ca492"}" opacity="${barIndex === 0 ? 0.86 : 0.42}"/>`;
    }).join("");
    const chips = card.bullets.map((bullet, bulletIndex) => `
      <g transform="translate(${56 + bulletIndex * 108} 388)">
        <rect width="92" height="28" rx="14" fill="#ffffff" stroke="#d8e8dd"/>
        <text x="46" y="18" text-anchor="middle" fill="#4f6272" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1">${bullet.toUpperCase()}</text>
      </g>
    `).join("");
    const nodes = Array.from({ length: 5 }, (_, nodeIndex) => {
      const x = 244 + ((seed * 23 + nodeIndex * 31) % 100);
      const y = 100 + ((seed * 19 + nodeIndex * 37) % 110);
      return `<circle cx="${x}" cy="${y}" r="${nodeIndex % 2 === 0 ? 7 : 5}" fill="${nodeIndex % 2 === 0 ? "#148d52" : "#0f9ea8"}" opacity="0.9"/>`;
    }).join("");

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 520" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="mv-bg-${seed}" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#f8fbf8"/>
            <stop offset="100%" stop-color="#ffffff"/>
          </linearGradient>
          <linearGradient id="mv-glow-${seed}" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stop-color="#148d52" stop-opacity="0.16"/>
            <stop offset="100%" stop-color="#0f9ea8" stop-opacity="0.06"/>
          </linearGradient>
        </defs>
        <rect width="360" height="520" rx="28" fill="url(#mv-bg-${seed})"/>
        <rect x="22" y="22" width="316" height="476" rx="24" fill="url(#mv-glow-${seed})" opacity="0.42"/>
        <rect x="38" y="34" width="284" height="150" rx="22" fill="#fbfdfb" stroke="#dbe8de"/>
        <circle cx="${84 + (seed * 7) % 18}" cy="72" r="34" fill="#dff4e7"/>
        <circle cx="${278 - (seed * 5) % 18}" cy="68" r="26" fill="#e4f4f6"/>
        <path d="M86 108 C 118 82, 166 82, 194 106 S 252 134, 286 108" fill="none" stroke="#148d52" stroke-width="4" stroke-linecap="round" opacity="0.34"/>
        <rect x="56" y="56" width="92" height="12" rx="6" fill="#163326" opacity="0.84"/>
        <rect x="56" y="78" width="58" height="8" rx="4" fill="#148d52" opacity="0.8"/>
        <rect x="54" y="126" width="114" height="32" rx="16" fill="#ffffff" stroke="#d8e8dd"/>
        <text x="111" y="146" text-anchor="middle" fill="#4f6272" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1.2">${card.eyebrow.toUpperCase()}</text>
        ${nodes}
        <rect x="38" y="202" width="284" height="278" rx="24" fill="#ffffff" stroke="#dbe8de"/>
        <text x="54" y="236" fill="#0c6d3f" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="2">${card.metric} / 20</text>
        <text x="54" y="268" fill="#18212f" font-family="Georgia, Times New Roman, serif" font-size="26" font-weight="700">${card.title}</text>
        <foreignObject x="54" y="284" width="238" height="64">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;line-height:1.5;color:#546274;">
            ${card.body}
          </div>
        </foreignObject>
        ${bars}
        ${chips}
      </svg>
    `.trim();
  }

  const palettes = {
    systems: {
      bgA: "#f5fbf7",
      bgB: "#ffffff",
      frame: "#d6e8dd",
      card: "#f8fcf9",
      ink: "#163326",
      accent: "#148d52",
      accentSoft: "#dff4e7",
      support: "#0f9ea8",
      warm: "#97b53d"
    },
    method: {
      bgA: "#f8fbf8",
      bgB: "#ffffff",
      frame: "#dce7de",
      card: "#fbfdfb",
      ink: "#1a2a20",
      accent: "#0c6d3f",
      accentSoft: "#e6f2e9",
      support: "#5bb78d",
      warm: "#c6d78d"
    },
    methodVertical: {
      bgA: "#f8fbf8",
      bgB: "#ffffff",
      frame: "#dce7de",
      card: "#fbfdfb",
      ink: "#1a2a20",
      accent: "#0c6d3f",
      accentSoft: "#e6f2e9",
      support: "#5bb78d",
      warm: "#c6d78d"
    }
  };

  const palette = palettes[kind] ?? palettes.systems;
  const seed = index + 1;
  const nodes = Array.from({ length: 5 }, (_, nodeIndex) => {
    const x = 84 + ((seed * 37 + nodeIndex * 73) % 520);
    const y = 88 + ((seed * 29 + nodeIndex * 59) % 196);
    const r = 8 + ((seed + nodeIndex) % 7);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${nodeIndex % 2 === 0 ? palette.accent : palette.support}" opacity="0.9"/>`;
  }).join("");

  const links = Array.from({ length: 4 }, (_, linkIndex) => {
    const x1 = 108 + ((seed * 31 + linkIndex * 74) % 470);
    const y1 = 102 + ((seed * 23 + linkIndex * 53) % 170);
    const x2 = x1 + 48 + ((seed + linkIndex * 11) % 92);
    const y2 = y1 + (linkIndex % 2 === 0 ? 34 : -28);
    return `<path d="M${x1} ${y1} C ${x1 + 32} ${y1}, ${x2 - 28} ${y2}, ${x2} ${y2}" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.35"/>`;
  }).join("");

  const cards = Array.from({ length: kind === "method" ? 3 : 4 }, (_, cardIndex) => {
    const width = kind === "method" ? 108 : 132;
    const height = kind === "method" ? 88 : 108;
    const x = 56 + cardIndex * (width + 20) + ((seed + cardIndex) % 16);
    const y = kind === "method"
      ? 224 + ((cardIndex + seed) % 2) * 10
      : 206 + ((cardIndex + seed) % 3) * 12;
    const fill = cardIndex % 2 === 0 ? palette.card : palette.accentSoft;
    const meter = 28 + ((seed * 17 + cardIndex * 13) % 56);
    const lines = Array.from({ length: 3 }, (_, lineIndex) => {
      const lineWidth = 40 + ((seed * 11 + cardIndex * 19 + lineIndex * 17) % 44);
      return `<rect x="${x + 18}" y="${y + 26 + lineIndex * 16}" width="${lineWidth}" height="7" rx="3.5" fill="${lineIndex === 0 ? palette.ink : "#88a193"}" opacity="${lineIndex === 0 ? 0.86 : 0.44}"/>`;
    }).join("");

    return `
      <g>
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="22" fill="${fill}" stroke="${palette.frame}"/>
        <rect x="${x + 18}" y="${y + 14}" width="${meter}" height="8" rx="4" fill="${palette.accent}"/>
        ${lines}
      </g>
    `;
  }).join("");

  const deskBlocks = Array.from({ length: kind === "method" ? 2 : 3 }, (_, blockIndex) => {
    const x = 74 + blockIndex * 184 + ((seed + blockIndex * 9) % 18);
    const y = kind === "method" ? 110 : 96;
    const width = kind === "method" ? 150 : 162;
    const height = kind === "method" ? 82 : 94;
    const accentWidth = 36 + ((seed + blockIndex * 7) % 68);
    return `
      <g>
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="24" fill="${palette.card}" stroke="${palette.frame}" />
        <rect x="${x + 18}" y="${y + 18}" width="${accentWidth}" height="10" rx="5" fill="${palette.accent}" />
        <rect x="${x + 18}" y="${y + 38}" width="${width - 36}" height="8" rx="4" fill="#9ab0a0" opacity="0.36" />
        <rect x="${x + 18}" y="${y + 54}" width="${width - 58}" height="8" rx="4" fill="#9ab0a0" opacity="0.26" />
      </g>
    `;
  }).join("");

  const crew = kind === "method"
    ? `
      <g transform="translate(480 56)">
        <circle cx="0" cy="28" r="18" fill="${palette.support}" opacity="0.2"/>
        <circle cx="0" cy="18" r="11" fill="${palette.ink}" opacity="0.92"/>
        <rect x="-18" y="32" width="36" height="24" rx="12" fill="${palette.accentSoft}"/>
        <circle cx="48" cy="24" r="10" fill="${palette.ink}" opacity="0.9"/>
        <rect x="34" y="36" width="28" height="18" rx="9" fill="${palette.warm}"/>
      </g>
    `
    : `
      <g transform="translate(470 48)">
        <circle cx="0" cy="30" r="20" fill="${palette.support}" opacity="0.18"/>
        <circle cx="0" cy="18" r="12" fill="${palette.ink}" opacity="0.92"/>
        <rect x="-20" y="34" width="40" height="28" rx="14" fill="${palette.accentSoft}"/>
        <circle cx="56" cy="24" r="11" fill="${palette.ink}" opacity="0.9"/>
        <rect x="42" y="36" width="30" height="20" rx="10" fill="${palette.warm}"/>
        <circle cx="100" cy="20" r="10" fill="${palette.ink}" opacity="0.84"/>
        <rect x="86" y="32" width="28" height="18" rx="9" fill="${palette.accentSoft}"/>
      </g>
    `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="bg-${kind}-${seed}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${palette.bgA}"/>
          <stop offset="100%" stop-color="${palette.bgB}"/>
        </linearGradient>
        <linearGradient id="glow-${kind}-${seed}" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="${palette.support}" stop-opacity="0.08"/>
        </linearGradient>
      </defs>
      <rect width="720" height="420" rx="34" fill="url(#bg-${kind}-${seed})"/>
      <circle cx="${116 + (seed * 19) % 180}" cy="${72 + (seed * 13) % 80}" r="72" fill="${palette.accent}" opacity="0.08"/>
      <circle cx="${566 - (seed * 17) % 140}" cy="${74 + (seed * 7) % 80}" r="60" fill="${palette.support}" opacity="0.08"/>
      <rect x="34" y="34" width="652" height="352" rx="30" fill="url(#glow-${kind}-${seed})" opacity="0.32"/>
      ${links}
      ${nodes}
      ${crew}
      ${deskBlocks}
      ${cards}
      <rect x="56" y="70" width="${kind === "method" ? 188 : 220}" height="12" rx="6" fill="${palette.ink}" opacity="0.86"/>
      <rect x="56" y="92" width="${kind === "method" ? 120 : 154}" height="8" rx="4" fill="${palette.accent}" opacity="0.75"/>
    </svg>
  `.trim();
}

function renderGalleryFrame(figure, kind, index) {
  const image = figure.querySelector(".gallery-image");
  const titleNode = figure.querySelector(".gallery-title");
  const counterNode = figure.querySelector(".gallery-counter");
  const summaryNode = figure.querySelector(".gallery-summary");
  const entries = galleryDefinitions[kind] ?? galleryDefinitions.systems;
  const summaries = gallerySummaries[kind] ?? gallerySummaries.systems;
  const safeIndex = ((index % entries.length) + entries.length) % entries.length;
  const progress = `${((safeIndex + 1) / entries.length) * 100}%`;

  if (titleNode) titleNode.textContent = entries[safeIndex];
  if (counterNode) counterNode.textContent = `${String(safeIndex + 1).padStart(2, "0")} / ${String(entries.length).padStart(2, "0")}`;
  if (summaryNode) summaryNode.textContent = summaries[safeIndex % summaries.length];
  if (image) image.src = svgToDataUri(buildIllustrationSvg(kind, safeIndex));
  figure.style.setProperty("--gallery-progress", progress);
}

function setupIllustrationGalleries() {
  illustrationGalleries.forEach((figure, galleryIndex) => {
    const kind = figure.dataset.galleryKind || "systems";
    const entries = galleryDefinitions[kind] ?? galleryDefinitions.systems;
    let currentIndex = Number.parseInt(figure.dataset.galleryOffset || "0", 10);
    let timerId = null;

    const swapTo = (nextIndex) => {
      currentIndex = nextIndex;
      figure.classList.add("is-swapping");
      renderGalleryFrame(figure, kind, currentIndex);
      window.setTimeout(() => figure.classList.remove("is-swapping"), 220);
    };

    swapTo(currentIndex);

    if (reduceMotion.matches) return;

    const start = () => {
      if (timerId) return;
      timerId = window.setInterval(() => {
        swapTo((currentIndex + 1) % entries.length);
      }, kind === "method" ? 2800 : kind === "methodVertical" ? 4200 : 3400 + galleryIndex * 180);
    };

    const stop = () => {
      if (!timerId) return;
      window.clearInterval(timerId);
      timerId = null;
    };

    figure.addEventListener("mouseenter", stop);
    figure.addEventListener("mouseleave", start);
    start();
  });
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("scroll", updateActiveSection, { passive: true });
window.addEventListener("resize", debounce(updateScrollProgress, 150));
window.addEventListener("resize", debounce(updateActiveSection, 150));

updateScrollProgress();
updateActiveSection();
setupReveal();
setupProductInteractions();
setupIllustrationGalleries();

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const btn = document.getElementById("form-submit-btn");
  const status = document.getElementById("form-status");
  if (!form || !btn) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const original = btn.textContent;
    btn.textContent = "Enviando...";
    btn.disabled = true;
    if (status) status.textContent = "";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        form.reset();
        btn.textContent = "¡Enviado!";
        if (status) status.textContent = "Gracias. Te contactaremos pronto.";
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          if (status) status.textContent = "";
        }, 4000);
      } else {
        throw new Error("error");
      }
    } catch {
      btn.textContent = original;
      btn.disabled = false;
      if (status) {
        status.textContent = "Hubo un problema. Intenta de nuevo.";
        status.style.color = "#c0392b";
      }
    }
  });
}

setupContactForm();
