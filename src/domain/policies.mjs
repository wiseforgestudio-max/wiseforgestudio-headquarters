export const RISK_LEVELS = ["low", "medium", "high", "critical"];

export const TASK_STATUSES = [
  "backlog",
  "planned",
  "in_progress",
  "review",
  "testing",
  "blocked",
  "awaiting_approval",
  "done"
];

export const AGENT_STATUSES = [
  "idle",
  "planning",
  "coding",
  "reviewing",
  "testing",
  "blocked",
  "awaiting_approval",
  "resting"
];

export function getApprovalPolicy(riskLevel) {
  switch (riskLevel) {
    case "low":
      return {
        mode: "auto",
        requiredApprovers: [],
        notify: []
      };
    case "medium":
      return {
        mode: "director",
        requiredApprovers: ["director"],
        notify: ["ceo"]
      };
    case "high":
      return {
        mode: "ceo",
        requiredApprovers: ["ceo"],
        notify: ["director", "ceo"]
      };
    case "critical":
      return {
        mode: "committee",
        requiredApprovers: ["committee", "ceo"],
        notify: ["director", "ceo"]
      };
    default:
      throw new Error(`Unsupported risk level: ${riskLevel}`);
  }
}

export function requiresApprovedPlan(task) {
  return task.executionMode !== "discovery_only";
}

export function canStartTask(task, plan) {
  if (!requiresApprovedPlan(task)) {
    return { ok: true };
  }

  if (!plan) {
    return { ok: false, reason: "Task has no linked plan." };
  }

  if (plan.status !== "approved") {
    return { ok: false, reason: "Linked plan is not approved." };
  }

  return { ok: true };
}
