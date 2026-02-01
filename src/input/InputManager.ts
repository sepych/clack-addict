import { KeyEvent } from "@opentui/core"
import { ScreenManager } from "../screens/ScreenManager.ts"
import { EscapeMenuScreen } from "../screens/EscapeMenuScreen.ts"
import type { AppContext } from "../core/AppContext.ts"

export interface InputHandler {
  onKeypress(event: KeyEvent): void
}

/**
 * Central input dispatcher
 * Handles global shortcuts and delegates to screen
 */
export class InputManager {
  constructor(
    private screenManager: ScreenManager,
    private context: AppContext,
    private onGlobalExit: () => void
  ) {}

  /**
    * Handle a keypress event
    * Returns true if the key was handled, false otherwise
    */
  handleKeypress(event: KeyEvent): boolean {
    // Escape key pushes menu screen (only on root screen)
    if (event.name === "escape") {
      if (this.screenManager.getStackSize() === 1) {
        this.screenManager.push(new EscapeMenuScreen(this.context))
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

