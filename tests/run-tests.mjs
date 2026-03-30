import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { FileStateStore } from "../src/utils/fs-store.mjs";
import { HeadquartersService } from "../src/services/headquarters-service.mjs";

function createService(executor = null) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wiseforge-hq-"));
  const store = new FileStateStore(dir);
  return { service: new HeadquartersService(store, undefined, executor), dir };
}

async function run(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

await run("cannot create executable task without approved plan", () => {
  const { service } = createService();
  assert.throws(
    () =>
      service.createTask({
        projectId: "project-hq-bootstrap",
        planId: "plan-hq-bootstrap-v1",
        title: "Blocked by governance",
        departmentId: "dept-engineering",
        assignedAgentId: "agent-eng-1",
        riskLevel: "medium"
      }),
    /not approved/i
  );
});

await run("approving plan unlocks task creation", () => {
  const { service } = createService();
  service.approvePlan("plan-hq-bootstrap-v1", "ceo", "CEO Nexus");
  const task = service.createTask({
    projectId: "project-hq-bootstrap",
    planId: "plan-hq-bootstrap-v1",
    title: "Unlocked task",
    departmentId: "dept-engineering",
    assignedAgentId: "agent-eng-1",
    riskLevel: "medium"
  });
  assert.equal(task.status, "planned");
});

await run("critical approvals need committee and ceo", () => {
  const { service } = createService();
  const state = service.getState();
  const critical = state.approvals.find((item) => item.riskLevel === "critical");
  const afterCommittee = service.decideApproval(critical.id, "approved", "committee", "Release Committee");
  assert.equal(afterCommittee.status, "pending");
  const afterCeo = service.decideApproval(critical.id, "approved", "ceo", "CEO Nexus");
  assert.equal(afterCeo.status, "approved");
});

await run("war room incidents can be created and resolved", () => {
  const { service } = createService();
  const incident = service.createIncident({
    title: "Incidente de prueba",
    severity: "high",
    ownerAgentId: "agent-ceo",
    summary: "Validar flujo de war room",
    actor: "CEO Nexus"
  });
  assert.equal(incident.status, "active");

  const resolved = service.resolveIncident(incident.id, "CEO Nexus");
  assert.equal(resolved.status, "resolved");
});

await run("incident actions can be created and completed", () => {
  const { service } = createService();
  const incident = service.createIncident({
    title: "Incidente con acciones",
    severity: "high",
    ownerAgentId: "agent-ceo",
    summary: "Validar acciones de war room",
    actor: "CEO Nexus"
  });

  const action = service.addIncidentAction(incident.id, {
    title: "Contener impacto inicial",
    summary: "Asignar responsable y entregar plan de contencion.",
    ownerAgentId: "agent-qa",
    actor: "CEO Nexus"
  });
  assert.equal(action.status, "pending");

  const completed = service.completeIncidentAction(incident.id, action.id, "CEO Nexus");
  assert.equal(completed.status, "completed");
});

await run("incident actions can move to in_progress and derive load", () => {
  const { service } = createService();
  const incident = service.createIncident({
    title: "Incidente con seguimiento",
    severity: "high",
    ownerAgentId: "agent-ceo",
    summary: "Validar SLA y carga por responsable",
    actor: "CEO Nexus"
  });

  const action = service.addIncidentAction(incident.id, {
    title: "Preparar contencion",
    summary: "Definir accion inmediata",
    ownerAgentId: "agent-qa",
    slaHours: 1,
    actor: "CEO Nexus"
  });

  const updated = service.updateIncidentActionStatus(incident.id, action.id, "in_progress", "CEO Nexus");
  assert.equal(updated.status, "in_progress");

  const state = service.getState();
  assert.ok(state.derived.incidentActionLoad.some((item) => item.ownerAgentId === "agent-qa"));
});

await run("derived timeline and war room data are available", () => {
  const { service } = createService();
  const state = service.getState();
  assert.ok(state.derived.flowTimeline.length > 0);
  assert.ok(Array.isArray(state.derived.warRoom.recommendedActions));
  assert.ok(Array.isArray(state.derived.warRoom.actionItems));
  assert.ok(Array.isArray(state.derived.incidentActionLoad));
});

await run("session instructions and responses are appended to history", () => {
  const { service } = createService();
  const sessionId = "session-codex-eng";

  service.sendSessionInstruction(sessionId, "Implementar siguiente incremento", "CEO Nexus");
  service.recordSessionResponse(sessionId, "Incremento implementado", "Forge Lead");

  const state = service.getState();
  const session = state.sessions.find((item) => item.id === sessionId);
  assert.equal(session.lastInstruction, "Implementar siguiente incremento");
  assert.equal(session.lastResponse, "Incremento implementado");
  assert.equal(session.history[0].type, "response");
  assert.equal(session.history[1].type, "instruction");
  assert.ok(state.derived.sessionOverview.some((item) => item.sessionId === sessionId && item.responseCount >= 1));
  assert.ok(state.derived.sessionActivity.some((item) => item.sessionId === sessionId && item.type === "response"));
});

await run("session status changes are tracked in history", () => {
  const { service } = createService();
  const sessionId = "session-claude-arch";
  const session = service.updateSessionStatus(sessionId, "blocked", "CEO Nexus", "Esperando decision ejecutiva");

  assert.equal(session.status, "blocked");
  assert.equal(session.history[0].type, "status");
  assert.match(session.history[0].content, /blocked/i);
});

await run("execution adapters can queue and complete commands", () => {
  const { service } = createService();
  const sessionId = "session-codex-eng";
  const command = service.dispatchSessionCommand(sessionId, "Preparar nota operativa interna", "CEO Nexus");

  assert.equal(command.status, "queued");
  assert.match(command.renderedCommand, /codex exec/i);

  const completed = service.completeSessionCommand(sessionId, command.id, "Smoke check completado", "CEO Nexus");
  assert.equal(completed.status, "completed");

  const state = service.getState();
  assert.ok(state.derived.providerOverview.some((item) => item.adapterKey === "codex-cli" && item.liveSessions >= 1));
});

await run("review-only adapters reject execution commands", () => {
  const { service } = createService();

  assert.throws(
    () => service.dispatchSessionCommand("session-claude-arch", "Ejecutar despliegue", "CEO Nexus"),
    /does not support execution/i
  );
});

await run("queued commands can execute through the local adapter executor contract", async () => {
  const fakeExecutor = {
    async execute() {
      return {
        ok: true,
        code: 0,
        signal: null,
        stdout: "Smoke check ok",
        stderr: ""
      };
    }
  };
  const { service } = createService(fakeExecutor);
  const queued = service.dispatchSessionCommand("session-codex-eng", "Preparar nota operativa interna", "CEO Nexus");

  const result = await service.executeSessionCommand("session-codex-eng", queued.id, "CEO Nexus");
  assert.equal(result.status, "completed");
  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /Smoke check ok/i);
});

