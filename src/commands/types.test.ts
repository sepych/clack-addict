import { describe, it, expect } from "bun:test"
import { CommandRegistry } from "./types.ts"
import { themeCommand, statsCommand } from "./builtins.ts"

describe("Command System", () => {
  it("should register commands", () => {
    const registry = new CommandRegistry()
    registry.register(themeCommand)
    registry.register(statsCommand)

    expect(registry.getCommand("theme")).toBe(themeCommand)
    expect(registry.getCommand("stats")).toBe(statsCommand)
  })

  it("should support command aliases", () => {
    const registry = new CommandRegistry()
    registry.register(themeCommand)

    expect(registry.getCommand("t")).toBe(themeCommand)
    expect(registry.getCommand("T")).toBe(themeCommand) // Case insensitive
  })

  it("should filter commands by prefix", () => {
    const registry = new CommandRegistry()
    registry.register(themeCommand)
    registry.register(statsCommand)

    const filtered = registry.filterCommands("th")
    expect(filtered.length).toBe(1)
    expect(filtered[0]?.name).toBe("theme")

    const filtered2 = registry.filterCommands("st")
    expect(filtered2.length).toBe(1)
    expect(filtered2[0]?.name).toBe("stats")

    const filtered3 = registry.filterCommands("")
    expect(filtered3.length).toBe(2)
  })

  it("should return unique commands", () => {
    const registry = new CommandRegistry()
    registry.register(themeCommand)

    const allCommands = registry.getAllCommands()
    expect(allCommands.length).toBe(1)
    expect(allCommands[0]?.name).toBe("theme")
  })
})
