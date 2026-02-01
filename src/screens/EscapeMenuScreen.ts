import { Box, BoxRenderable, TextRenderable, StyledText, fg, bg } from "@opentui/core"
import type { KeyEvent, TextChunk } from "@opentui/core"
import { BaseScreen } from "./Screen.ts"
import { AppContext } from "../core/AppContext.ts"
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

  private selectedIndex = 0
  private readonly options: MenuItemConfig[] = [
    { label: "Theme", value: "theme" },
    { label: "Stats", value: "stats" },
    { label: "Quit", value: "quit" },
  ]
  private titleRenderable: TextRenderable
  private contentRenderable: TextRenderable
  private helpRenderable: TextRenderable

  constructor(context: AppContext) {
    super(context)
    this.titleRenderable = new TextRenderable(context.renderer, { content: "" })
    this.contentRenderable = new TextRenderable(context.renderer, { content: "" })
    this.helpRenderable = new TextRenderable(context.renderer, { content: "" })
    this.updateDisplay()
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

      case "escape": {
        // Return to previous screen (game)
        const screenManager = this.context.getScreenManager()
        if (screenManager) {
          screenManager.pop()
        }
        break
      }

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
      padding: 2,
    })

    container.add(this.titleRenderable)
    container.add(Box({ height: 1 }))
    container.add(this.contentRenderable)
    container.add(Box({ height: 1 }))
    container.add(this.helpRenderable)

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
         if (this.context.onQuit) {
           this.context.onQuit()
         } else {
           process.exit(0)
         }
    }
  }

  private updateDisplay(): void {
    const theme = this.context.currentTheme
    
    // Title
    this.titleRenderable.content = new StyledText([
      fg(theme.fg)("Paused")
    ])

    // Menu content
    const chunks: TextChunk[] = []
    const maxLabelLength = Math.max(...this.options.map(o => o.label.length))

    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i]
      if (option === undefined) continue
      const isSelected = i === this.selectedIndex
      
      if (i > 0) {
        chunks.push(fg(theme.fg)("\n"))
      }

      const paddedLabel = option.label.padEnd(maxLabelLength)
      if (isSelected) {
        chunks.push(bg(theme.cursorBg)(fg(theme.bg)(` > ${paddedLabel} `)))
      } else {
        chunks.push(fg(theme.fg)(`   ${paddedLabel} `))
      }
    }
    this.contentRenderable.content = new StyledText(chunks)

    // Help text
    this.helpRenderable.content = new StyledText([
      fg(theme.untyped)("↑↓ Navigate   Enter Select   Esc Back")
    ])

    this.context.renderer.requestRender()
  }
}
