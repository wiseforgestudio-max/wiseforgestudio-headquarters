const DEFAULT_ADAPTERS = {
  "codex-cli": {
    key: "codex-cli",
    provider: "codex",
    label: "Codex CLI",
    mode: "execution",
    channel: "local-terminal",
    supportsExecution: true,
    supportsReview: true,
    commandTemplate: "codex exec --task \"{command}\"",
    executable: "codex",
    argsBuilder: (command) => ["exec", "--task", command]
  },
  "claude-cli": {
    key: "claude-cli",
    provider: "claude",
    label: "Claude CLI",
    mode: "strategy-review",
    channel: "strategic-review",
    supportsExecution: false,
    supportsReview: true,
    commandTemplate: "claude review \"{command}\"",
    executable: null,
    argsBuilder: null
  },
  "gemini-adapter": {
    key: "gemini-adapter",
    provider: "gemini",
    label: "Gemini Adapter",
    mode: "future",
    channel: "planned",
    supportsExecution: false,
    supportsReview: false,
    commandTemplate: null,
    executable: null,
    argsBuilder: null
  }
};

export class ProviderRegistry {
  constructor(definitions = DEFAULT_ADAPTERS) {
    this.definitions = definitions;
  }

  get(adapterKey) {
    return this.definitions[adapterKey] ?? null;
  }

  getForSession(session) {
    return this.get(session.adapterKey);
  }

  describe(providerRecord, sessions = []) {
    const adapter = this.get(providerRecord.adapterKey);
    const liveSessions = sessions.filter((session) => session.adapterKey === providerRecord.adapterKey);
    const queuedCommands = liveSessions.reduce((count, session) => count + (session.commandQueue ?? []).filter((item) => item.status !== "completed").length, 0);
    return {
      providerId: providerRecord.id,
      provider: providerRecord.name,
      adapterKey: providerRecord.adapterKey,
      adapterLabel: adapter?.label ?? providerRecord.adapterKey,
      mode: adapter?.mode ?? providerRecord.type,
      channel: adapter?.channel ?? "unknown",
      status: providerRecord.status,
      supportsExecution: Boolean(adapter?.supportsExecution),
      supportsReview: Boolean(adapter?.supportsReview),
      commandTemplate: adapter?.commandTemplate ?? "No definido",
      liveSessions: liveSessions.length,
      queuedCommands
    };
  }

  renderCommand(adapterKey, command) {
    const adapter = this.get(adapterKey);
    if (!adapter?.commandTemplate) {
      return null;
    }
    return adapter.commandTemplate.replace("{command}", command.replace(/"/g, '\\"'));
  }

  buildExecutionCommand(adapterKey, command) {
    const adapter = this.get(adapterKey);
    if (!adapter?.supportsExecution || !adapter.executable || typeof adapter.argsBuilder !== "function") {
      return null;
    }

    return {
      file: adapter.executable,
      args: adapter.argsBuilder(command)
    };
  }
}

export function createProviderRegistry() {
  return new ProviderRegistry();
}
