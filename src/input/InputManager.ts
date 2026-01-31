import { KeyEvent } from "@opentui/core"
import { ScreenManager } from "../screens/ScreenManager.ts"
import type { EscapeMenu } from "../ui/EscapeMenu.ts"

export interface InputHandler {
  onKeypress(event: KeyEvent): void
}

/**
 * Central input dispatcher
 * Handles global shortcuts, escape menu, and delegates to screen
 */
export class InputManager {
  private escapeMenu: EscapeMenu | null = null

  constructor(
    private screenManager: ScreenManager,
    private onGlobalExit: () => void
  ) {}

  setEscapeMenu(menu: EscapeMenu): void {
    this.escapeMenu = menu
  }

  /**
    * Handle a keypress event
    * Returns true if the key was handled, false otherwise
    */
  handleKeypress(event: KeyEvent): boolean {
    // Escape menu handling (takes priority)
    if (this.escapeMenu && this.escapeMenu.isMenuActive()) {
      this.escapeMenu.onKeypress(event)
      return true
    }

    // Escape key opens menu
    if (event.name === "escape") {
      if (this.escapeMenu) {
        this.escapeMenu.open()
        return true
      }
    }

    // Ctrl+C still exits immediately
    if (event.ctrl && event.name === "c") {
      this.onGlobalExit()
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

