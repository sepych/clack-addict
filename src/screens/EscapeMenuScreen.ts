import { Box, BoxRenderable, TextRenderable, StyledText, fg, bg } from "@opentui/core"
import type { KeyEvent } from "@opentui/core"
import { BaseScreen } from "./Screen.ts"
import { AppContext } from "../core/AppContext.ts"
import { TypingScreen } from "./TypingScreen.ts"
import { ThemeScreen } from "./ThemeScreen.ts"
import { StatsScreen } from "./StatsScreen.ts"

type MenuOption = "theme" | "stats" | "quit"

interface MenuItemConfig {
  label: string
  value: MenuOption
}

/**
 * Pause menu screen - appears when user presses Escape on main game
 * Allows navigation to Theme, Stats, or Quit
 */
export class EscapeMenuScreen extends BaseScreen {
  readonly name = "EscapeMenu"

  private selectedIndex: number = 0
  private readonly options: MenuItemConfig[] = [
    { label: "Theme", value: "theme" },
    { label: "Stats", value: "stats" },
    { label: "Quit", value: "quit" },
  ]
  private contentRenderable: TextRenderable

  constructor(context: AppContext) {
    super(context)
    this.contentRenderable = new TextRenderable(context.renderer, {
      content: this.renderMenuContent(),
    })
  }

  onKeypress(event: KeyEvent): void {
    switch (event.name) {
      case "up":
      case "w":
        this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length
        this.updateDisplay()
        break

      case "down":
      case "s":
        this.selectedIndex = (this.selectedIndex + 1) % this.options.length
        this.updateDisplay()
        break

      case "return":
      case "enter":
        this.selectOption()
        break

      case "escape":
        // Return to previous screen (game)
        const screenManager = this.context.getScreenManager()
        if (screenManager) {
          screenManager.pop()
        }
        break

      default:
        break
    }
  }

  render(): BoxRenderable {
    const theme = this.context.currentTheme

    // Outer container - full screen, centered
    const container = new BoxRenderable(this.context.renderer, {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      backgroundColor: theme.bg,
    })

    // Inner box with border
    container.add(
      Box(
        {
          flexDirection: "column",
          alignItems: "center",
          borderStyle: "rounded",
          padding: 1,
          backgroundColor: theme.bg,
        },
        Box(
          {
            padding: 1,
            flexDirection: "column",
            alignItems: "center",
          },
          this.contentRenderable
        )
      )
    )

    return container
  }

  private selectOption(): void {
    const selected = this.options[this.selectedIndex]
    if (selected === undefined) return

    const screenManager = this.context.getScreenManager()
    if (!screenManager) return

    switch (selected.value) {
      case "theme":
        screenManager.push(new ThemeScreen(this.context))
        break

      case "stats":
        screenManager.push(new StatsScreen(this.context))
        break

      case "quit":
        process.exit(0)
        break
    }
  }

  private updateDisplay(): void {
    this.contentRenderable.content = this.renderMenuContent()
    this.context.renderer.requestRender()
  }

  private renderMenuContent(): StyledText {
    const theme = this.context.currentTheme
    const lines: string[] = ["", "  PAUSED", ""]

    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i]
      if (option === undefined) continue
      const isSelected = i === this.selectedIndex
      const prefix = isSelected ? ">" : " "
      const line = `  ${prefix} ${option.label}`
      lines.push(line)
    }

    lines.push("")
    lines.push("  ESC: Resume")
    lines.push("")

    const styledLines = lines.map((line) => {
      if (line.startsWith("  >") || line.startsWith("   ")) {
        // Selected or regular option
        if (line.startsWith("  >")) {
          return fg(theme.correct)(bg(theme.resultBg)(line))
        }
        return fg(theme.fg)(line)
      }
      // Headers/instructions
      return fg(theme.untyped)(line)
    })

    return new StyledText(styledLines)
  }
}
