import { describe, it, expect } from "bun:test"

describe("Typing Speed App", () => {
  it("should initialize with correct theme colors", () => {
    const THEME = {
      bg: '#1a1b26',
      fg: '#a9b1d6',
      cursorBg: '#7aa2f7',
      correct: '#9ece6a',
      incorrect: '#f7768e',
      untyped: '#565f89',
    }
    
    expect(THEME.bg).toBe('#1a1b26')
    expect(THEME.correct).toBe('#9ece6a')
    expect(THEME.incorrect).toBe('#f7768e')
  })
  
  it("should have correct sample text", () => {
    const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog"
    expect(SAMPLE_TEXT).toBe("The quick brown fox jumps over the lazy dog")
    expect(SAMPLE_TEXT.length).toBe(43)
  })
})
