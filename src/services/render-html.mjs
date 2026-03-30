function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function statusClass(status) {
  if (["approved", "done", "active", "execution", "completed"].includes(status)) return "status-ok";
  if (["blocked", "critical", "rejected", "failed", "cancelled"].includes(status)) return "status-danger";
  return "status-warn";
}

function translateStatus(status) {
  return (
    {
      approved: "aprobado",
      done: "hecho",
      active: "activo",
      pending: "pendiente",
      pending_approval: "pendiente de aprobacion",
      planned: "planificado",
      queued: "en cola",
      running: "ejecutando",
      completed: "completado",
      failed: "fallido",
      cancelled: "cancelado",
      in_progress: "en progreso",
      review: "en revision",
      testing: "en pruebas",
      blocked: "bloqueado",
      critical: "critico",
      rejected: "rechazado",
      execution: "en ejecucion",
      idle: "en espera",
      coding: "programando",
      reviewing: "revisando",
      awaiting_approval: "esperando aprobacion",
      resting: "descansando",
      planning: "planificando",
      proposed: "propuesto",
      under_review: "en revision",
      idle: "en espera"
    }[status] ?? status
  );
}

function translateRisk(risk) {
  return (
    {
      low: "bajo",
      medium: "medio",
      high: "alto",
      critical: "critico"
    }[risk] ?? risk
  );
}

function translateRole(role) {
  return (
    {
      ceo: "CEO",
      director: "director",
      committee: "comite"
    }[role] ?? role
  );
}

function approvalDecisionTitle(approval) {
  if (approval.riskLevel === "critical") {
    return "Acta de Comite";
  }
  if (approval.riskLevel === "high") {
    return "Informe Ejecutivo";
  }
  return "Ficha de Decision";
}

function formatDateTime(value) {
  if (!value) {
    return "Sin fecha";
  }
  return new Date(value).toLocaleString("es-CO");
}

function sessionEventLabel(type) {
  return (
    {
      instruction: "instruccion",
      response: "respuesta",
      status: "estado",
      command: "comando",
      command_result: "resultado"
    }[type] ?? type
  );
}

function approvalSlaText(approval) {
  const hoursByRisk = {
    low: 4,
    medium: 8,
    high: 24,
    critical: 2
  };
  const hours = hoursByRisk[approval.riskLevel] ?? 8;
  if (!approval.createdAt) {
    return `${hours}h objetivo`;
  }
  const targetAt = new Date(new Date(approval.createdAt).getTime() + hours * 60 * 60 * 1000).toISOString();
  return `${hours}h objetivo | vence ${formatDateTime(targetAt)}`;
}

function renderDecisionLog(approval) {
  if (!approval.decisionLog?.length) {
    return "<p>Sin decisiones registradas.</p>";
  }

  return renderList(
    approval.decisionLog,
    (entry) => `
      <div class="decision-log-item">
        <strong>${escapeHtml(translateRole(entry.actorRole))}</strong>
        <p>${escapeHtml(entry.actorName)} | ${escapeHtml(entry.decision)} | ${escapeHtml(formatDateTime(entry.at))}</p>
      </div>`
  );
}

function renderList(items, renderItem) {
  return items.map(renderItem).join("");
}

function agentById(state, id) {
  return state.agents.find((agent) => agent.id === id);
}

function options(items, getValue, getLabel) {
  return items
    .map((item) => `<option value="${escapeHtml(getValue(item))}">${escapeHtml(getLabel(item))}</option>`)
    .join("");
}

function renderOfficeSvg(state) {
  const rooms = [
    { x: 24, y: 24, w: 192, h: 96, label: "Direccion", color: "#f2c1b6" },
    { x: 240, y: 24, w: 216, h: 96, label: "Planeacion", color: "#f5ddb0" },
    { x: 480, y: 96, w: 168, h: 168, label: "Ingenieria", color: "#b6d7d2" },
    { x: 480, y: 288, w: 168, h: 144, label: "QA", color: "#d5e4b8" },
    { x: 240, y: 408, w: 216, h: 48, label: "DevOps", color: "#c7d4f1" },
    { x: 24, y: 360, w: 192, h: 120, label: "Seguridad", color: "#f0c8cf" },
    { x: 24, y: 144, w: 192, h: 168, label: "Producto UX", color: "#f0dea9" },
    { x: 240, y: 144, w: 192, h: 192, label: "Prompts", color: "#cde2c3" }
  ];

  const roomMarkup = rooms
    .map(
      (room) => `
      <g>
        <rect x="${room.x}" y="${room.y}" width="${room.w}" height="${room.h}" fill="${room.color}" stroke="#3e372d" stroke-width="3" rx="12" />
        <text x="${room.x + 12}" y="${room.y + 24}" font-size="14" font-family="monospace" font-weight="700" fill="#1d1d1b">${room.label}</text>
      </g>`
    )
    .join("");

  const agentMarkup = state.agents
    .map((agent) => {
      const color = agent.provider === "human" ? "#af3e2f" : agent.provider === "codex" ? "#1d6f78" : "#7d5ea8";
      return `
      <g>
        <rect x="${agent.x * 24 + 6}" y="${agent.y * 24 + 6}" width="12" height="12" fill="${color}" stroke="#1d1d1b" stroke-width="2" />
        <title>${escapeHtml(agent.name)} - ${escapeHtml(translateStatus(agent.status))}</title>
      </g>`;
    })
    .join("");

  return `
    <svg class="office-svg" viewBox="0 0 672 480" role="img" aria-label="Mapa del headquarters de WiseForgeStudio">
      <rect x="0" y="0" width="672" height="480" fill="#ded8c7" />
      ${roomMarkup}
      ${agentMarkup}
    </svg>
  `;
}

