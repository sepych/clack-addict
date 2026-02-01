import { describe, it, expect, beforeEach, spyOn, afterEach } from "bun:test"
import { TypingEngine, CharStatus } from "./TypingEngine"

describe("TypingEngine", () => {
  let engine: TypingEngine
  const text = "Hello World"

  beforeEach(() => {
    engine = new TypingEngine(text)
  })

  afterEach(() => {
    // Bun's spyOn doesn't always need manual restore in afterEach if declared inside describe
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
    const chars = text.split("")
    
    for (const char of chars) {
      engine.processInput(char)
      await new Promise(r => setTimeout(r, 1)) // Ensure non-zero time
    }

    expect(engine.isComplete).toBe(true)
    expect(engine.cursorPosition).toBe(text.length)
    expect(engine.endTime).not.toBeNull()
    expect(engine.wpm).toBeGreaterThan(0)
  })

  it("should not process input after completion", () => {
    text.split("").forEach(char => {
      engine.processInput(char)
    })

    const result = engine.processInput("!")
    expect(result).toBe(false)
    expect(engine.cursorPosition).toBe(11) // "Hello World".length
  })

  it("should calculate recentWpm based on rolling window", () => {
    let now = Date.now()
    spyOn(Date, 'now').mockImplementation(() => now)

    // First 4 characters should return null
    for (let i = 0; i < 4; i++) {
      engine.processInput(text[i]!)
      expect(engine.recentWpm).toBeNull()
      now += 100 // 100ms per char
    }

    // 5th character should return a value
    engine.processInput(text[4]!)
    // 5 characters in 400ms (0.4s = 0.00666 minutes)
    // Formula: (4/5) / (400/60000) = 0.8 / 0.006666 = 120 WPM
    expect(engine.recentWpm).toBe(120)

    // Add more characters to exceed window size (10)
    now += 100
    for (let i = 5; i < 11; i++) {
      engine.processInput(text[i] ?? " ")
      now += 100
    }

    // After 11 characters, it should only use the last 10
    // Last 10 timestamps are separated by 100ms each = 900ms total
    // Chars typed in window = 9
    // WPM: (9/5) / (900/60000) = 1.8 / 0.015 = 120 WPM
    expect(engine.recentWpm).toBe(120)
  })
})
