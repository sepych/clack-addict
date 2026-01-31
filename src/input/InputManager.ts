import { KeyEvent } from "@opentui/core"
import { ScreenManager } from "../screens/ScreenManager.ts"
import type { CommandMenu } from "../commands/CommandMenu.ts"

export interface InputHandler {
  onKeypress(event: KeyEvent): void
}

/**
 * Central input dispatcher
 * Handles global shortcuts, command menu, and delegates to screen
 */
export class InputManager {
  private commandMenu: CommandMenu | null = null

  constructor(
    private screenManager: ScreenManager,
    private onGlobalExit: () => void
  ) {}

  setCommandMenu(menu: CommandMenu): void {
    this.commandMenu = menu
  }

  /**
   * Handle a keypress event
   * Returns true if the key was handled, false otherwise
   */
  handleKeypress(event: KeyEvent): boolean {
    // Global exit shortcuts
    if (
      event.name === "escape" ||
      (event.ctrl && event.name === "c")
    ) {
      this.onGlobalExit()
      return true
    }

    // Command menu handling
    if (this.commandMenu && this.commandMenu.isActive()) {
      this.commandMenu.onKeypress(event)
      return true
    }

    // Delegate to current screen
    const screen = this.screenManager.getCurrentScreen()
    if (screen) {
      screen.onKeypress(event)
      return true
    }

    return false
  }
}

