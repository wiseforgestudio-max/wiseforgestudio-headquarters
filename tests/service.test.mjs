import test from "node:test";
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

test("cannot create executable task without approved plan", () => {
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

test("approving plan unlocks task creation", () => {
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

test("critical approvals need committee and ceo", () => {
  const { service } = createService();
  const state = service.getState();
  const critical = state.approvals.find((item) => item.riskLevel === "critical");

  const afterCommittee = service.decideApproval(critical.id, "approved", "committee", "Release Committee");
  assert.equal(afterCommittee.status, "pending");

  const afterCeo = service.decideApproval(critical.id, "approved", "ceo", "CEO Nexus");
  assert.equal(afterCeo.status, "approved");
});

test("session instructions and responses are appended to history", () => {
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

test("session status changes are tracked in history", () => {
  const { service } = createService();
  const sessionId = "session-claude-arch";
  const session = service.updateSessionStatus(sessionId, "blocked", "CEO Nexus", "Esperando decision ejecutiva");

  assert.equal(session.status, "blocked");
  assert.equal(session.history[0].type, "status");
  assert.match(session.history[0].content, /blocked/i);
});

test("execution adapters can queue and complete commands", () => {
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

test("review-only adapters reject execution commands", () => {
  const { service } = createService();

  assert.throws(
    () => service.dispatchSessionCommand("session-claude-arch", "Ejecutar despliegue", "CEO Nexus"),
    /does not support execution/i
  );
});

test("queued commands can execute through the local adapter executor contract", async () => {
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

test("risky commands require approval before execution", async () => {
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

test("queued commands can be cancelled", () => {
  const { service } = createService();
  const queued = service.dispatchSessionCommand("session-codex-eng", "Preparar nota operativa interna", "CEO Nexus");

  const cancelled = service.cancelSessionCommand("session-codex-eng", queued.id, "CEO Nexus");
  assert.equal(cancelled.status, "cancelled");
});

test("failed commands can be retried", async () => {
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

test("command executions persist artifacts to disk", async () => {
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
