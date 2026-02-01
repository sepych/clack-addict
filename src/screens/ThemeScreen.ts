import { Box, BoxRenderable, TextRenderable, StyledText, fg, bg } from "@opentui/core"
import type { KeyEvent, TextChunk } from "@opentui/core"
import { BaseScreen } from "./Screen.ts"
import { AppContext, type Theme } from "../core/AppContext.ts"
import { ALL_THEMES } from "../config/themes.ts"

/**
 * Theme selection screen
 */
export class ThemeScreen extends BaseScreen {
  readonly name = 'Theme'

  private selectedIndex = 0
  private themes: Theme[] = []
  private titleRenderable: TextRenderable
  private listRenderable: TextRenderable
  private previewRenderable: TextRenderable
  private helpRenderable: TextRenderable

  constructor(context: AppContext) {
    super(context)
    this.themes = Object.values(ALL_THEMES)

    this.titleRenderable = new TextRenderable(context.renderer, { content: "" })
    this.listRenderable = new TextRenderable(context.renderer, { content: "" })
    this.previewRenderable = new TextRenderable(context.renderer, { content: "" })
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

    if (event.name === "up") {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1)
      this.updateDisplay()
      return
    }

    if (event.name === "down") {
      this.selectedIndex = Math.min(this.themes.length - 1, this.selectedIndex + 1)
      this.updateDisplay()
      return
    }

    if (event.name === "return" || event.name === "enter") {
      const selected = this.themes[this.selectedIndex]
      if (selected !== undefined) {
        this.context.setTheme(selected)
        // Return to previous screen after selecting
        const screenManager = this.context.getScreenManager()
        if (screenManager) {
          screenManager.pop()
        }
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
        alignItems: "center",
        flexDirection: "column",
        padding: 2,
      }
    )

    container.add(this.titleRenderable)
    container.add(Box({ height: 1 }))
    container.add(this.listRenderable)
    container.add(Box({ height: 1 }))
    container.add(this.previewRenderable)
    container.add(Box({ height: 1 }))
    container.add(this.helpRenderable)

    return container
  }

  private updateDisplay(): void {
    const theme = this.context.currentTheme
    const selectedTheme = this.themes[this.selectedIndex]

    // Title
    this.titleRenderable.content = new StyledText([
      fg(theme.fg)("Choose Theme")
    ])

    // Theme list
    const chunks: TextChunk[] = []
    for (let i = 0; i < this.themes.length; i++) {
      const t = this.themes[i]
      if (t === undefined) continue
      const isSelected = i === this.selectedIndex

      if (i > 0) {
        chunks.push(fg(theme.fg)("\n"))
      }

      if (isSelected) {
        chunks.push(
          bg(theme.cursorBg)(
            fg(theme.bg)(`> ${t.name} `)
          )
        )
      } else {
        chunks.push(fg(theme.fg)(`  ${t.name}`))
      }
    }
    this.listRenderable.content = new StyledText(chunks)

    // Preview with selected theme
    if (selectedTheme) {
      this.previewRenderable.content = new StyledText([
        fg(selectedTheme.correct)("correct"),
        fg(selectedTheme.fg)(" "),
        fg(selectedTheme.incorrect)("incorrect"),
        fg(selectedTheme.fg)(" "),
        fg(selectedTheme.untyped)("untyped"),
        fg(selectedTheme.fg)(" "),
        bg(selectedTheme.cursorBg)(fg(selectedTheme.bg)("C")),
      ])
    }

    // Help text
    this.helpRenderable.content = new StyledText([
      fg(theme.untyped)("↑↓ Navigate   Enter Apply   Esc Back")
    ])

    this.context.renderer.requestRender()
  }

  getTitleRenderable(): TextRenderable {
    return this.titleRenderable
  }

  getListRenderable(): TextRenderable {
    return this.listRenderable
  }

  getPreviewRenderable(): TextRenderable {
    return this.previewRenderable
  }

  getHelpRenderable(): TextRenderable {
    return this.helpRenderable
  }
}
