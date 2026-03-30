import fs from "node:fs";
import path from "node:path";
import { buildSeedState } from "../domain/seed-state.mjs";

export class FileStateStore {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.statePath = path.join(baseDir, "headquarters-state.json");
    this.auditLogPath = path.join(baseDir, "audit-log.ndjson");
    this.artifactsDir = path.join(baseDir, "artifacts");
    this.commandArtifactsDir = path.join(this.artifactsDir, "commands");
    fs.mkdirSync(baseDir, { recursive: true });
    fs.mkdirSync(this.commandArtifactsDir, { recursive: true });
    this.ensureInitialized();
  }

  ensureInitialized() {
    if (!fs.existsSync(this.statePath)) {
      const initialState = buildSeedState();
      fs.writeFileSync(this.statePath, JSON.stringify(initialState, null, 2));
      for (const event of initialState.auditTrail) {
        this.appendAudit(event);
      }
    }
  }

  read() {
    return JSON.parse(fs.readFileSync(this.statePath, "utf8"));
  }

  write(state) {
    fs.writeFileSync(this.statePath, JSON.stringify(state, null, 2));
  }

  appendAudit(event) {
    fs.appendFileSync(this.auditLogPath, `${JSON.stringify(event)}\n`);
  }

  writeCommandArtifact(commandId, payload) {
    const dir = path.join(this.commandArtifactsDir, commandId);
    fs.mkdirSync(dir, { recursive: true });
    const metadataPath = path.join(dir, "metadata.json");
    const stdoutPath = path.join(dir, "stdout.log");
    const stderrPath = path.join(dir, "stderr.log");

    fs.writeFileSync(metadataPath, JSON.stringify(payload.metadata, null, 2));
    fs.writeFileSync(stdoutPath, payload.stdout ?? "");
    fs.writeFileSync(stderrPath, payload.stderr ?? "");

    return {
      metadataPath: path.relative(this.baseDir, metadataPath),
      stdoutPath: path.relative(this.baseDir, stdoutPath),
      stderrPath: path.relative(this.baseDir, stderrPath)
    };
  }

  snapshot() {
    const state = this.read();
    return structuredClone(state);
  }
}
