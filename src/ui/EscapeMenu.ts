import { Box, BoxRenderable, TextRenderable, StyledText, fg, bg } from "@opentui/core"
import type { KeyEvent } from "@opentui/core"
import type { AppContext } from "../core/AppContext.ts"

export type EscapeMenuOption = "theme" | "stats" | "quit"

export interface EscapeMenuHandler {
  onMenuSelect(option: EscapeMenuOption): void
}

/**
 * Escape menu overlay - appears when user presses Escape
 * Allows navigation to Theme, Stats, or Quit
 */
export class EscapeMenu {
  private isActive: boolean = false
  private selectedIndex: number = 0
  private readonly options: Array<{ label: string; value: EscapeMenuOption }> = [
    { label: "Theme", value: "theme" },
    { label: "Stats", value: "stats" },
    { label: "Quit", value: "quit" },
  ]
  private handler: EscapeMenuHandler | null = null
  private menuRenderable: BoxRenderable
  private contentRenderable: TextRenderable

  constructor(private context: AppContext) {
    this.contentRenderable = new TextRenderable(context.renderer, {
      content: this.renderMenuContent()
    })

    this.menuRenderable = new BoxRenderable(context.renderer, {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      backgroundColor: context.currentTheme.bg,
      visible: false,
    })

    // Add border-like effect with padding
    this.menuRenderable.add(
      Box(
        {
          flexDirection: "column",
          alignItems: "center",
          borderStyle: "rounded",
          padding: 1,
          backgroundColor: context.currentTheme.bg,
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
  }

  setHandler(handler: EscapeMenuHandler): void {
    this.handler = handler
  }

  isMenuActive(): boolean {
    return this.isActive
  }

  open(): void {
    this.isActive = true
    this.selectedIndex = 0
    this.menuRenderable.visible = true
    this.updateDisplay()
    this.context.renderer.requestRender()
  }

  close(): void {
    this.isActive = false
    this.menuRenderable.visible = false
    this.context.renderer.requestRender()
  }

  onKeypress(event: KeyEvent): void {
    if (!this.isActive) return

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
        this.close()
        break

      default:
        break
    }
  }

  private selectOption(): void {
    const selected = this.options[this.selectedIndex]
    if (selected !== undefined && this.handler) {
      this.handler.onMenuSelect(selected.value)
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

  getRenderable(): BoxRenderable {
    return this.menuRenderable
  }
}