await run("risky commands require approval before execution", async () => {
  const fakeExecutor = {
    async execute() {
      return {
        ok: true,
        code: 0,
        signal: null,
        stdout: "Deploy review ok",
        stderr: ""
      };
    }
  };
  const { service } = createService(fakeExecutor);
  const queued = service.dispatchSessionCommand("session-codex-eng", "Deploy release candidate a production", "CEO Nexus");

  assert.equal(queued.status, "awaiting_approval");
  assert.equal(queued.riskLevel, "critical");
  await assert.rejects(
    () => service.executeSessionCommand("session-codex-eng", queued.id, "CEO Nexus"),
    /requires approval/i
  );

  service.decideApproval(queued.approvalId, "approved", "committee", "Release Committee");
  service.decideApproval(queued.approvalId, "approved", "ceo", "CEO Nexus");
  const result = await service.executeSessionCommand("session-codex-eng", queued.id, "CEO Nexus");
  assert.equal(result.status, "completed");
});

await run("queued commands can be cancelled", () => {
  const { service } = createService();
  const queued = service.dispatchSessionCommand("session-codex-eng", "Preparar nota operativa interna", "CEO Nexus");

  const cancelled = service.cancelSessionCommand("session-codex-eng", queued.id, "CEO Nexus");
  assert.equal(cancelled.status, "cancelled");
});

await run("failed commands can be retried", async () => {
  const fakeExecutor = {
    async execute() {
      return {
        ok: false,
        code: 1,
        signal: null,
        stdout: "",
        stderr: "Fallo inicial."
      };
    }
  };
  const { service } = createService(fakeExecutor);
  const queued = service.dispatchSessionCommand("session-codex-eng", "Preparar nota operativa interna", "CEO Nexus");

  await service.executeSessionCommand("session-codex-eng", queued.id, "CEO Nexus");
  const retried = service.retrySessionCommand("session-codex-eng", queued.id, "CEO Nexus");
  assert.equal(retried.retriedFromCommandId, queued.id);
  assert.equal(retried.status, "queued");
});

await run("command executions persist artifacts to disk", async () => {
  const fakeExecutor = {
    async execute() {
      return {
        ok: true,
        code: 0,
        signal: null,
        stdout: "Artifact stdout",
        stderr: ""
      };
    }
  };
  const { service, dir } = createService(fakeExecutor);
  const queued = service.dispatchSessionCommand("session-codex-eng", "Preparar nota operativa interna", "CEO Nexus");
  const result = await service.executeSessionCommand("session-codex-eng", queued.id, "CEO Nexus");

  assert.ok(result.artifacts?.metadataPath);
  assert.ok(fs.existsSync(path.join(dir, result.artifacts.metadataPath)));
  assert.ok(fs.existsSync(path.join(dir, result.artifacts.stdoutPath)));
});

if (!process.exitCode) {
  console.log("All tests passed.");
}
