import crypto from "node:crypto";
import { canStartTask, getApprovalPolicy } from "../domain/policies.mjs";
import { createProviderRegistry } from "./provider-adapters.mjs";
import { LocalAdapterExecutor } from "./local-adapter-executor.mjs";

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function summarizeExecutionResult(result) {
  const output = result.stdout || result.stderr || "Sin salida.";
  return output.slice(0, 280);
}

function buildCommandArtifactMetadata(session, command, actor, outcome) {
  return {
    commandId: command.id,
    sessionId: session.id,
    adapterKey: session.adapterKey,
    provider: session.provider,
    actor,
    command: command.command,
    renderedCommand: command.renderedCommand,
    riskLevel: command.riskLevel ?? "low",
    status: command.status,
    createdAt: command.createdAt,
    startedAt: command.startedAt ?? null,
    completedAt: command.completedAt ?? null,
    exitCode: command.exitCode ?? null,
    signal: command.signal ?? null,
    resultSummary: command.resultSummary ?? null,
    outcome
  };
}

function ensureCommandText(command) {
  if (!command || typeof command !== "string" || !command.trim()) {
    throw new Error("Session command is required.");
  }
  if (command.length > 500) {
    throw new Error("Session command is too long.");
  }
  if (/[;&|><`]/.test(command)) {
    throw new Error("Session command contains shell control characters.");
  }
}

function classifyCommandRisk(command) {
  const normalized = command.toLowerCase();
  if (/\b(prod|production|deploy|release|publish|secret|token|credential|delete|drop|reset|destroy)\b/.test(normalized)) {
    return "critical";
  }
  if (/\b(migrate|schema|rollback|restart|stop|kill|rotate|approve|access|permission)\b/.test(normalized)) {
    return "high";
  }
  if (/\b(test|build|lint|review|scan|check|audit|verify|smoke)\b/.test(normalized)) {
    return "medium";
  }
  return "low";
}

function minutesBetween(from, to = new Date()) {
  return Math.max(0, Math.round((to.getTime() - new Date(from).getTime()) / 60_000));
}

function normalizeIncidentAction(action) {
  const createdAt = action.createdAt ?? nowIso();
  const dueAt =
    action.dueAt ??
    (action.slaHours ? new Date(new Date(createdAt).getTime() + Number(action.slaHours) * 60 * 60 * 1000).toISOString() : null);
  return {
    id: action.id ?? makeId("incident-action"),
    title: action.title,
    summary: action.summary ?? "",
    ownerAgentId: action.ownerAgentId,
    status: action.status ?? "pending",
    createdAt,
    dueAt,
    completedAt: action.completedAt ?? null
  };
}

const STATUS_PRIORITY = {
  blocked: 5,
  awaiting_approval: 4,
  testing: 3,
  review: 3,
  in_progress: 2,
  planned: 1,
  done: 0
};

const RISK_PRIORITY = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

export class HeadquartersService {
  constructor(store, providerRegistry = createProviderRegistry(), executor = null) {
    this.store = store;
    this.providerRegistry = providerRegistry;
    this.executor = executor ?? new LocalAdapterExecutor(providerRegistry);
  }

  getState() {
    const state = this.store.snapshot();
    return {
      ...state,
      derived: this.buildDerived(state)
    };
  }

  buildDerived(state) {
    const pendingApprovals = state.approvals.filter((item) => item.status === "pending");
    const activeProjects = state.projects.filter((item) => item.status !== "archived");
    const blockedTasks = state.tasks.filter((item) => item.status === "blocked");
    const activeAgents = state.agents.filter((item) => item.status !== "resting");
    const restingAgents = state.agents.filter((item) => item.status === "resting");
    const activeSessions = state.sessions.filter((item) => item.status === "active");
    const directorLoad = state.departments.map((department) => {
      const tasks = state.tasks.filter((task) => task.departmentId === department.id && task.status !== "done");
      const director = state.agents.find((agent) => agent.id === department.directorAgentId);
      const blocked = tasks.filter((task) => task.status === "blocked").length;
      const awaitingApproval = tasks.filter((task) => task.status === "awaiting_approval").length;
      return {
        departmentId: department.id,
        departmentName: department.name,
        directorName: director?.name ?? "N/D",
        openTasks: tasks.length,
        blockedTasks: blocked,
        awaitingApprovalTasks: awaitingApproval,
        loadScore: tasks.length * 10 + blocked * 20 + awaitingApproval * 15
      };
    });
    const priorities = state.tasks
      .filter((task) => task.status !== "done")
      .map((task) => {
        const agent = state.agents.find((item) => item.id === task.assignedAgentId);
        const department = state.departments.find((item) => item.id === task.departmentId);
        return {
          taskId: task.id,
          title: task.title,
          status: task.status,
          riskLevel: task.riskLevel,
          assignedAgent: agent?.name ?? "Sin asignar",
          departmentName: department?.name ?? "N/D",
          priorityScore: (STATUS_PRIORITY[task.status] ?? 0) * 10 + (RISK_PRIORITY[task.riskLevel] ?? 0) * 5
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 5);
    const openIncidents = state.incidents.filter((item) => item.status === "active");
    const blockers = [
      ...blockedTasks.map((task) => ({
        type: "task",
        severity: task.riskLevel,
        title: task.title,
        owner: state.agents.find((item) => item.id === task.assignedAgentId)?.name ?? "Sin asignar"
      })),
      ...pendingApprovals
        .filter((approval) => approval.riskLevel === "high" || approval.riskLevel === "critical")
        .map((approval) => ({
          type: "approval",
          severity: approval.riskLevel,
          title: approval.title,
          owner: state.agents.find((item) => item.id === approval.requestedByAgentId)?.name ?? "N/D"
        })),
      ...openIncidents.map((incident) => ({
        type: "incident",
        severity: incident.severity,
        title: incident.title,
        owner: state.agents.find((item) => item.id === incident.ownerAgentId)?.name ?? "N/D"
      }))
    ].slice(0, 6);
    const modelPerformance = [...state.metrics.modelPerformance].sort((a, b) => b.score - a.score);
    const topDirectors = [...directorLoad].sort((a, b) => b.loadScore - a.loadScore).slice(0, 5);
    const warRoom = {
      active: state.headquarters.currentWarRoom.active,
      title: state.headquarters.currentWarRoom.title,
      severity: state.headquarters.currentWarRoom.severity,
      owner: state.agents.find((item) => item.id === state.headquarters.currentWarRoom.ownerAgentId)?.name ?? "N/D",
      incidents: openIncidents.map((incident) => ({
        ...incident,
        ownerName: state.agents.find((item) => item.id === incident.ownerAgentId)?.name ?? "N/D",
        actions: (incident.actions ?? []).map((action) => ({
          ...action,
          ownerName: state.agents.find((item) => item.id === action.ownerAgentId)?.name ?? "N/D"
        }))
      })),
      actionItems: openIncidents
        .flatMap((incident) =>
          (incident.actions ?? [])
            .filter((action) => action.status !== "completed")
            .map((action) => ({
              incidentId: incident.id,
              incidentTitle: incident.title,
              incidentSeverity: incident.severity,
              ...action,
              ownerName: state.agents.find((item) => item.id === action.ownerAgentId)?.name ?? "N/D",
              overdue: Boolean(action.dueAt && new Date(action.dueAt) < new Date()),
              dueLabel: action.dueAt ? new Date(action.dueAt).toLocaleString("es-CO") : "Sin SLA"
            }))
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8),
      recommendedActions: [
        ...pendingApprovals.slice(0, 2).map((approval) => ({
          type: "approval",
          title: `Resolver aprobacion: ${approval.title}`,
          owner: state.agents.find((item) => item.id === approval.requestedByAgentId)?.name ?? "N/D"
        })),
        ...blockedTasks.slice(0, 2).map((task) => ({
          type: "task",
          title: `Desbloquear tarea: ${task.title}`,
          owner: state.agents.find((item) => item.id === task.assignedAgentId)?.name ?? "Sin asignar"
        })),
        ...openIncidents.slice(0, 2).map((incident) => ({
          type: "incident",
          title: `Atender incidente: ${incident.title}`,
          owner: state.agents.find((item) => item.id === incident.ownerAgentId)?.name ?? "N/D"
        }))
      ].slice(0, 5)
    };
    const incidentActionLoad = Object.values(
      openIncidents
        .flatMap((incident) => (incident.actions ?? []).filter((action) => action.status !== "completed"))
        .reduce((acc, action) => {
          const owner = state.agents.find((item) => item.id === action.ownerAgentId);
          const key = action.ownerAgentId;
          if (!acc[key]) {
            acc[key] = {
              ownerAgentId: key,
              ownerName: owner?.name ?? "N/D",
              openActions: 0,
              overdueActions: 0
            };
          }
          acc[key].openActions += 1;
          if (action.dueAt && new Date(action.dueAt) < new Date()) {
            acc[key].overdueActions += 1;
          }
          return acc;
        }, {})
    )
      .sort((a, b) => b.overdueActions - a.overdueActions || b.openActions - a.openActions)
      .slice(0, 6);
    const flowTimeline = state.tasks
      .map((task) => {
        const department = state.departments.find((item) => item.id === task.departmentId);
        const agent = state.agents.find((item) => item.id === task.assignedAgentId);
        return {
          taskId: task.id,
          title: task.title,
          departmentName: department?.name ?? "N/D",
          agentName: agent?.name ?? "Sin asignar",
          status: task.status,
          riskLevel: task.riskLevel,
          timestamp: task.updatedAt ?? task.createdAt
        };
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8);
    const sessionOverview = state.sessions
      .map((session) => {
        const agent = state.agents.find((item) => item.id === session.agentId);
        const history = [...(session.history ?? [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const lastEvent = history[0] ?? null;
        const instructionCount = history.filter((item) => item.type === "instruction").length;
        const responseCount = history.filter((item) => item.type === "response").length;
        const runningCommands = (session.commandQueue ?? []).filter((item) => item.status === "running").length;
        const queuedCommands = (session.commandQueue ?? []).filter((item) => item.status === "queued").length;
        const idleMinutes = minutesBetween(session.lastSeenAt ?? lastEvent?.createdAt ?? nowIso());
        return {
          sessionId: session.id,
          agentId: session.agentId,
          agentName: agent?.name ?? "N/D",
          provider: session.provider,
          status: session.status,
          lastInstruction: session.lastInstruction ?? "",
          lastResponse: session.lastResponse ?? "",
          lastSeenAt: session.lastSeenAt ?? null,
          idleMinutes,
          stale: idleMinutes >= 15,
          instructionCount,
          responseCount,
          runningCommands,
          queuedCommands,
          historyDepth: history.length,
          lastEventType: lastEvent?.type ?? "none",
          lastEventContent: lastEvent?.content ?? "Sin actividad registrada"
        };
      })
      .sort((a, b) => {
        if (a.stale !== b.stale) {
          return Number(b.stale) - Number(a.stale);
        }
        return a.idleMinutes - b.idleMinutes;
      });
    const sessionActivity = state.sessions
      .flatMap((session) =>
        (session.history ?? []).map((event) => {
          const agent = state.agents.find((item) => item.id === session.agentId);
          return {
            sessionId: session.id,
            agentId: session.agentId,
            agentName: agent?.name ?? "N/D",
            provider: session.provider,
            status: session.status,
            ...event
          };
        })
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    const providerOverview = state.providers
      .map((provider) => this.providerRegistry.describe(provider, state.sessions))
      .sort((a, b) => b.liveSessions - a.liveSessions || b.queuedCommands - a.queuedCommands);
    const commandApprovals = pendingApprovals.filter((item) => item.entityType === "session_command");

    return {
      executiveSummary: {
        activeProjects: activeProjects.length,
        pendingApprovals: pendingApprovals.length,
        openRisks: state.incidents.filter((item) => item.status === "active").length,
        activeAgents: activeAgents.length,
        restingAgents: restingAgents.length,
        blockedTasks: blockedTasks.length,
        activeSessions: activeSessions.length
      },
      directorLoad,
      topDirectors,
      priorities,
      blockers,
      modelPerformance,
      warRoom,
      incidentActionLoad,
      flowTimeline,
      providerOverview,
      sessionOverview,
      sessionActivity,
      taskFlow: state.tasks.map((task) => ({
        taskId: task.id,
        title: task.title,
        departmentId: task.departmentId,
        status: task.status,
        assignedAgentId: task.assignedAgentId
      })),
      approvalQueueByRisk: {
        low: pendingApprovals.filter((item) => item.riskLevel === "low").length,
        medium: pendingApprovals.filter((item) => item.riskLevel === "medium").length,
        high: pendingApprovals.filter((item) => item.riskLevel === "high").length,
        critical: pendingApprovals.filter((item) => item.riskLevel === "critical").length
      },
      commandCenter: {
        pendingApprovals: commandApprovals.length,
        queued: state.sessions.reduce((count, session) => count + (session.commandQueue ?? []).filter((item) => item.status === "queued").length, 0),
        running: state.sessions.reduce((count, session) => count + (session.commandQueue ?? []).filter((item) => item.status === "running").length, 0),
        failed: state.sessions.reduce((count, session) => count + (session.commandQueue ?? []).filter((item) => item.status === "failed").length, 0)
      }
    };
  }

  createMission(input) {
    const state = this.store.read();
    const mission = {
      id: makeId("mission"),
      projectId: input.projectId,
      title: input.title,
      requestedBy: input.requestedBy,
      status: "draft",
      riskLevel: input.riskLevel,
      summary: input.summary,
      createdAt: nowIso()
    };

    state.missions.unshift(mission);
    this.recordAudit(state, "mission_created", input.requestedBy, `Mission ${mission.id} created.`);
    this.store.write(state);
    return mission;
  }

  createPlanFromMission(missionId, ownerAgentId) {
    const state = this.store.read();
    const mission = state.missions.find((item) => item.id === missionId);
    if (!mission) {
      throw new Error("Mission not found.");
    }

    const plan = {
      id: makeId("plan"),
      missionId,
      projectId: mission.projectId,
      status: "pending_approval",
      ownerAgentId,
      reviewers: ["agent-eng", "agent-qa", "agent-security", "agent-devops"],
      summary: `Execution plan for ${mission.title}`,
      rollout: "Local-first rollout.",
      rollback: "Restore snapshot and restart service.",
      costImpact: "Zero required spend.",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    mission.status = "planned";
    state.plans.unshift(plan);
    const approval = this.createApprovalRecord("plan", plan.id, plan.summary, mission.riskLevel, ownerAgentId);
    state.approvals.unshift(approval);
    this.recordAudit(state, "plan_created", ownerAgentId, `Plan ${plan.id} created from mission ${missionId}.`);
    this.store.write(state);
    return { plan, approval };
  }

  approvePlan(planId, actorRole = "ceo", actorName = "CEO") {
    const state = this.store.read();
    const plan = state.plans.find((item) => item.id === planId);
    if (!plan) {
      throw new Error("Plan not found.");
    }

    const approval = state.approvals.find((item) => item.entityType === "plan" && item.entityId === planId && item.status === "pending");
    if (approval) {
      this.applyApprovalDecisionRecord(approval, "approved", actorRole, actorName);
    }

    plan.status = "approved";
    plan.updatedAt = nowIso();
    this.recordAudit(state, "plan_approved", actorName, `Plan ${planId} approved by ${actorRole}.`);
    this.store.write(state);
    return plan;
  }

  createTask(input) {
    const state = this.store.read();
    const plan = state.plans.find((item) => item.id === input.planId);
    const gate = canStartTask({ executionMode: input.executionMode ?? "normal" }, plan);
    if (!gate.ok) {
      throw new Error(gate.reason);
    }

    const task = {
      id: makeId("task"),
      projectId: input.projectId,
      planId: input.planId,
      title: input.title,
      departmentId: input.departmentId,
      assignedAgentId: input.assignedAgentId,
      status: "planned",
      riskLevel: input.riskLevel,
      executionMode: input.executionMode ?? "normal",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    state.tasks.unshift(task);
    this.recordAudit(state, "task_created", input.actor ?? "system", `Task ${task.id} created.`);
    this.store.write(state);
    return task;
  }

  createApproval(input) {
    const state = this.store.read();
    const approval = this.createApprovalRecord(
      input.entityType,
      input.entityId,
      input.title,
      input.riskLevel,
      input.requestedByAgentId,
      input.committeeMinutes
    );
    state.approvals.unshift(approval);
    this.recordAudit(state, "approval_requested", input.requestedByAgentId, `Approval ${approval.id} requested.`);
    this.store.write(state);
    return approval;
  }

  createIncident(input) {
    const state = this.store.read();
    const incident = {
      id: makeId("incident"),
      title: input.title,
      severity: input.severity,
      status: "active",
      ownerAgentId: input.ownerAgentId,
      summary: input.summary,
      openedAt: nowIso(),
      actions: (input.actions ?? []).map(normalizeIncidentAction)
    };

    state.incidents.unshift(incident);
    state.headquarters.currentWarRoom = {
      active: true,
      severity: input.severity,
      title: input.title,
      ownerAgentId: input.ownerAgentId
    };
    this.recordAudit(state, "incident_created", input.actor ?? "CEO Nexus", `Incidente ${incident.id} creado.`);
    this.store.write(state);
    return incident;
  }

  resolveIncident(incidentId, actor = "CEO Nexus") {
    const state = this.store.read();
    const incident = state.incidents.find((item) => item.id === incidentId);
    if (!incident) {
      throw new Error("Incident not found.");
    }

    incident.status = "resolved";
    incident.resolvedAt = nowIso();
    const remaining = state.incidents.filter((item) => item.status === "active");
    if (remaining.length === 0) {
      state.headquarters.currentWarRoom.active = false;
      state.headquarters.currentWarRoom.title = "Sin incidentes activos";
      state.headquarters.currentWarRoom.severity = "low";
    }
    this.recordAudit(state, "incident_resolved", actor, `Incidente ${incidentId} resuelto.`);
    this.store.write(state);
    return incident;
  }

  addIncidentAction(incidentId, input) {
    const state = this.store.read();
    const incident = state.incidents.find((item) => item.id === incidentId);
    if (!incident) {
      throw new Error("Incident not found.");
    }
    if (incident.status !== "active") {
      throw new Error("Incident is not active.");
    }

    incident.actions ??= [];
    const action = normalizeIncidentAction(input);
    incident.actions.unshift(action);
    this.recordAudit(
      state,
      "incident_action_created",
      input.actor ?? "CEO Nexus",
      `Accion ${action.id} creada para incidente ${incidentId}.`
    );
    this.store.write(state);
    return action;
  }

  completeIncidentAction(incidentId, actionId, actor = "CEO Nexus") {
    const state = this.store.read();
    const incident = state.incidents.find((item) => item.id === incidentId);
    if (!incident) {
      throw new Error("Incident not found.");
    }

    const action = (incident.actions ?? []).find((item) => item.id === actionId);
    if (!action) {
      throw new Error("Incident action not found.");
    }

    action.status = "completed";
    action.completedAt = nowIso();
    this.recordAudit(state, "incident_action_completed", actor, `Accion ${actionId} completada en incidente ${incidentId}.`);
    this.store.write(state);
    return action;
  }

  updateIncidentActionStatus(incidentId, actionId, status, actor = "CEO Nexus") {
    const state = this.store.read();
    const incident = state.incidents.find((item) => item.id === incidentId);
    if (!incident) {
      throw new Error("Incident not found.");
    }

    const action = (incident.actions ?? []).find((item) => item.id === actionId);
    if (!action) {
      throw new Error("Incident action not found.");
    }

    action.status = status;
    if (status === "completed") {
      action.completedAt = nowIso();
    }
    this.recordAudit(
      state,
      "incident_action_status_changed",
      actor,
      `Accion ${actionId} cambiada a ${status} en incidente ${incidentId}.`
    );
    this.store.write(state);
    return action;
  }

  decideApproval(approvalId, decision, actorRole, actorName) {
    const state = this.store.read();
    const approval = state.approvals.find((item) => item.id === approvalId);
    if (!approval) {
      throw new Error("Approval not found.");
    }

    this.applyApprovalDecisionRecord(approval, decision, actorRole, actorName);
    this.recordAudit(state, "approval_decided", actorName, `Approval ${approvalId} ${decision}.`);
    this.store.write(state);
    return approval;
  }

  updateAgentStatus(agentId, status) {
    const state = this.store.read();
    const agent = state.agents.find((item) => item.id === agentId);
    if (!agent) {
      throw new Error("Agent not found.");
    }

    agent.status = status;
    this.recordAudit(state, "agent_status_changed", agent.name, `Agent ${agentId} changed to ${status}.`);
    this.store.write(state);
    return agent;
  }

  sendSessionInstruction(sessionId, instruction, actor = "CEO") {
    const state = this.store.read();
    const session = state.sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }

    session.lastInstruction = instruction;
    session.lastSeenAt = nowIso();
    this.appendSessionEvent(session, {
      type: "instruction",
      actor,
      content: instruction
    });
    this.recordAudit(state, "session_instruction_sent", actor, `Instruction sent to session ${sessionId}.`);
    this.store.write(state);
    return session;
  }

  dispatchSessionCommand(sessionId, command, actor = "CEO") {
    const state = this.store.read();
    const session = state.sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }
    ensureCommandText(command);

    const adapter = this.providerRegistry.getForSession(session);
    if (!adapter) {
      throw new Error(`Adapter ${session.adapterKey} is not registered.`);
    }
    if (!adapter.supportsExecution) {
      throw new Error(`Adapter ${session.adapterKey} does not support execution commands.`);
    }
    const riskLevel = classifyCommandRisk(command);

    const queueItem = {
      id: makeId("session-command"),
      command,
      renderedCommand: this.providerRegistry.renderCommand(session.adapterKey, command),
      requestedBy: actor,
      riskLevel,
      status: getApprovalPolicy(riskLevel).mode === "auto" ? "queued" : "awaiting_approval",
      createdAt: nowIso(),
      completedAt: null,
      resultSummary: null,
      approvalId: null
    };
    if (queueItem.status === "awaiting_approval") {
      const approval = this.createApprovalRecord(
        "session_command",
        queueItem.id,
        `Autorizar comando para ${session.id}`,
        riskLevel,
        session.agentId,
        {
          summary: `Se solicita autorizacion para ejecutar: ${command}`,
          technicalDetail: `Adapter ${session.adapterKey} renderiza el comando como: ${queueItem.renderedCommand ?? "N/D"}.`,
          expectedImpact: "Permite ejecucion local controlada desde el headquarters.",
          risks: [`Riesgo clasificado como ${riskLevel}`],
          rollback: "Abortar ejecucion y revisar cola operativa.",
          cost: "0 USD",
          decisionRequested: `Aprobar la ejecucion del comando ${queueItem.id}.`
        }
      );
      queueItem.approvalId = approval.id;
      state.approvals.unshift(approval);
    }

    session.commandQueue ??= [];
    session.commandQueue.unshift(queueItem);
    session.commandQueue = session.commandQueue.slice(0, 20);
    session.lastSeenAt = nowIso();
    this.appendSessionEvent(session, {
      type: "command",
      actor,
      content: `Comando ${queueItem.status === "awaiting_approval" ? "pendiente de aprobacion" : "en cola"}: ${command}`
    });
    this.recordAudit(state, "session_command_queued", actor, `Command ${queueItem.id} queued for session ${sessionId}.`);
    this.store.write(state);
    return queueItem;
  }

  completeSessionCommand(sessionId, commandId, resultSummary, actor = "system") {
    const state = this.store.read();
    const session = state.sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }

    const command = (session.commandQueue ?? []).find((item) => item.id === commandId);
    if (!command) {
      throw new Error("Session command not found.");
    }

    command.status = "completed";
    command.completedAt = nowIso();
    command.resultSummary = resultSummary;
    command.artifacts = this.store.writeCommandArtifact(command.id, {
      metadata: buildCommandArtifactMetadata(session, command, actor, "manually_completed"),
      stdout: resultSummary ?? "",
      stderr: ""
    });
    session.lastSeenAt = nowIso();
    this.appendSessionEvent(session, {
      type: "command_result",
      actor,
      content: `Resultado ${commandId}: ${resultSummary}`
    });
    this.recordAudit(state, "session_command_completed", actor, `Command ${commandId} completed for session ${sessionId}.`);
    this.store.write(state);
    return command;
  }

  cancelSessionCommand(sessionId, commandId, actor = "system") {
    const state = this.store.read();
    const session = state.sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }

    const command = (session.commandQueue ?? []).find((item) => item.id === commandId);
    if (!command) {
      throw new Error("Session command not found.");
    }
    if (command.status === "running") {
      throw new Error("Running commands cannot be cancelled.");
    }
    if (command.status === "completed") {
      throw new Error("Completed commands cannot be cancelled.");
    }

    command.status = "cancelled";
    command.completedAt = nowIso();
    command.resultSummary = "Cancelado manualmente.";
    command.artifacts = this.store.writeCommandArtifact(command.id, {
      metadata: buildCommandArtifactMetadata(session, command, actor, "cancelled"),
      stdout: "",
      stderr: "Cancelado manualmente."
    });
    session.lastSeenAt = nowIso();
    this.appendSessionEvent(session, {
      type: "command_result",
      actor,
      content: `cancelled: ${command.command}`
    });
    this.recordAudit(state, "session_command_cancelled", actor, `Command ${commandId} cancelled for session ${sessionId}.`);
    this.store.write(state);
    return command;
  }

  retrySessionCommand(sessionId, commandId, actor = "system") {
    const state = this.store.read();
    const session = state.sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }

    const previous = (session.commandQueue ?? []).find((item) => item.id === commandId);
    if (!previous) {
      throw new Error("Session command not found.");
    }
    if (!["failed", "cancelled"].includes(previous.status)) {
      throw new Error("Only failed or cancelled commands can be retried.");
    }

    const retried = {
      id: makeId("session-command"),
      command: previous.command,
      renderedCommand: previous.renderedCommand,
      requestedBy: actor,
      riskLevel: previous.riskLevel ?? classifyCommandRisk(previous.command),
      status: previous.approvalId ? "awaiting_approval" : "queued",
      createdAt: nowIso(),
      completedAt: null,
      resultSummary: null,
      approvalId: null,
      retriedFromCommandId: previous.id
    };

    if (retried.status === "awaiting_approval") {
      const approval = this.createApprovalRecord(
        "session_command",
        retried.id,
        `Reintento de comando para ${session.id}`,
        retried.riskLevel,
        session.agentId,
        {
          summary: `Se solicita autorizacion para reintentar: ${previous.command}`,
          technicalDetail: `Reintento desde ${previous.id}. Adapter ${session.adapterKey}.`,
          expectedImpact: "Permite reintento controlado desde el headquarters.",
          risks: [`Riesgo clasificado como ${retried.riskLevel}`],
          rollback: "Cancelar reintento y revisar causa del fallo previo.",
          cost: "0 USD",
          decisionRequested: `Aprobar el reintento del comando ${retried.id}.`
        }
      );
      retried.approvalId = approval.id;
      state.approvals.unshift(approval);
    }

    session.commandQueue ??= [];
    session.commandQueue.unshift(retried);
    session.commandQueue = session.commandQueue.slice(0, 20);
    session.lastSeenAt = nowIso();
    this.appendSessionEvent(session, {
      type: "command",
      actor,
      content: `Reintento creado desde ${previous.id}: ${previous.command}`
    });
    this.recordAudit(state, "session_command_retried", actor, `Command ${commandId} retried for session ${sessionId} as ${retried.id}.`);
    this.store.write(state);
    return retried;
  }

  async executeSessionCommand(sessionId, commandId, actor = "system") {
    const state = this.store.read();
    const session = state.sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }

    const command = (session.commandQueue ?? []).find((item) => item.id === commandId);
    if (!command) {
      throw new Error("Session command not found.");
    }
    if (command.status === "completed") {
      throw new Error("Session command is already completed.");
    }
    if (command.status === "awaiting_approval") {
      const approval = state.approvals.find((item) => item.id === command.approvalId);
      if (!approval || approval.status !== "approved") {
        throw new Error("Session command still requires approval.");
      }
      command.status = "queued";
    }
    if (command.status === "failed") {
      command.status = "queued";
    }
    if (command.status !== "queued") {
      throw new Error(`Session command cannot be executed from status ${command.status}.`);
    }

    command.status = "running";
    command.startedAt = nowIso();
    session.status = "active";
    session.lastSeenAt = nowIso();
    this.appendSessionEvent(session, {
      type: "command",
      actor,
      content: `Ejecutando ${command.id}: ${command.command}`
    });
    this.recordAudit(state, "session_command_started", actor, `Command ${command.id} started for session ${sessionId}.`);
    this.store.write(state);

    try {
      const result = await this.executor.execute(session, command);
      const freshState = this.store.read();
      const freshSession = freshState.sessions.find((item) => item.id === sessionId);
      if (!freshSession) {
        throw new Error("Session not found after execution.");
      }
      const freshCommand = (freshSession.commandQueue ?? []).find((item) => item.id === commandId);
      if (!freshCommand) {
        throw new Error("Session command not found after execution.");
      }

      freshCommand.status = result.ok ? "completed" : "failed";
      freshCommand.completedAt = nowIso();
      freshCommand.exitCode = result.code;
      freshCommand.signal = result.signal;
      freshCommand.stdout = result.stdout;
      freshCommand.stderr = result.stderr;
      freshCommand.resultSummary = summarizeExecutionResult(result);
      freshCommand.artifacts = this.store.writeCommandArtifact(freshCommand.id, {
        metadata: buildCommandArtifactMetadata(freshSession, freshCommand, actor, result.ok ? "completed" : "failed"),
        stdout: result.stdout,
        stderr: result.stderr
      });
      freshSession.lastResponse = freshCommand.resultSummary;
      freshSession.lastSeenAt = nowIso();
      this.appendSessionEvent(freshSession, {
        type: "command_result",
        actor,
        content: `${freshCommand.status}: ${freshCommand.resultSummary}`
      });
      this.recordAudit(
        freshState,
        result.ok ? "session_command_completed" : "session_command_failed",
        actor,
        `Command ${commandId} ${result.ok ? "completed" : "failed"} for session ${sessionId}.`
      );
      this.store.write(freshState);
      return freshCommand;
    } catch (error) {
      const failedState = this.store.read();
      const failedSession = failedState.sessions.find((item) => item.id === sessionId);
      if (!failedSession) {
        throw error;
      }
      const failedCommand = (failedSession.commandQueue ?? []).find((item) => item.id === commandId);
      if (!failedCommand) {
        throw error;
      }

      failedCommand.status = "failed";
      failedCommand.completedAt = nowIso();
      failedCommand.stderr = error.message;
      failedCommand.resultSummary = error.message;
      failedCommand.artifacts = this.store.writeCommandArtifact(failedCommand.id, {
        metadata: buildCommandArtifactMetadata(failedSession, failedCommand, actor, "failed"),
        stdout: failedCommand.stdout ?? "",
        stderr: error.message
      });
      failedSession.lastResponse = error.message;
      failedSession.lastSeenAt = nowIso();
      this.appendSessionEvent(failedSession, {
        type: "command_result",
        actor,
        content: `failed: ${error.message}`
      });
      this.recordAudit(failedState, "session_command_failed", actor, `Command ${commandId} failed for session ${sessionId}.`);
      this.store.write(failedState);
      return failedCommand;
    }
  }

  recordSessionResponse(sessionId, response, actor = "Agent") {
    const state = this.store.read();
    const session = state.sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }

    session.lastResponse = response;
    session.lastSeenAt = nowIso();
    if (session.status === "idle") {
      session.status = "active";
    }
    this.appendSessionEvent(session, {
      type: "response",
      actor,
      content: response
    });
    this.recordAudit(state, "session_response_recorded", actor, `Response recorded for session ${sessionId}.`);
    this.store.write(state);
    return session;
  }

  updateSessionStatus(sessionId, status, actor = "system", detail = "") {
    const state = this.store.read();
    const session = state.sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }

    session.status = status;
    session.lastSeenAt = nowIso();
    const content = detail ? `${status}: ${detail}` : `Status changed to ${status}.`;
    this.appendSessionEvent(session, {
      type: "status",
      actor,
      content
    });
    this.recordAudit(state, "session_status_changed", actor, `Session ${sessionId} changed to ${status}.`);
    this.store.write(state);
    return session;
  }

  recordAudit(state, type, actor, detail) {
    const event = {
      id: makeId("audit"),
      timestamp: nowIso(),
      type,
      actor,
      detail
    };
    state.auditTrail.unshift(event);
    state.auditTrail = state.auditTrail.slice(0, 50);
    this.store.appendAudit(event);
  }

  appendSessionEvent(session, entry) {
    session.history ??= [];
    session.history.unshift({
      id: makeId("session-event"),
      type: entry.type,
      actor: entry.actor,
      content: entry.content,
      createdAt: nowIso()
    });
    session.history = session.history.slice(0, 25);
  }

  createApprovalRecord(entityType, entityId, title, riskLevel, requestedByAgentId, committeeMinutes) {
    const policy = getApprovalPolicy(riskLevel);
    return {
      id: makeId("approval"),
      entityType,
      entityId,
      title,
      riskLevel,
      status: policy.mode === "auto" ? "approved" : "pending",
      requestedByAgentId,
      requiredRoles: policy.requiredApprovers,
      notifiedRoles: policy.notify,
      committeeMinutes:
        committeeMinutes ?? {
          summary: title,
          technicalDetail: "Pending committee detail.",
          expectedImpact: "Pending impact assessment.",
          risks: [],
          rollback: "Pending rollback design.",
          cost: "0 USD",
          decisionRequested: "Pending executive decision."
        },
      decisionLog: [],
      createdAt: nowIso()
    };
  }

  applyApprovalDecisionRecord(approval, decision, actorRole, actorName) {
    approval.decisionLog ??= [];
    approval.decisionLog.push({
      actorRole,
      actorName,
      decision,
      at: nowIso()
    });

    if (approval.riskLevel === "critical") {
      const hasCommittee = approval.decisionLog.some((entry) => entry.actorRole === "committee" && entry.decision === "approved");
      const hasCeo = approval.decisionLog.some((entry) => entry.actorRole === "ceo" && entry.decision === "approved");
      if (hasCommittee && hasCeo) {
        approval.status = "approved";
      } else if (decision === "rejected") {
        approval.status = "rejected";
      } else {
        approval.status = "pending";
      }
      return;
    }

    approval.status = decision;
  }
}
