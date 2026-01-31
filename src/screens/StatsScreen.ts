import { Box, BoxRenderable, TextRenderable, StyledText, fg } from "@opentui/core"
import type { KeyEvent } from "@opentui/core"
import { BaseScreen } from "./Screen.ts"
import { AppContext } from "../core/AppContext.ts"
import { BarChart } from "../ui/BarChart.ts"

/**
 * Statistics display screen
 */
export class StatsScreen extends BaseScreen {
  readonly name = 'Stats'

  private titleRenderable: TextRenderable
  private personalBestRenderable: TextRenderable
  private dailyStatsRenderable: TextRenderable
  private helpRenderable: TextRenderable

  constructor(context: AppContext) {
    super(context)

    this.titleRenderable = new TextRenderable(context.renderer, { content: "" })
    this.personalBestRenderable = new TextRenderable(context.renderer, { content: "" })
    this.dailyStatsRenderable = new TextRenderable(context.renderer, { content: "" })
    this.helpRenderable = new TextRenderable(context.renderer, { content: "" })

    this.updateDisplay()
  }

  onKeypress(event: KeyEvent): void {
    if (event.name === "escape") {
      // Return to previous screen
      const screenManager = this.context.getScreenManager()
      if (screenManager) {
        screenManager.pop()
      }
      return
    }
  }

  render(): BoxRenderable {
    const theme = this.context.currentTheme

    const container = new BoxRenderable(
      this.context.renderer,
      {
        width: "100%",
        height: "100%",
        backgroundColor: theme.bg,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",
        padding: 2,
        overflow: "hidden",
      }
    )

    container.add(this.titleRenderable)
    container.add(Box({ height: 1 }))
    container.add(this.personalBestRenderable)
    container.add(Box({ height: 1 }))
    container.add(this.dailyStatsRenderable)
    container.add(Box({ height: 1 }))
    container.add(this.helpRenderable)

    return container
  }

  private updateDisplay(): void {
    const theme = this.context.currentTheme

    // Title
    this.titleRenderable.content = new StyledText([
      fg(theme.fg)("Typing Statistics")
    ])

    // Personal bests
    const bestWpm = this.context.db.getPersonalBestWpm()
    const bestAcc = this.context.db.getPersonalBestAccuracy()

    const pbChunks: any[] = [
      fg(theme.fg)("Personal Bests\n"),
      fg(theme.untyped)("──────────────\n"),
    ]
    pbChunks.push(fg(theme.fg)("WPM:      "))
    pbChunks.push(fg(theme.correct)(String(bestWpm)))
    pbChunks.push(fg(theme.fg)("\nAccuracy: "))
    pbChunks.push(fg(theme.correct)(`${bestAcc}%`))

    this.personalBestRenderable.content = new StyledText(pbChunks)

    // Daily stats
    const dailyData = this.context.db.getDailyAverages(7)

    if (dailyData.length === 0) {
      this.dailyStatsRenderable.content = new StyledText([
        fg(theme.untyped)("No data yet")
      ])
    } else {
      const chartData = dailyData.map(d => ({
        label: d.date,
        value: d.avgWpm,
        max: Math.max(...dailyData.map(x => x.avgWpm), 100),
      }))

      const title = new StyledText([
        fg(theme.fg)("Last 7 Days\n"),
        fg(theme.untyped)("────────────\n"),
      ])

      const chart = BarChart.renderHorizontal(chartData, theme, 25)

      // Combine title and chart - since we can't directly combine StyledText objects,
      // we need to recreate this
      const chunks: any[] = [
        ...title.chunks,
        ...chart.chunks,
      ]

      this.dailyStatsRenderable.content = new StyledText(chunks)
    }

    // Help text
    this.helpRenderable.content = new StyledText([
      fg(theme.untyped)("Esc Back")
    ])

    this.context.renderer.requestRender()
  }

  getTitleRenderable(): TextRenderable {
    return this.titleRenderable
  }

  getPersonalBestRenderable(): TextRenderable {
    return this.personalBestRenderable
  }

  getDailyStatsRenderable(): TextRenderable {
    return this.dailyStatsRenderable
  }

  getHelpRenderable(): TextRenderable {
    return this.helpRenderable
  }
}
