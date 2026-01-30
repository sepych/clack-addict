import { describe, it, expect, beforeEach } from "bun:test"
import { TypingEngine, CharStatus } from "./TypingEngine"

describe("TypingEngine", () => {
  let engine: TypingEngine
  const text = "Hello"

  beforeEach(() => {
    engine = new TypingEngine(text)
  })

  it("should initialize correctly", () => {
    expect(engine.text).toBe(text)
    expect(engine.cursorPosition).toBe(0)
    expect(engine.isComplete).toBe(false)
  })

  it("should process correct input", () => {
    const result = engine.processInput("H")
    expect(result).toBe(true)
    expect(engine.cursorPosition).toBe(1)
    expect(engine.getCharStatus(0)).toBe(CharStatus.Correct)
  })

  it("should process incorrect input", () => {
    const result = engine.processInput("x")
    expect(result).toBe(true)
    expect(engine.cursorPosition).toBe(1)
    expect(engine.getCharStatus(0)).toBe(CharStatus.Incorrect)
  })

  it("should complete the text", () => {
    "Hello".split("").forEach(char => {
      engine.processInput(char)
    })

    expect(engine.isComplete).toBe(true)
    expect(engine.cursorPosition).toBe(5)
  })

  it("should not process input after completion", () => {
    "Hello".split("").forEach(char => {
      engine.processInput(char)
    })

    const result = engine.processInput("!")
    expect(result).toBe(false)
    expect(engine.cursorPosition).toBe(5)
  })
})
