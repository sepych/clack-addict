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
    expect(engine.startTime).toBeNull()
    expect(engine.endTime).toBeNull()
  })

  it("should start timer on first input", () => {
    engine.processInput("H")
    expect(engine.startTime).not.toBeNull()
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

  it("should calculate accuracy", () => {
    engine.processInput("H") // Correct
    engine.processInput("x") // Incorrect ('e')
    engine.processInput("l") // Correct
    engine.processInput("l") // Correct
    
    // 3 correct, 1 incorrect, total 4 typed
    // Accuracy: (3/4) * 100 = 75%
    expect(engine.accuracy).toBe(75)
  })

  it("should track streak correctly", () => {
    expect(engine.currentStreak).toBe(0)

    engine.processInput("H") // Correct
    expect(engine.currentStreak).toBe(1)

    engine.processInput("e") // Correct
    expect(engine.currentStreak).toBe(2)

    engine.processInput("x") // Incorrect
    expect(engine.currentStreak).toBe(0)

    engine.processInput("l") // Correct
    expect(engine.currentStreak).toBe(1)
  })

  it("should complete the text and stop timer", async () => {
    const chars = "Hello".split("")
    
    for (const char of chars) {
      engine.processInput(char)
      await new Promise(r => setTimeout(r, 1)) // Ensure non-zero time
    }

    expect(engine.isComplete).toBe(true)
    expect(engine.cursorPosition).toBe(5)
    expect(engine.endTime).not.toBeNull()
    expect(engine.wpm).toBeGreaterThan(0)
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