export function renderHomePage(state) {
  const summary = state.derived.executiveSummary;
  const cards = [
    ["Proyectos", summary.activeProjects],
    ["Aprobaciones", summary.pendingApprovals],
    ["Riesgos abiertos", summary.openRisks],
    ["Agentes activos", summary.activeAgents],
    ["Tareas bloqueadas", summary.blockedTasks],
    ["Sesiones", summary.activeSessions]
  ];

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(state.meta.productName)}</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">WiseForgeStudio Headquarters</p>
          <h1>Centro de mando ejecutivo para organizaciones de agentes de IA</h1>
        </div>
        <div class="topbar-meta">
          <span id="phase-pill" class="pill">${escapeHtml(state.meta.phase)}</span>
          <span class="pill accent">Local primero</span>
        </div>
      </header>

      <div id="app-status" class="app-status ok">Headquarters cargado correctamente desde el servidor local.</div>

      <main class="layout">
        <section class="panel executive-panel">
          <div class="panel-title-row">
            <h2>Dashboard Ejecutivo</h2>
            <div class="inline-actions">
              <button id="refresh-btn" type="button">Actualizar</button>
              <button id="export-state-btn" type="button">Exportar snapshot</button>
            </div>
          </div>
          <div id="executive-cards" class="cards">
            ${renderList(
              cards,
              ([label, value]) => `<div class="card"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`
            )}
          </div>
          <div class="split">
            <div>
              <h3>Proyectos</h3>
              <div id="projects-list" class="stack-list">
                ${renderList(
                  state.projects,
                  (project) => `
                    <div class="stack-item">
                      <span>${escapeHtml(project.name)}</span>
                      <strong>${escapeHtml(translateStatus(project.status))}</strong>
                      <p>${escapeHtml(project.objective)}</p>
                      <span class="status-tag ${statusClass(project.riskLevel)}">riesgo ${escapeHtml(translateRisk(project.riskLevel))}</span>
                    </div>`
                )}
              </div>
            </div>
            <div>
              <h3>Sala de Guerra</h3>
              <div id="war-room" class="war-room">
                <strong>${escapeHtml(state.headquarters.currentWarRoom.title)}</strong>
                <p>Severidad: ${escapeHtml(translateRisk(state.headquarters.currentWarRoom.severity))}</p>
                <p>Responsable: ${escapeHtml(agentById(state, state.headquarters.currentWarRoom.ownerAgentId)?.name ?? "N/D")}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="panel office-panel">
          <h2>Sala de Guerra Operativa</h2>
          <div class="forms-grid">
            <div class="action-form">
              <h3>Incidentes activos</h3>
              <div id="war-room-incidents" class="stack-list compact">
                ${renderList(
                  state.derived.warRoom.incidents,
                  (incident) => `
                    <div class="stack-item">
                      <span>${escapeHtml(translateRisk(incident.severity))}</span>
                      <strong>${escapeHtml(incident.title)}</strong>
                      <p>${escapeHtml(incident.ownerName)} | ${escapeHtml(incident.summary ?? "")}</p>
                      <details class="committee-record">
                        <summary>Ver detalle del incidente</summary>
                        <div class="committee-sheet">
                          <div><span class="dossier-label">Responsable</span><p>${escapeHtml(incident.ownerName)}</p></div>
                          <div><span class="dossier-label">Severidad</span><p>${escapeHtml(translateRisk(incident.severity))}</p></div>
                          <div><span class="dossier-label">Abierto</span><p>${escapeHtml(formatDateTime(incident.openedAt))}</p></div>
                          <div><span class="dossier-label">Resumen</span><p>${escapeHtml(incident.summary ?? "Sin resumen")}</p></div>
                          <div><span class="dossier-label">Acciones activas</span><p>${escapeHtml((incident.actions ?? []).filter((item) => item.status !== "completed").length)}</p></div>
                        </div>
                      </details>
                      <div class="inline-actions">
                        <button type="button" class="resolve-incident-btn" data-incident-id="${escapeHtml(incident.id)}">Resolver</button>
                      </div>
                    </div>`
                )}
              </div>
            </div>

            <div class="action-form">
              <h3>Acciones operativas</h3>
              <div id="war-room-actions" class="stack-list compact">
                ${renderList(
                  state.derived.warRoom.actionItems,
                  (action) => `
                    <div class="stack-item ${action.overdue ? "attention-item" : ""}">
                      <span>${escapeHtml(translateRisk(action.incidentSeverity))} | ${escapeHtml(action.incidentTitle)}</span>
                      <strong>${escapeHtml(action.title)}</strong>
                      <p>${escapeHtml(action.ownerName)} | ${escapeHtml(action.summary ?? "")}</p>
                      <p>SLA: ${escapeHtml(action.dueLabel)} | Estado: ${escapeHtml(translateStatus(action.status))}${action.overdue ? " | vencida" : ""}</p>
                      <span class="status-tag ${statusClass(action.status === "in_progress" ? "pending_approval" : action.status)}">${escapeHtml(translateStatus(action.status))}</span>
                      <details class="committee-record">
                        <summary>Ver detalle de la accion</summary>
                        <div class="committee-sheet">
                          <div><span class="dossier-label">Incidente</span><p>${escapeHtml(action.incidentTitle)}</p></div>
                          <div><span class="dossier-label">Responsable</span><p>${escapeHtml(action.ownerName)}</p></div>
                          <div><span class="dossier-label">Creada</span><p>${escapeHtml(formatDateTime(action.createdAt))}</p></div>
                          <div><span class="dossier-label">SLA</span><p>${escapeHtml(action.dueLabel)}</p></div>
                          <div><span class="dossier-label">Estado</span><p>${escapeHtml(translateStatus(action.status))}</p></div>
                          <div><span class="dossier-label">Resumen operativo</span><p>${escapeHtml(action.summary ?? "Sin resumen")}</p></div>
                        </div>
                      </details>
                      <div class="inline-actions">
                        ${
                          action.status === "pending"
                            ? `<button type="button" class="incident-action-status-btn secondary" data-incident-id="${escapeHtml(action.incidentId)}" data-action-id="${escapeHtml(action.id)}" data-status="in_progress">Tomar</button>`
                            : `<span class="mini-state">Accion tomada</span>`
                        }
                        <button type="button" class="complete-incident-action-btn" data-incident-id="${escapeHtml(action.incidentId)}" data-action-id="${escapeHtml(action.id)}">Marcar completada</button>
                      </div>
                    </div>`
                )}
              </div>
              <h3>Acciones recomendadas</h3>
              <div id="war-room-recommendations" class="stack-list compact">
                ${renderList(
                  state.derived.warRoom.recommendedActions,
                  (action) => `
                    <div class="stack-item">
                      <span>${escapeHtml(action.type)}</span>
                      <strong>${escapeHtml(action.title)}</strong>
                      <p>${escapeHtml(action.owner)}</p>
                    </div>`
                )}
              </div>
            </div>

            <div class="action-form">
              <form id="incident-form" class="nested-form">
                <h3>Nuevo incidente</h3>
                <label class="field">
                  <span>Titulo</span>
                  <input name="title" type="text" value="Nuevo incidente operativo" required>
                </label>
                <label class="field">
                  <span>Severidad</span>
                  <select name="severity">
                    <option value="medium">media</option>
                    <option value="high" selected>alta</option>
                    <option value="critical">critica</option>
                  </select>
                </label>
                <label class="field">
                  <span>Responsable</span>
                  <select name="ownerAgentId">${options(state.agents, (item) => item.id, (item) => `${item.name} | ${item.role}`)}</select>
                </label>
                <label class="field">
                  <span>Resumen</span>
                  <textarea name="summary" rows="3" required>Describir incidente, impacto inmediato y frente afectado.</textarea>
                </label>
                <input type="hidden" name="actor" value="CEO Nexus">
                <button type="submit">Abrir incidente</button>
              </form>

              <form id="incident-action-form" class="nested-form section-divider">
                <h3>Nueva accion</h3>
                <label class="field">
                  <span>Incidente</span>
                  <select name="incidentId">${options(state.derived.warRoom.incidents, (item) => item.id, (item) => item.title)}</select>
                </label>
                <label class="field">
                  <span>Titulo</span>
                  <input name="title" type="text" value="Nueva accion de contencion" required>
                </label>
                <label class="field">
                  <span>Responsable</span>
                  <select name="ownerAgentId">${options(state.agents, (item) => item.id, (item) => `${item.name} | ${item.role}`)}</select>
                </label>
                <label class="field">
                  <span>Resumen</span>
                  <textarea name="summary" rows="3" required>Describir la accion concreta, el impacto esperado y el entregable.</textarea>
                </label>
                <label class="field">
                  <span>SLA en horas</span>
                  <input name="slaHours" type="number" min="1" step="1" value="4" required>
                </label>
                <input type="hidden" name="actor" value="CEO Nexus">
                <button type="submit">Agregar accion</button>
              </form>
            </div>
          </div>
        </section>

        <section class="panel">
          <h2>Carga de Respuesta</h2>
          <div id="incident-action-load-list" class="stack-list compact">
            ${renderList(
              state.derived.incidentActionLoad,
              (item) => `
                <div class="stack-item ${item.overdueActions > 0 ? "attention-item" : ""}">
                  <span>${escapeHtml(item.ownerName)}</span>
                  <strong>${escapeHtml(item.openActions)}</strong>
                  <p>acciones abiertas | ${escapeHtml(item.overdueActions)} vencidas</p>
                </div>`
            )}
          </div>
        </section>

        <section class="panel">
          <h2>Prioridades del Dia</h2>
          <div id="priorities-list" class="stack-list compact">
            ${renderList(
              state.derived.priorities,
              (item) => `
                <div class="stack-item">
                  <span>${escapeHtml(item.departmentName)}</span>
                  <strong>${escapeHtml(item.title)}</strong>
                  <p>${escapeHtml(item.assignedAgent)} | ${escapeHtml(translateStatus(item.status))} | riesgo ${escapeHtml(translateRisk(item.riskLevel))}</p>
                </div>`
            )}
          </div>
        </section>

        <section class="panel">
          <h2>Bloqueos Clave</h2>
          <div id="blockers-list" class="stack-list compact">
            ${renderList(
              state.derived.blockers,
              (item) => `
                <div class="stack-item">
                  <span>${escapeHtml(item.type)}</span>
                  <strong>${escapeHtml(item.title)}</strong>
                  <p>${escapeHtml(item.owner)} | severidad ${escapeHtml(translateRisk(item.severity))}</p>
                </div>`
            )}
          </div>
        </section>

        <section class="panel">
          <h2>Carga por Director</h2>
          <div id="director-load-list" class="stack-list compact">
            ${renderList(
              state.derived.topDirectors,
              (item) => `
                <div class="stack-item">
                  <span>${escapeHtml(item.departmentName)}</span>
                  <strong>${escapeHtml(item.directorName)}</strong>
                  <p>abiertas ${escapeHtml(item.openTasks)} | bloqueadas ${escapeHtml(item.blockedTasks)} | esperando aprobacion ${escapeHtml(item.awaitingApprovalTasks)}</p>
                </div>`
            )}
          </div>
        </section>

        <section class="panel office-panel">
          <h2>Timeline de Flujo</h2>
          <div id="flow-timeline" class="stack-list compact">
            ${renderList(
              state.derived.flowTimeline,
              (item) => `
                <div class="stack-item">
                  <span>${escapeHtml(new Date(item.timestamp).toLocaleString())}</span>
                  <strong>${escapeHtml(item.title)}</strong>
                  <p>${escapeHtml(item.departmentName)} | ${escapeHtml(item.agentName)} | ${escapeHtml(translateStatus(item.status))} | riesgo ${escapeHtml(translateRisk(item.riskLevel))}</p>
                </div>`
            )}
          </div>
        </section>

        <section class="panel">
          <h2>Rendimiento por Modelo</h2>
          <div id="model-performance-list" class="stack-list compact">
            ${renderList(
              state.derived.modelPerformance,
              (item) => `
                <div class="stack-item">
                  <span>${escapeHtml(item.provider)}</span>
                  <strong>${Math.round(item.score * 100)}%</strong>
                </div>`
            )}
          </div>
        </section>

        <section class="panel office-panel">
          <div class="panel-title-row">
            <h2>Mapa del Headquarters</h2>
            <label class="toggle-row">
              <input id="auto-refresh-toggle" type="checkbox">
              <span>Auto-refresh 30s</span>
            </label>
          </div>
          <div id="office-map">${renderOfficeSvg(state)}</div>
          <div id="agent-legend" class="legend">
            ${renderList(
              state.agents.slice(0, 8),
              (agent) => `
                <div class="legend-item">
                  <strong>${escapeHtml(agent.name)}</strong>
                  <p>${escapeHtml(agent.role)}</p>
                  <p>${escapeHtml(agent.provider)} | ${escapeHtml(translateStatus(agent.status))}</p>
                </div>`
            )}
          </div>
        </section>

        <section class="panel">
          <h2>Planning y Gobierno</h2>
          <div id="plans-list" class="stack-list">
            ${renderList(
              state.plans,
              (plan) => `
                <div class="stack-item">
                  <span>${escapeHtml(plan.id)}</span>
                  <strong>${escapeHtml(translateStatus(plan.status))}</strong>
                  <p>${escapeHtml(plan.summary)}</p>
                  <p>Rollback: ${escapeHtml(plan.rollback)}</p>
                  <span class="status-tag ${statusClass(plan.status)}">${escapeHtml(translateStatus(plan.status))}</span>
                </div>`
            )}
          </div>
          <div class="actions">
            <button id="approve-plan-btn" type="button">CEO: aprobar plan pendiente</button>
            <button id="committee-btn" type="button">Comite: aprobar liberacion critica</button>
            <button id="ceo-critical-btn" type="button">CEO: cerrar liberacion critica</button>
          </div>
        </section>

        <section class="panel office-panel">
          <h2>Centro de Operaciones</h2>
          <div class="forms-grid">
            <form id="mission-form" class="action-form">
              <h3>Nueva mision</h3>
              <label class="field">
                <span>Proyecto</span>
                <select name="projectId">${options(state.projects, (item) => item.id, (item) => item.name)}</select>
              </label>
              <label class="field">
                <span>Titulo</span>
                <input name="title" type="text" value="Nueva iniciativa del headquarters" required>
              </label>
              <label class="field">
                <span>Solicitado por</span>
                <input name="requestedBy" type="text" value="CEO Nexus" required>
              </label>
              <label class="field">
                <span>Riesgo</span>
                <select name="riskLevel">
                  <option value="low">bajo</option>
                  <option value="medium">medio</option>
                  <option value="high" selected>alto</option>
                  <option value="critical">critico</option>
                </select>
              </label>
              <label class="field">
                <span>Resumen</span>
                <textarea name="summary" rows="3" required>Definir una nueva linea de trabajo para el headquarters.</textarea>
              </label>
              <button type="submit">Crear mision</button>
            </form>

            <form id="plan-form" class="action-form">
              <h3>Nuevo plan desde mision</h3>
              <label class="field">
                <span>Mision</span>
                <select name="missionId">${options(state.missions, (item) => item.id, (item) => `${item.title} (${translateStatus(item.status)})`)}</select>
              </label>
              <label class="field">
                <span>Responsable del plan</span>
                <select name="ownerAgentId">${options(
                  state.agents.filter((item) => item.rank === "Director"),
                  (item) => item.id,
                  (item) => `${item.name} | ${item.role}`
                )}</select>
              </label>
              <button type="submit">Crear plan</button>
            </form>

            <form id="task-form" class="action-form">
              <h3>Nueva tarea</h3>
              <label class="field">
                <span>Proyecto</span>
                <select name="projectId">${options(state.projects, (item) => item.id, (item) => item.name)}</select>
              </label>
              <label class="field">
                <span>Plan</span>
                <select name="planId">${options(state.plans, (item) => item.id, (item) => `${item.id} | ${translateStatus(item.status)}`)}</select>
              </label>
              <label class="field">
                <span>Titulo</span>
                <input name="title" type="text" value="Nueva tarea operativa" required>
              </label>
              <label class="field">
                <span>Departamento</span>
                <select name="departmentId">${options(state.departments, (item) => item.id, (item) => item.name)}</select>
              </label>
              <label class="field">
                <span>Responsable</span>
                <select name="assignedAgentId">${options(state.agents, (item) => item.id, (item) => `${item.name} | ${item.role}`)}</select>
              </label>
              <label class="field">
                <span>Riesgo</span>
                <select name="riskLevel">
                  <option value="low">bajo</option>
                  <option value="medium" selected>medio</option>
                  <option value="high">alto</option>
                  <option value="critical">critico</option>
                </select>
              </label>
              <input name="actor" type="hidden" value="CEO Nexus">
              <button type="submit">Crear tarea</button>
            </form>
          </div>
        </section>

        <section class="panel">
          <h2>Aprobaciones</h2>
          <div class="toolbar">
            <label class="field inline-field">
              <span>Buscar</span>
              <input id="approval-search" type="text" placeholder="titulo, riesgo, decision">
            </label>
          </div>
          <div id="approvals-list" class="stack-list">
            ${renderList(
              state.approvals,
              (approval) => `
                <div class="stack-item">
                  <span>${escapeHtml(approval.title)}</span>
                  <strong>${escapeHtml(translateRisk(approval.riskLevel))}</strong>
                  <p>${escapeHtml(approval.committeeMinutes.summary)}</p>
                  <div class="approval-dossier">
                    <div><span class="dossier-label">Decision solicitada</span><p>${escapeHtml(approval.committeeMinutes.decisionRequested ?? "Pendiente")}</p></div>
                    <div><span class="dossier-label">Solicitado por</span><p>${escapeHtml(agentById(state, approval.requestedByAgentId)?.name ?? approval.requestedByAgentId ?? "N/D")}</p></div>
                    <div><span class="dossier-label">Requerido</span><p>${escapeHtml(((approval.requiredRoles || []).map(translateRole)).join(", ") || "auto")}</p></div>
                    <div><span class="dossier-label">SLA de decision</span><p>${escapeHtml(approvalSlaText(approval))}</p></div>
                  </div>
                  <details class="committee-record">
                    <summary>${escapeHtml(approvalDecisionTitle(approval))} | Ver detalle</summary>
                    <div class="committee-sheet">
                      <div><span class="dossier-label">Resumen ejecutivo</span><p>${escapeHtml(approval.committeeMinutes.summary ?? "Pendiente")}</p></div>
                      <div><span class="dossier-label">Solicitado por</span><p>${escapeHtml(agentById(state, approval.requestedByAgentId)?.name ?? approval.requestedByAgentId ?? "N/D")}</p></div>
                      <div><span class="dossier-label">Creada</span><p>${escapeHtml(formatDateTime(approval.createdAt))}</p></div>
                      <div><span class="dossier-label">SLA de decision</span><p>${escapeHtml(approvalSlaText(approval))}</p></div>
                      <div><span class="dossier-label">Detalle tecnico</span><p>${escapeHtml(approval.committeeMinutes.technicalDetail ?? "Pendiente")}</p></div>
                      <div><span class="dossier-label">Impacto esperado</span><p>${escapeHtml(approval.committeeMinutes.expectedImpact ?? "Pendiente")}</p></div>
                      <div><span class="dossier-label">Riesgos identificados</span><p>${escapeHtml((approval.committeeMinutes.risks || []).join(" | ") || "Sin riesgos declarados")}</p></div>
                      <div><span class="dossier-label">Rollback operativo</span><p>${escapeHtml(approval.committeeMinutes.rollback ?? "Pendiente")}</p></div>
                      <div><span class="dossier-label">Costo estimado</span><p>${escapeHtml(approval.committeeMinutes.cost ?? "Pendiente")}</p></div>
                      <div><span class="dossier-label">Decision solicitada</span><p>${escapeHtml(approval.committeeMinutes.decisionRequested ?? "Pendiente")}</p></div>
                      <div><span class="dossier-label">Bitacora de decision</span>${renderDecisionLog(approval)}</div>
                    </div>
                  </details>
                  <span class="status-tag ${statusClass(approval.status)}">${escapeHtml(translateStatus(approval.status))}</span>
                  ${
                    approval.status === "pending"
                      ? `<div class="inline-actions">
                          <button type="button" class="approval-btn" data-approval-id="${escapeHtml(approval.id)}" data-decision="approved" data-role="ceo" data-actor="CEO Nexus">Aprobar</button>
                          <button type="button" class="approval-btn secondary" data-approval-id="${escapeHtml(approval.id)}" data-decision="rejected" data-role="ceo" data-actor="CEO Nexus">Rechazar</button>
                        </div>`
                      : ""
                  }
                </div>`
            )}
          </div>
        </section>

        <section class="panel">
          <h2>Mision y Backlog</h2>
          <div class="toolbar">
            <label class="field inline-field">
              <span>Buscar</span>
              <input id="task-search" type="text" placeholder="mision, tarea, agente">
            </label>
            <label class="field inline-field">
              <span>Estado</span>
              <select id="task-status-filter">
                <option value="">todos</option>
                <option value="planned">planificado</option>
                <option value="in_progress">en progreso</option>
                <option value="review">en revision</option>
                <option value="testing">en pruebas</option>
                <option value="blocked">bloqueado</option>
                <option value="awaiting_approval">esperando aprobacion</option>
                <option value="done">hecho</option>
              </select>
            </label>
          </div>
          <div id="missions-list" class="stack-list">
            ${renderList(
              state.missions,
              (mission) => `
                <div class="stack-item">
                  <span>${escapeHtml(mission.title)}</span>
                  <strong>${escapeHtml(translateStatus(mission.status))}</strong>
                  <p>${escapeHtml(mission.summary)}</p>
                </div>`
            )}
          </div>
          <div id="tasks-list" class="stack-list compact">
            ${renderList(
              state.tasks,
              (task) => `
                <div class="stack-item">
                  <span>${escapeHtml(task.title)}</span>
                  <strong>${escapeHtml(translateStatus(task.status))}</strong>
                  <p>${escapeHtml(agentById(state, task.assignedAgentId)?.name ?? "Sin asignar")} | ${escapeHtml(translateRisk(task.riskLevel))}</p>
                </div>`
            )}
          </div>
        </section>

        <section class="panel">
          <h2>Adaptadores</h2>
          <div id="provider-overview-list" class="stack-list compact">
            ${renderList(
              state.derived.providerOverview,
              (provider) => `
                <div class="stack-item">
                  <span>${escapeHtml(provider.adapterLabel)}</span>
                  <strong>${escapeHtml(provider.provider)}</strong>
                  <p>${escapeHtml(provider.mode)} | canal ${escapeHtml(provider.channel)}</p>
                  <p>sesiones ${escapeHtml(provider.liveSessions)} | cola ${escapeHtml(provider.queuedCommands)}</p>
                  <span class="status-tag ${statusClass(provider.supportsExecution ? "approved" : "pending")}">${provider.supportsExecution ? "ejecutable" : "solo revision"}</span>
                </div>`
            )}
          </div>
        </section>

        <section class="panel">
          <h2>Organigrama y Sesiones</h2>
          <div id="org-chart" class="stack-list">
            ${renderList(
              state.orgChart,
              (edge) => `
                <div class="stack-item">
                  <span>${escapeHtml(agentById(state, edge.managerId)?.name ?? edge.managerId)}</span>
                  <strong>${escapeHtml(agentById(state, edge.reportId)?.name ?? edge.reportId)}</strong>
                  <p>${escapeHtml(agentById(state, edge.reportId)?.role ?? "")}</p>
                </div>`
            )}
          </div>
          <div id="sessions-list" class="stack-list compact">
            ${renderList(
              state.derived.sessionOverview,
              (session) => `
                <div class="stack-item ${session.stale ? "attention-item" : ""}">
                  <span>${escapeHtml(session.provider)} | ${escapeHtml(session.sessionId)}</span>
                  <strong>${escapeHtml(session.agentName)}</strong>
                  <p>${escapeHtml(translateStatus(session.status))} | idle ${escapeHtml(session.idleMinutes)} min</p>
                  <p>Ultima instruccion: ${escapeHtml(session.lastInstruction || "Sin instruccion")}</p>
                  <p>Ultima respuesta: ${escapeHtml(session.lastResponse || "Sin respuesta")}</p>
                  <span class="status-tag ${statusClass(session.stale ? "blocked" : session.status)}">${session.stale ? "sin senal" : escapeHtml(translateStatus(session.status))}</span>
                </div>`
            )}
          </div>
        </section>

        <section class="panel office-panel">
          <h2>Mesa de Sesiones</h2>
          <div class="forms-grid">
            <form id="session-instruction-form" class="action-form">
              <h3>Enviar instruccion</h3>
              <label class="field">
                <span>Sesion</span>
                <select name="sessionId">${options(state.sessions, (item) => item.id, (item) => `${item.id} | ${item.provider}`)}</select>
              </label>
              <label class="field">
                <span>Actor</span>
                <input name="actor" type="text" value="CEO Nexus" required>
              </label>
              <label class="field">
                <span>Instruccion</span>
                <textarea name="instruction" rows="3" required>Continuar con el siguiente incremento operativo y registrar hallazgos en el historial.</textarea>
              </label>
              <button type="submit">Enviar</button>
            </form>

            <form id="session-response-form" class="action-form">
              <h3>Registrar respuesta</h3>
              <label class="field">
                <span>Sesion</span>
                <select name="sessionId">${options(state.sessions, (item) => item.id, (item) => `${item.id} | ${item.provider}`)}</select>
              </label>
              <label class="field">
                <span>Actor</span>
                <input name="actor" type="text" value="Forge Lead" required>
              </label>
              <label class="field">
                <span>Respuesta</span>
                <textarea name="response" rows="3" required>Incremento aplicado. Validando pruebas y sincronizacion del dashboard.</textarea>
              </label>
              <button type="submit">Registrar</button>
            </form>

            <form id="session-status-form" class="action-form">
              <h3>Cambiar estado</h3>
              <label class="field">
                <span>Sesion</span>
                <select name="sessionId">${options(state.sessions, (item) => item.id, (item) => `${item.id} | ${item.provider}`)}</select>
              </label>
              <label class="field">
                <span>Estado</span>
                <select name="status">
                  <option value="active">activo</option>
                  <option value="review">en revision</option>
                  <option value="blocked">bloqueado</option>
                  <option value="idle">en espera</option>
                </select>
              </label>
              <label class="field">
                <span>Detalle</span>
                <textarea name="detail" rows="3">Actualizar estado operativo de la sesion.</textarea>
              </label>
              <input type="hidden" name="actor" value="CEO Nexus">
              <button type="submit">Actualizar estado</button>
            </form>
          </div>
          <div class="forms-grid section-gap">
            <form id="session-command-form" class="action-form">
              <h3>Despachar comando</h3>
              <label class="field">
                <span>Sesion</span>
                <select name="sessionId">${options(state.sessions, (item) => item.id, (item) => `${item.id} | ${item.provider}`)}</select>
              </label>
              <label class="field">
                <span>Actor</span>
                <input name="actor" type="text" value="CEO Nexus" required>
              </label>
              <label class="field">
                <span>Comando</span>
                <textarea name="command" rows="3" required>Revisar el backlog operativo y ejecutar el siguiente paso aprobado.</textarea>
              </label>
              <button type="submit">Encolar comando</button>
            </form>

            <div class="action-form">
              <h3>Cola operativa</h3>
              <div id="session-command-center" class="approval-dossier">
                <div><span class="dossier-label">Pendientes</span><p>${escapeHtml(state.derived.commandCenter.pendingApprovals)}</p></div>
                <div><span class="dossier-label">En cola</span><p>${escapeHtml(state.derived.commandCenter.queued)}</p></div>
                <div><span class="dossier-label">Ejecutando</span><p>${escapeHtml(state.derived.commandCenter.running)}</p></div>
                <div><span class="dossier-label">Fallidos</span><p>${escapeHtml(state.derived.commandCenter.failed)}</p></div>
              </div>
              <div id="session-command-queue" class="stack-list compact">
                ${renderList(
                  state.sessions.flatMap((session) =>
                    (session.commandQueue ?? []).map((command) => ({
                      ...command,
                      sessionId: session.id,
                      provider: session.provider
                    }))
                  ),
                  (command) => `
                    <div class="stack-item">
                      <span>${escapeHtml(command.provider)} | ${escapeHtml(command.sessionId)}</span>
                        <strong>${escapeHtml(command.command)}</strong>
                        <p>${escapeHtml(command.renderedCommand ?? "Sin comando renderizado")}</p>
                      <p>${escapeHtml(command.requestedBy)} | ${escapeHtml(formatDateTime(command.createdAt))} | riesgo ${escapeHtml(translateRisk(command.riskLevel ?? "low"))}</p>
                      <p>${escapeHtml(command.resultSummary ?? "Sin resultado aun")}</p>
                      <p>${escapeHtml(command.artifacts?.metadataPath ?? "Sin artefacto persistido")}</p>
                      <span class="status-tag ${statusClass(command.status === "queued" ? "pending" : command.status)}">${escapeHtml(translateStatus(command.status))}</span>
                        ${
                          command.status === "queued"
                          ? `<div class="inline-actions"><button type="button" class="execute-session-command-btn" data-session-id="${escapeHtml(command.sessionId)}" data-command-id="${escapeHtml(command.id)}">Ejecutar ahora</button><button type="button" class="cancel-session-command-btn secondary" data-session-id="${escapeHtml(command.sessionId)}" data-command-id="${escapeHtml(command.id)}">Cancelar</button></div>`
                            : command.status === "running"
                              ? `<div class="inline-actions"><span class="mini-state">Ejecucion en curso</span></div>`
                              : ["failed", "cancelled"].includes(command.status)
                                ? `<div class="inline-actions"><button type="button" class="retry-session-command-btn" data-session-id="${escapeHtml(command.sessionId)}" data-command-id="${escapeHtml(command.id)}">Reintentar</button></div>`
                                : command.status === "awaiting_approval"
                                  ? `<div class="inline-actions"><span class="mini-state">Pendiente por governance</span><button type="button" class="cancel-session-command-btn secondary" data-session-id="${escapeHtml(command.sessionId)}" data-command-id="${escapeHtml(command.id)}">Cancelar</button></div>`
                                  : command.status !== "completed"
                                    ? `<div class="inline-actions"><button type="button" class="complete-session-command-btn" data-session-id="${escapeHtml(command.sessionId)}" data-command-id="${escapeHtml(command.id)}">Cerrar manualmente</button></div>`
                                : ""
                        }
                    </div>`
                )}
              </div>
            </div>
          </div>
          <div id="session-activity-list" class="stack-list compact">
            ${renderList(
              state.derived.sessionActivity,
              (event) => `
                <div class="stack-item">
                  <span>${escapeHtml(formatDateTime(event.createdAt))}</span>
                  <strong>${escapeHtml(event.agentName)} | ${escapeHtml(sessionEventLabel(event.type))}</strong>
                  <p>${escapeHtml(event.actor)} | ${escapeHtml(event.content)}</p>
                </div>`
            )}
          </div>
        </section>

        <section class="panel">
          <h2>Guia Rapida</h2>
          <div class="stack-list compact">
            <div class="stack-item">
              <strong>Como leer esta fase</strong>
              <p>El dashboard muestra estado real del headquarters. Si algo cambia en misiones, planes o aprobaciones, deberia verse reflejado aqui tras actualizar.</p>
            </div>
            <div class="stack-item">
              <strong>Flujo base</strong>
              <p>Mision -> Plan -> Aprobacion -> Tarea -> Auditoria. Ninguna tarea ejecutable debe nacer sin un plan aprobado.</p>
            </div>
            <div class="stack-item">
              <strong>Que revisar primero</strong>
              <p>Sala de Guerra, Aprobaciones y Planning y Gobierno. Si ahi hay bloqueo, el resto del headquarters se degrada.</p>
            </div>
          </div>
        </section>

        <section class="panel">
          <h2>Leyenda Operativa</h2>
          <div class="stack-list compact">
            <div class="stack-item">
              <strong>Estados</strong>
              <p>planificado, en progreso, en revision, en pruebas, bloqueado, pendiente de aprobacion, aprobado, rechazado.</p>
            </div>
            <div class="stack-item">
              <strong>Riesgo</strong>
              <p>bajo = automatico, medio = director, alto = CEO, critico = comite + CEO.</p>
            </div>
            <div class="stack-item">
              <strong>Uso nocturno</strong>
              <p>Puedes dejar activado el auto-refresh para monitoreo y exportar snapshot antes de cerrar una sesion de trabajo.</p>
            </div>
          </div>
        </section>

        <section class="panel">
          <h2>Metricas</h2>
          <div id="metrics-grid" class="metrics-grid">
            <div class="metric-card"><span>Tiempo de entrega</span><strong>${escapeHtml(state.metrics.leadTimeHours)}h</strong></div>
            <div class="metric-card"><span>Frecuencia de despliegue</span><strong>${escapeHtml(state.metrics.deploymentFrequencyWeekly)}/semana</strong></div>
            <div class="metric-card"><span>Tasa de fallo</span><strong>${Math.round(state.metrics.changeFailureRate * 100)}%</strong></div>
            <div class="metric-card"><span>Tiempo de restauracion</span><strong>${escapeHtml(state.metrics.timeToRestoreHours)}h</strong></div>
            <div class="metric-card"><span>Tiempo bloqueado</span><strong>${escapeHtml(state.metrics.blockedHours)}h</strong></div>
            <div class="metric-card"><span>Espera por aprobacion</span><strong>${escapeHtml(state.metrics.awaitingApprovalHours)}h</strong></div>
            <div class="metric-card"><span>Bugs antes del release</span><strong>${escapeHtml(state.metrics.bugsCaughtPreRelease)}</strong></div>
            <div class="metric-card"><span>Saturacion directiva</span><strong>${Math.round(state.metrics.directorSaturationIndex * 100)}%</strong></div>
          </div>
        </section>

        <section class="panel">
          <h2>Laboratorio de Infraestructura</h2>
          <div id="improvements-list" class="stack-list">
            ${renderList(
              state.improvements,
              (item) => `
                <div class="stack-item">
                  <span>${escapeHtml(item.type)}</span>
                  <strong>${escapeHtml(item.title)}</strong>
                  <p>Impacto: ${escapeHtml(item.impactEstimate)} | Costo: ${escapeHtml(item.costEstimate)}</p>
                </div>`
            )}
          </div>
        </section>

        <section class="panel">
          <h2>Auditoria</h2>
          <div class="toolbar">
            <label class="field inline-field">
              <span>Buscar</span>
              <input id="audit-search" type="text" placeholder="actor, tipo, detalle">
            </label>
          </div>
          <div id="audit-list" class="stack-list compact">
            ${renderList(
              state.auditTrail.slice(0, 8),
              (item) => `
                <div class="stack-item">
                  <span>${escapeHtml(new Date(item.timestamp).toLocaleString())}</span>
                  <strong>${escapeHtml(item.type)}</strong>
                  <p>${escapeHtml(item.actor)}: ${escapeHtml(item.detail)}</p>
                </div>`
            )}
          </div>
        </section>
      </main>
    </div>
    <script id="initial-state" type="application/json">${JSON.stringify(state).replace(/</g, "\\u003c")}</script>
    <script src="/app.js"></script>
  </body>
</html>`;
}
