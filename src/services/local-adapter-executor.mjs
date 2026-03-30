import { spawn } from "node:child_process";

const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000;

export class LocalAdapterExecutor {
  constructor(providerRegistry, options = {}) {
    this.providerRegistry = providerRegistry;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async execute(session, command) {
    const execution = this.providerRegistry.buildExecutionCommand(session.adapterKey, command.command);
    if (!execution) {
      throw new Error(`Adapter ${session.adapterKey} cannot be executed locally.`);
    }

    return new Promise((resolve, reject) => {
      const child = spawn(execution.file, execution.args, {
        shell: false,
        windowsHide: true,
        cwd: process.cwd(),
        env: process.env
      });

      let stdout = "";
      let stderr = "";
      let settled = false;

      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        child.kill();
        reject(new Error(`Command timed out after ${this.timeoutMs}ms.`));
      }, this.timeoutMs);

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.on("error", (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(error);
      });

      child.on("close", (code, signal) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({
          ok: code === 0,
          code,
          signal,
          stdout: stdout.trim(),
          stderr: stderr.trim()
        });
      });
    });
  }
}
