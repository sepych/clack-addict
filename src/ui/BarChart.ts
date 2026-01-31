import { StyledText, fg } from "@opentui/core"
import type { Theme } from "../core/AppContext.ts"

/**
 * Simple ASCII bar chart for displaying stats
 */
export class BarChart {
  /**
   * Render a horizontal bar chart
   * @param data Array of { label, value, max }
   * @param theme Theme to use for colors
   * @param barWidth Width of the bar in characters
   */
  static renderHorizontal(
    data: Array<{ label: string; value: number; max: number }>,
    theme: Theme,
    barWidth: number = 30
  ): StyledText {
    const chunks: any[] = []

    for (let i = 0; i < data.length; i++) {
      const item = data[i]!
      if (i > 0) {
        chunks.push(fg(theme.fg)("\n"))
      }

      // Label (left-aligned, fixed width)
      const labelWidth = 12
      const label = item.label.padEnd(labelWidth)
      chunks.push(fg(theme.fg)(label))

      // Bar
      const filledWidth = Math.round((item.value / item.max) * barWidth)
      const emptyWidth = barWidth - filledWidth

      if (filledWidth > 0) {
        chunks.push(fg(theme.correct)("█".repeat(filledWidth)))
      }
      if (emptyWidth > 0) {
        chunks.push(fg(theme.untyped)("░".repeat(emptyWidth)))
      }

      // Value (right-aligned)
      chunks.push(fg(theme.fg)(` ${Math.round(item.value)}`))
    }

    return new StyledText(chunks)
  }

  /**
   * Render a simple text list of stats
   */
  static renderList(
    data: Array<{ label: string; value: string | number }>,
    theme: Theme
  ): StyledText {
    const chunks: any[] = []

    for (let i = 0; i < data.length; i++) {
      const item = data[i]!
      if (i > 0) {
        chunks.push(fg(theme.fg)("\n"))
      }

      chunks.push(fg(theme.fg)(item.label.padEnd(15)))
      chunks.push(fg(theme.correct)(String(item.value)))
    }

    return new StyledText(chunks)
  }
}
