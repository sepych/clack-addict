import { bg, fg, StyledText } from "@opentui/core"
import { TypingEngine, CharStatus } from "../core/TypingEngine"
import { THEME } from "../config/theme"

export function renderGameText(engine: TypingEngine): StyledText {
  const chunks: any[] = []
  const text = engine.text

  for (let i = 0; i < text.length; i++) {
    const char = text[i]!
    const status = engine.getCharStatus(i)
    
    // Highlight cursor position
    if (i === engine.cursorPosition) {
      chunks.push(bg(THEME.cursorBg)(fg(THEME.bg)(char)))
      continue
    }

    // Color based on status
    switch (status) {
      case CharStatus.Correct:
        chunks.push(fg(THEME.correct)(char))
        break
      case CharStatus.Incorrect:
        chunks.push(fg(THEME.incorrect)(char))
        break
      case CharStatus.Untyped:
      default:
        chunks.push(fg(THEME.untyped)(char))
        break
    }
  }

  return new StyledText(chunks)
}
