import { Box, BoxRenderable, TextRenderable, StyledText, fg, bg } from "@opentui/core"
import type { KeyEvent } from "@opentui/core"
import { AppContext } from "../core/AppContext.ts"
import { CommandRegistry } from "./types.ts"
import type { Command } from "./types.ts"

/**
 * Command menu that appears when user types /
 * Displays autocomplete suggestions in a popup at bottom-left
 */
export class CommandMenu {
  private isOpen: boolean = false
  private commandInput: string = ""
  private selectedIndex: number = 0
  private filteredCommands: Command[] = []

  private inputRenderable: TextRenderable
  private menuRenderable: TextRenderable

  constructor(
    private context: AppContext,
    private registry: CommandRegistry
  ) {
    this.inputRenderable = new TextRenderable(context.renderer, { content: "" })
    this.menuRenderable = new TextRenderable(context.renderer, { content: "" })
  }

  open(): void {
    this.isOpen = true
    this.commandInput = ""
    this.selectedIndex = 0
    this.updateDisplay()
  }

  close(): void {
    this.isOpen = false
    this.commandInput = ""
    this.selectedIndex = 0
    this.updateDisplay()
  }

  isActive(): boolean {
    return this.isOpen
  }

  /**
   * Handle keypress while menu is open
   */
  onKeypress(event: KeyEvent): void {
    if (event.name === "escape") {
      this.close()
      return
    }

    if (event.name === "return" || event.name === "enter") {
      if (this.filteredCommands.length > 0) {
        const selected = this.filteredCommands[this.selectedIndex]
        if (selected) {
          this.executeCommand(selected)
          this.close()
        }
      }
      return
    }

    if (event.name === "up" || event.name === "down") {
      if (event.name === "up") {
        this.selectedIndex = Math.max(0, this.selectedIndex - 1)
      } else {
        this.selectedIndex = Math.min(
          this.filteredCommands.length - 1,
          this.selectedIndex + 1
        )
      }
      this.updateDisplay()
      return
    }

    if (event.name === "backspace") {
      this.commandInput = this.commandInput.slice(0, -1)
      this.selectedIndex = 0
      this.updateDisplay()
      return
    }

    // Handle regular character input
    if (event.sequence && event.sequence.length === 1) {
      this.commandInput += event.sequence
      this.selectedIndex = 0
      this.updateDisplay()
    }
  }

  /**
   * Called when a regular character is typed during game
   * Returns true if '/' was typed (opening menu), false otherwise
   */
  interceptCharacter(char: string): boolean {
    if (char === "/" && !this.isOpen) {
      this.open()
      return true
    }
    return false
  }

  private updateDisplay(): void {
    this.filteredCommands = this.registry.filterCommands(this.commandInput)

    // Update input display
    const theme = this.context.currentTheme
    this.inputRenderable.content = new StyledText([
      fg(theme.fg)(`/${this.commandInput}`)
    ])

    // Update menu display
    if (this.filteredCommands.length === 0) {
      this.menuRenderable.content = new StyledText([
        fg(theme.incorrect)("No commands found")
      ])
    } else {
      const chunks: any[] = []
      for (let i = 0; i < this.filteredCommands.length; i++) {
        const cmd = this.filteredCommands[i]!
        const isSelected = i === this.selectedIndex

        if (i > 0) {
          chunks.push(fg(theme.fg)("\n"))
        }

        if (isSelected) {
          chunks.push(
            bg(theme.cursorBg)(
              fg(theme.bg)(`> ${cmd.name} `)
            )
          )
          chunks.push(fg(theme.fg)(cmd.description))
        } else {
          chunks.push(fg(theme.fg)(`  ${cmd.name} `))
          chunks.push(fg(theme.untyped)(cmd.description))
        }
      }
      this.menuRenderable.content = new StyledText(chunks)
    }

    this.context.renderer.requestRender()
  }

  private executeCommand(command: Command): void {
    command.execute(this.context)
  }

  /**
   * Get the UI container for the command menu
   */
  render(): BoxRenderable {
    const theme = this.context.currentTheme

    return new BoxRenderable(
      this.context.renderer,
      {
        position: "absolute",
        bottom: 0,
        left: 0,
        flexDirection: "column",
        padding: 1,
        backgroundColor: theme.resultBg,
        visible: this.isOpen,
      }
    )
  }

  getInputRenderable(): TextRenderable {
    return this.inputRenderable
  }

  getMenuRenderable(): TextRenderable {
    return this.menuRenderable
  }
}
