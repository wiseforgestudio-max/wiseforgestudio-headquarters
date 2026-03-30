function isoMinutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function makeSessionHistory(entries) {
  return entries.map((entry, index) => ({
    id: `session-event-${index + 1}`,
    createdAt: entry.createdAt,
    type: entry.type,
    actor: entry.actor,
    content: entry.content
  }));
}

export function buildSeedState() {
  const generatedAt = new Date().toISOString();

  return {
    meta: {
      productName: "WiseForgeStudio Headquarters",
      version: "0.1.0",
      phase: "Fase 1 - Nucleo de Gobierno",
      generatedAt,
      mission:
        "WiseForgeStudio Headquarters existe para coordinar agentes de IA como una organizacion de desarrollo real.",
      vision:
        "Ser el headquarters lider para organizaciones de agentes de IA con direccion humana, seguridad y trazabilidad."
    },
    headquarters: {
      mode: "local-first",
      currentWarRoom: {
        active: true,
        severity: "high",
        title: "Preparacion de release de HQ Bootstrap",
        ownerAgentId: "agent-ceo"
      },
      policies: {
        planningRequired: true,
        branchProtection: true,
        auditEverything: true,
        secretsExposureAllowed: false,
        deployRequiresRollback: true,
        costStrategy: "zero-minimum"
      }
    },
    departments: [
      { id: "dept-exec", name: "Direccion", directorAgentId: "agent-ceo", zone: "north" },
      { id: "dept-planning", name: "Planning", directorAgentId: "agent-planning", zone: "north-east" },
      { id: "dept-engineering", name: "Ingenieria", directorAgentId: "agent-eng", zone: "east" },
      { id: "dept-qa", name: "QA", directorAgentId: "agent-qa", zone: "south-east" },
      { id: "dept-devops", name: "DevOps", directorAgentId: "agent-devops", zone: "south" },
      { id: "dept-security", name: "Seguridad", directorAgentId: "agent-security", zone: "south-west" },
      { id: "dept-product", name: "Producto UX", directorAgentId: "agent-product", zone: "west" },
      { id: "dept-docs", name: "Documentacion", directorAgentId: "agent-docs", zone: "north-west" },
      { id: "dept-prompt", name: "Ingenieria de Prompts", directorAgentId: "agent-prompt", zone: "center" },
      { id: "dept-innovation", name: "Innovacion PMO", directorAgentId: "agent-innovation", zone: "annex" }
    ],
    agents: [
      { id: "agent-ceo", name: "CEO Nexus", rank: "CEO", role: "Humano en el circuito", provider: "human", status: "awaiting_approval", departmentId: "dept-exec", autonomy: "critical_only", x: 9, y: 2 },
      { id: "agent-planning", name: "Atlas Planner", rank: "Director", role: "Director de Planning", provider: "claude", status: "planning", departmentId: "dept-planning", autonomy: "medium", x: 16, y: 3 },
      { id: "agent-eng", name: "Forge Lead", rank: "Director", role: "Director de Ingenieria", provider: "codex", status: "coding", departmentId: "dept-engineering", autonomy: "medium", x: 24, y: 8 },
      { id: "agent-qa", name: "Sentinel QA", rank: "Director", role: "Director de QA", provider: "claude", status: "testing", departmentId: "dept-qa", autonomy: "medium", x: 24, y: 15 },
      { id: "agent-devops", name: "Flux Ops", rank: "Director", role: "Director de DevOps", provider: "codex", status: "reviewing", departmentId: "dept-devops", autonomy: "medium", x: 16, y: 19 },
      { id: "agent-security", name: "Aegis", rank: "Director", role: "Director de Seguridad", provider: "claude", status: "reviewing", departmentId: "dept-security", autonomy: "high", x: 8, y: 18 },
      { id: "agent-product", name: "Mosaic", rank: "Director", role: "Director de Producto UX", provider: "claude", status: "planning", departmentId: "dept-product", autonomy: "medium", x: 2, y: 9 },
      { id: "agent-docs", name: "Ledger", rank: "Director", role: "Director de Documentacion", provider: "codex", status: "idle", departmentId: "dept-docs", autonomy: "low", x: 3, y: 3 },
      { id: "agent-prompt", name: "Promptsmith", rank: "Director", role: "Director de Ingenieria de Prompts", provider: "codex", status: "coding", departmentId: "dept-prompt", autonomy: "medium", x: 13, y: 10 },
      { id: "agent-innovation", name: "Northstar", rank: "Director", role: "Director de Innovacion PMO", provider: "claude", status: "idle", departmentId: "dept-innovation", autonomy: "medium", x: 18, y: 10 },
      { id: "agent-eng-1", name: "Codex Builder 01", rank: "Subagent", role: "Ingeniero Backend", provider: "codex", status: "coding", departmentId: "dept-engineering", autonomy: "low", x: 27, y: 7 },
      { id: "agent-eng-2", name: "Codex Builder 02", rank: "Subagent", role: "Ingeniero Frontend", provider: "codex", status: "coding", departmentId: "dept-engineering", autonomy: "low", x: 27, y: 9 },
      { id: "agent-qa-1", name: "Claude Auditor 01", rank: "Subagent", role: "Estratega de Pruebas", provider: "claude", status: "testing", departmentId: "dept-qa", autonomy: "low", x: 27, y: 16 },
      { id: "agent-sec-1", name: "Claude Shield 01", rank: "Subagent", role: "Revisor de Seguridad", provider: "claude", status: "reviewing", departmentId: "dept-security", autonomy: "low", x: 5, y: 18 }
    ],
    orgChart: [
      { managerId: "agent-ceo", reportId: "agent-planning" },
      { managerId: "agent-ceo", reportId: "agent-eng" },
      { managerId: "agent-ceo", reportId: "agent-qa" },
      { managerId: "agent-ceo", reportId: "agent-devops" },
      { managerId: "agent-ceo", reportId: "agent-security" },
      { managerId: "agent-ceo", reportId: "agent-product" },
      { managerId: "agent-ceo", reportId: "agent-docs" },
      { managerId: "agent-ceo", reportId: "agent-prompt" },
      { managerId: "agent-ceo", reportId: "agent-innovation" },
      { managerId: "agent-eng", reportId: "agent-eng-1" },
      { managerId: "agent-eng", reportId: "agent-eng-2" },
      { managerId: "agent-qa", reportId: "agent-qa-1" },
      { managerId: "agent-security", reportId: "agent-sec-1" }
    ],
    providers: [
      { id: "provider-codex", name: "Codex", type: "execution", status: "active", adapterKey: "codex-cli" },
      { id: "provider-claude", name: "Claude", type: "strategy-review", status: "active", adapterKey: "claude-cli" },
      { id: "provider-gemini", name: "Gemini", type: "future", status: "planned", adapterKey: "gemini-adapter" }
    ],
    projects: [
      {
        id: "project-hq-bootstrap",
        name: "HQ Bootstrap",
        objective: "Operar el propio headquarters bajo gobierno multiagente para validar una base seria y trazable.",
        status: "execution",
        riskLevel: "high",
        releaseWindow: "2026-03-12",
        ownerAgentId: "agent-ceo"
      }
    ],
    missions: [
      {
        id: "mission-hq-bootstrap",
        projectId: "project-hq-bootstrap",
        title: "Establecer headquarters operativo para coordinar WiseForgeStudio Headquarters",
        requestedBy: "CEO Nexus",
        status: "planned",
        riskLevel: "high",
        summary: "Levantar headquarters local-first con gobierno, dashboard, mapa y auditoria.",
        createdAt: isoMinutesAgo(180)
      }
    ],
    plans: [
      {
        id: "plan-hq-bootstrap-v1",
        missionId: "mission-hq-bootstrap",
        projectId: "project-hq-bootstrap",
        status: "pending_approval",
        ownerAgentId: "agent-planning",
        reviewers: ["agent-eng", "agent-qa", "agent-security", "agent-devops"],
        summary: "Fase 1: nucleo de gobierno, persistencia local, dashboard ejecutivo y mapa 2D de oficina.",
        rollout: "Solo local en Windows con companion listo para LAN.",
        rollback: "Restaurar el snapshot previo del estado JSON y reiniciar el servicio.",
        costImpact: "No requiere gasto.",
        createdAt: isoMinutesAgo(150),
        updatedAt: isoMinutesAgo(40)
      }
    ],
    tasks: [
      {
        id: "task-1",
        projectId: "project-hq-bootstrap",
        planId: "plan-hq-bootstrap-v1",
        title: "Definir modelo de dominio y reglas de gobierno",
        departmentId: "dept-planning",
        assignedAgentId: "agent-planning",
        status: "done",
        riskLevel: "medium",
        executionMode: "normal",
        createdAt: isoMinutesAgo(145),
        updatedAt: isoMinutesAgo(120)
      },
      {
        id: "task-2",
        projectId: "project-hq-bootstrap",
        planId: "plan-hq-bootstrap-v1",
        title: "Implementar abstracciones del gestor local de sesiones",
        departmentId: "dept-engineering",
        assignedAgentId: "agent-eng-1",
        status: "in_progress",
        riskLevel: "medium",
        executionMode: "normal",
        createdAt: isoMinutesAgo(120),
        updatedAt: isoMinutesAgo(10)
      },
      {
        id: "task-3",
        projectId: "project-hq-bootstrap",
        planId: "plan-hq-bootstrap-v1",
        title: "Auditar politica de aprobaciones y proteccion de ramas",
        departmentId: "dept-security",
        assignedAgentId: "agent-sec-1",
        status: "review",
        riskLevel: "high",
        executionMode: "normal",
        createdAt: isoMinutesAgo(110),
        updatedAt: isoMinutesAgo(25)
      },
      {
        id: "task-4",
        projectId: "project-hq-bootstrap",
        planId: "plan-hq-bootstrap-v1",
        title: "Construir oficina pixel que refleje el estado real",
        departmentId: "dept-product",
        assignedAgentId: "agent-product",
        status: "planned",
        riskLevel: "low",
        executionMode: "normal",
        createdAt: isoMinutesAgo(90),
        updatedAt: isoMinutesAgo(50)
      },
      {
        id: "task-5",
        projectId: "project-hq-bootstrap",
        planId: "plan-hq-bootstrap-v1",
        title: "Preparar revision de release readiness",
        departmentId: "dept-qa",
        assignedAgentId: "agent-qa-1",
        status: "awaiting_approval",
        riskLevel: "high",
        executionMode: "normal",
        createdAt: isoMinutesAgo(70),
        updatedAt: isoMinutesAgo(15)
      }
    ],
    approvals: [
      {
        id: "approval-plan-hq-bootstrap-v1",
        entityType: "plan",
        entityId: "plan-hq-bootstrap-v1",
        title: "Aprobar plan de Fase 1 de HQ Bootstrap",
        riskLevel: "high",
        status: "pending",
        requestedByAgentId: "agent-planning",
        requiredRoles: ["ceo"],
        notifiedRoles: ["director"],
        committeeMinutes: {
          summary: "Se solicita autorizacion para ejecutar la Fase 1 del headquarters con backend local, auditoria y companion-ready web.",
          technicalDetail: "Sin dependencias pagas externas. Almacen JSON local, API REST, dashboard real y motor de aprobaciones.",
          expectedImpact: "Habilita direccion operativa seria del headquarters sin quedar atados a un proveedor unico.",
          risks: ["Persistencia JSON sin bloqueo fino", "Sin autenticacion endurecida en esta fase"],
          rollback: "Restaurar snapshot de estado y cerrar companion LAN.",
          cost: "0 USD",
          decisionRequested: "Aprobar la ejecucion de la Fase 1 para operar el headquarters en Windows y continuar a la Fase 1.1."
        },
        createdAt: isoMinutesAgo(42)
      },
      {
        id: "approval-release-hq-bootstrap",
        entityType: "release",
        entityId: "project-hq-bootstrap",
        title: "Checkpoint de release readiness para HQ Bootstrap",
        riskLevel: "critical",
        status: "pending",
        requestedByAgentId: "agent-qa",
        requiredRoles: ["committee", "ceo"],
        notifiedRoles: ["director", "ceo"],
        committeeMinutes: {
          summary: "Se solicita comite formal para validar release readiness del headquarters.",
          technicalDetail: "El informe de QA, la revision de seguridad y la ruta de rollback quedan representados en esta fase.",
          expectedImpact: "Reduce riesgo operacional previo a despliegue.",
          risks: ["Riesgo de regresion", "Preparacion operativa incompleta"],
          rollback: "Abortar release y revertir el paquete de despliegue.",
          cost: "0 USD",
          decisionRequested: "Autorizar o rechazar el checkpoint de release readiness del headquarters antes de cualquier despliegue."
        },
        createdAt: isoMinutesAgo(18)
      }
    ],
    sessions: [
      {
        id: "session-codex-eng",
        agentId: "agent-eng",
        provider: "codex",
        adapterKey: "codex-cli",
        status: "active",
        commandChannel: "local-terminal",
        lastInstruction: "Implement headquarters service endpoints with full audit trail.",
        lastResponse: "Audit trail listo. Revisando integracion del dashboard y cobertura de pruebas.",
        lastSeenAt: isoMinutesAgo(2),
        commandQueue: [
          {
            id: "session-command-1",
            command: "Validar endpoints y cobertura del dashboard ejecutivo",
            renderedCommand: "codex exec --task \"Validar endpoints y cobertura del dashboard ejecutivo\"",
            requestedBy: "CEO Nexus",
            status: "queued",
            createdAt: isoMinutesAgo(6),
            completedAt: null,
            resultSummary: null
          }
        ],
        history: makeSessionHistory([
          {
            type: "instruction",
            actor: "CEO Nexus",
            content: "Implement headquarters service endpoints with full audit trail.",
            createdAt: isoMinutesAgo(16)
          },
          {
            type: "response",
            actor: "Forge Lead",
            content: "Endpoints operativos. Sigo con timeline e incident load.",
            createdAt: isoMinutesAgo(11)
          },
          {
            type: "response",
            actor: "Forge Lead",
            content: "Audit trail listo. Revisando integracion del dashboard y cobertura de pruebas.",
            createdAt: isoMinutesAgo(2)
          }
        ])
      },
      {
        id: "session-claude-arch",
        agentId: "agent-planning",
        provider: "claude",
        adapterKey: "claude-cli",
        status: "active",
        commandChannel: "strategic-review",
        lastInstruction: "Review architecture risks, UX governance and extensibility for future providers.",
        lastResponse: "Arquitectura consistente. Recomiendo formalizar historial de sesiones antes de adaptadores reales.",
        lastSeenAt: isoMinutesAgo(4),
        commandQueue: [],
        history: makeSessionHistory([
          {
            type: "instruction",
            actor: "CEO Nexus",
            content: "Review architecture risks, UX governance and extensibility for future providers.",
            createdAt: isoMinutesAgo(20)
          },
          {
            type: "response",
            actor: "Atlas Planner",
            content: "Arquitectura consistente. Recomiendo formalizar historial de sesiones antes de adaptadores reales.",
            createdAt: isoMinutesAgo(4)
          }
        ])
      }
    ],
    incidents: [
      {
        id: "incident-1",
        title: "Backlog de aprobaciones cerca del gate de release",
        severity: "high",
        status: "active",
        ownerAgentId: "agent-ceo",
        openedAt: isoMinutesAgo(30)
        ,
        actions: [
          {
            id: "incident-action-1",
            title: "Consolidar expediente de aprobacion critica",
            summary: "Reunir evidencia tecnica, riesgos y rollback antes del comite.",
            ownerAgentId: "agent-qa",
            status: "pending",
            createdAt: isoMinutesAgo(24),
            dueAt: isoMinutesAgo(-90),
            completedAt: null
          }
        ]
      }
    ],
    improvements: [
      {
        id: "improve-1",
        type: "security",
        title: "Agregar autenticacion local y acciones de aprobacion firmadas",
        proposerAgentId: "agent-security",
        status: "proposed",
        impactEstimate: "high",
        costEstimate: "0-10 USD",
        requiresApproval: true
      },
      {
        id: "improve-2",
        type: "coordination",
        title: "Introducir abstraccion de event bus antes de automatizar proveedores reales",
        proposerAgentId: "agent-innovation",
        status: "under_review",
        impactEstimate: "medium",
        costEstimate: "0 USD",
        requiresApproval: true
      }
    ],
    auditTrail: [
      {
        id: "audit-1",
        timestamp: isoMinutesAgo(150),
        type: "mission_created",
        actor: "CEO Nexus",
        detail: "Mission mission-hq-bootstrap created for WiseForgeStudio Headquarters."
      },
      {
        id: "audit-2",
        timestamp: isoMinutesAgo(145),
        type: "plan_review_requested",
        actor: "Atlas Planner",
        detail: "Plan plan-hq-bootstrap-v1 enviado a Ingenieria, QA, Seguridad y DevOps."
      },
      {
        id: "audit-3",
        timestamp: isoMinutesAgo(18),
        type: "approval_requested",
        actor: "Sentinel QA",
        detail: "Aprobacion critica solicitada para el release readiness de HQ Bootstrap."
      }
    ],
    metrics: {
      leadTimeHours: 18.4,
      deploymentFrequencyWeekly: 2,
      changeFailureRate: 0.11,
      timeToRestoreHours: 1.8,
      taskCycleHours: 6.2,
      blockedHours: 2.1,
      awaitingApprovalHours: 3.7,
      bugsIntroduced: 4,
      bugsCaughtPreRelease: 9,
      reworkRate: 0.14,
      agentProductivityIndex: 0.83,
      directorSaturationIndex: 0.71,
      agentConflictCount: 1,
      modelPerformance: [
        { provider: "codex", score: 0.87 },
        { provider: "claude", score: 0.82 },
        { provider: "gemini", score: 0.0 }
      ]
    }
  };
}
