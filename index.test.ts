import { describe, it, expect } from "bun:test"
import { THEME } from "./src/config/theme"
import { TEXT_SAMPLES, getRandomSample } from "./src/config/text"

describe("App Configuration", () => {
  it("should have correct theme colors", () => {
    expect(THEME.bg).toBe('#1a1b26')
    expect(THEME.correct).toBe('#9ece6a')
    expect(THEME.incorrect).toBe('#f7768e')
  })
  
  it("should have text samples", () => {
    expect(TEXT_SAMPLES.length).toBeGreaterThan(0)
    expect(TEXT_SAMPLES).toContain("the quick brown fox jumps over the lazy dog")
  })

  it("should return a random sample", () => {
    const sample = getRandomSample()
    expect(TEXT_SAMPLES).toContain(sample)
    expect(typeof sample).toBe("string")
  })
})
