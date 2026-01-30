import { describe, it, expect } from "bun:test"
import { THEME } from "./src/config/theme"
import { SAMPLE_TEXT } from "./src/config/text"

describe("App Configuration", () => {
  it("should have correct theme colors", () => {
    expect(THEME.bg).toBe('#1a1b26')
    expect(THEME.correct).toBe('#9ece6a')
    expect(THEME.incorrect).toBe('#f7768e')
  })
  
  it("should have correct sample text", () => {
    expect(SAMPLE_TEXT).toBe("The quick brown fox jumps over the lazy dog")
    expect(SAMPLE_TEXT.length).toBe(43)
  })
})
