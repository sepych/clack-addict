import type { AppContext } from "../core/AppContext.ts"

export interface Command {
  name: string
  description: string
  aliases?: string[]
  execute(context: AppContext): void
}

/**
 * Registry for all available commands
 */
export class CommandRegistry {
  private commands: Map<string, Command> = new Map()

  register(command: Command): void {
    this.commands.set(command.name.toLowerCase(), command)
    if (command.aliases) {
      for (const alias of command.aliases) {
        this.commands.set(alias.toLowerCase(), command)
      }
    }
  }

  getCommand(name: string): Command | null {
    return this.commands.get(name.toLowerCase()) ?? null
  }

  getAllCommands(): Command[] {
    const unique = new Map<string, Command>()
    for (const [, cmd] of this.commands) {
      if (!unique.has(cmd.name)) {
        unique.set(cmd.name, cmd)
      }
    }
    return Array.from(unique.values())
  }

  /**
   * Filter commands by what the user has typed
   * e.g., "th" returns ["theme"]
   */
  filterCommands(input: string): Command[] {
    const lowerInput = input.toLowerCase()
    const unique = new Map<string, Command>()

    for (const cmd of this.getAllCommands()) {
      if (cmd.name.toLowerCase().startsWith(lowerInput)) {
        unique.set(cmd.name, cmd)
      }
    }

    return Array.from(unique.values())
  }
}
