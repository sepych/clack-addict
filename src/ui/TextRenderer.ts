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
      let cursorColor = THEME.cursorBg
      const streak = engine.currentStreak
      const wpm = engine.wpm

      if (streak > 60 && wpm > 100) cursorColor = THEME.streak.lvl7
      else if (streak > 45 && wpm > 80) cursorColor = THEME.streak.lvl6
      else if (streak > 30 && wpm > 60) cursorColor = THEME.streak.lvl5
      else if (streak > 18 && wpm > 45) cursorColor = THEME.streak.lvl4
      else if (streak > 10 && wpm > 30) cursorColor = THEME.streak.lvl3
      else if (streak > 5 && wpm > 15) cursorColor = THEME.streak.lvl2
      else if (streak > 2 && wpm > 5) cursorColor = THEME.streak.lvl1

      chunks.push(bg(cursorColor)(fg(THEME.bg)(char)))
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
