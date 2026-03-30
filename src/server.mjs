import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { FileStateStore } from "./utils/fs-store.mjs";
import { HeadquartersService } from "./services/headquarters-service.mjs";

const args = process.argv.slice(2);
const hostArgIndex = args.indexOf("--host");
const portArgIndex = args.indexOf("--port");
const host = hostArgIndex >= 0 ? args[hostArgIndex + 1] : "127.0.0.1";
const preferredPort = Number(portArgIndex >= 0 ? args[portArgIndex + 1] : 4786);

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");
const dataDir = path.join(rootDir, "data");
const service = new HeadquartersService(new FileStateStore(dataDir));
const runtimePath = path.join(dataDir, "runtime.json");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk;
      if (buffer.length > 1_000_000) {
        reject(new Error("Payload too large."));
      }
    });
    req.on("end", () => {
      resolve(buffer ? JSON.parse(buffer) : {});
    });
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  const requested = req.url === "/" ? "/index.html" : req.url;
  const safePath = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, safePath);
  if (!filePath.startsWith(publicDir) || !fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": mimeTypes[ext] ?? "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/health") {
      sendJson(res, 200, {
        status: "ok",
        host,
        port: server.address()?.port ?? null,
        url: `http://${host}:${server.address()?.port ?? preferredPort}`,
        phase: service.getState().meta.phase
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/state") {
      sendJson(res, 200, service.getState());
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/missions") {
      const body = await readBody(req);
      sendJson(res, 201, service.createMission(body));
      return;
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/plans/") && url.pathname.endsWith("/approve")) {
      const planId = url.pathname.split("/")[3];
      const body = await readBody(req);
      sendJson(res, 200, service.approvePlan(planId, body.actorRole, body.actorName));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/plans/from-mission") {
      const body = await readBody(req);
      sendJson(res, 201, service.createPlanFromMission(body.missionId, body.ownerAgentId));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/tasks") {
      const body = await readBody(req);
      sendJson(res, 201, service.createTask(body));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/approvals") {
      const body = await readBody(req);
      sendJson(res, 201, service.createApproval(body));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/incidents") {
      const body = await readBody(req);
      sendJson(res, 201, service.createIncident(body));
      return;
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/incidents/") && url.pathname.endsWith("/resolve")) {
      const incidentId = url.pathname.split("/")[3];
      const body = await readBody(req);
      sendJson(res, 200, service.resolveIncident(incidentId, body.actor));
      return;
    }

    if (req.method === "POST" && /^\/api\/incidents\/[^/]+\/actions$/.test(url.pathname)) {
      const incidentId = url.pathname.split("/")[3];
      const body = await readBody(req);
      sendJson(res, 201, service.addIncidentAction(incidentId, body));
      return;
    }

    if (req.method === "POST" && /^\/api\/incidents\/[^/]+\/actions\/[^/]+\/complete$/.test(url.pathname)) {
      const [, , , incidentId, , actionId] = url.pathname.split("/");
      const body = await readBody(req);
      sendJson(res, 200, service.completeIncidentAction(incidentId, actionId, body.actor));
      return;
    }

    if (req.method === "POST" && /^\/api\/incidents\/[^/]+\/actions\/[^/]+\/status$/.test(url.pathname)) {
      const [, , , incidentId, , actionId] = url.pathname.split("/");
      const body = await readBody(req);
      sendJson(res, 200, service.updateIncidentActionStatus(incidentId, actionId, body.status, body.actor));
      return;
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/approvals/") && url.pathname.endsWith("/decision")) {
      const approvalId = url.pathname.split("/")[3];
      const body = await readBody(req);
      sendJson(res, 200, service.decideApproval(approvalId, body.decision, body.actorRole, body.actorName));
      return;
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/agents/") && url.pathname.endsWith("/status")) {
      const agentId = url.pathname.split("/")[3];
      const body = await readBody(req);
      sendJson(res, 200, service.updateAgentStatus(agentId, body.status));
      return;
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/sessions/") && url.pathname.endsWith("/instruction")) {
      const sessionId = url.pathname.split("/")[3];
      const body = await readBody(req);
      sendJson(res, 200, service.sendSessionInstruction(sessionId, body.instruction, body.actor));
      return;
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/sessions/") && url.pathname.endsWith("/response")) {
      const sessionId = url.pathname.split("/")[3];
      const body = await readBody(req);
      sendJson(res, 200, service.recordSessionResponse(sessionId, body.response, body.actor));
      return;
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/sessions/") && url.pathname.endsWith("/status")) {
      const sessionId = url.pathname.split("/")[3];
      const body = await readBody(req);
      sendJson(res, 200, service.updateSessionStatus(sessionId, body.status, body.actor, body.detail));
      return;
    }

    if (req.method === "POST" && /^\/api\/sessions\/[^/]+\/commands$/.test(url.pathname)) {
      const sessionId = url.pathname.split("/")[3];
      const body = await readBody(req);
      sendJson(res, 201, service.dispatchSessionCommand(sessionId, body.command, body.actor));
      return;
    }

    if (req.method === "POST" && /^\/api\/sessions\/[^/]+\/commands\/[^/]+\/complete$/.test(url.pathname)) {
      const [, , , sessionId, , commandId] = url.pathname.split("/");
      const body = await readBody(req);
      sendJson(res, 200, service.completeSessionCommand(sessionId, commandId, body.resultSummary, body.actor));
      return;
    }

    if (req.method === "POST" && /^\/api\/sessions\/[^/]+\/commands\/[^/]+\/execute$/.test(url.pathname)) {
      const [, , , sessionId, , commandId] = url.pathname.split("/");
      const body = await readBody(req);
      sendJson(res, 200, await service.executeSessionCommand(sessionId, commandId, body.actor));
      return;
    }

    if (req.method === "POST" && /^\/api\/sessions\/[^/]+\/commands\/[^/]+\/cancel$/.test(url.pathname)) {
      const [, , , sessionId, , commandId] = url.pathname.split("/");
      const body = await readBody(req);
      sendJson(res, 200, service.cancelSessionCommand(sessionId, commandId, body.actor));
      return;
    }

    if (req.method === "POST" && /^\/api\/sessions\/[^/]+\/commands\/[^/]+\/retry$/.test(url.pathname)) {
      const [, , , sessionId, , commandId] = url.pathname.split("/");
      const body = await readBody(req);
      sendJson(res, 201, service.retrySessionCommand(sessionId, commandId, body.actor));
      return;
    }

    if (req.method === "GET" && !url.pathname.startsWith("/api/")) {
      serveStatic(req, res);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 400, { error: error.message });
  }
});

function writeRuntimeInfo(port) {
  fs.writeFileSync(
    runtimePath,
    JSON.stringify(
      {
        status: "running",
        host,
        port,
        url: `http://${host}:${port}`,
        startedAt: new Date().toISOString()
      },
      null,
      2
    )
  );
}

function listenWithFallback(port, retries = 5) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && retries > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Retrying on ${nextPort}.`);
      listenWithFallback(nextPort, retries - 1);
      return;
    }

    console.error("WiseForgeStudio Headquarters failed to start.");
    console.error(error);
    process.exit(1);
  });

  server.listen(port, host, () => {
    writeRuntimeInfo(port);
    console.log(`WiseForgeStudio Headquarters listening on http://${host}:${port}`);
    console.log(`Health check available at http://${host}:${port}/health`);
  });
}

listenWithFallback(preferredPort);
