import type { Screen } from "./Screen.ts"

/**
 * Manages screen navigation using a stack-based system
 * Only the top screen receives input and renders
 */
export class ScreenManager {
  private stack: Screen[] = []

  /**
   * Push a new screen onto the stack
   */
  push(screen: Screen): void {
    const current = this.getCurrentScreen()
    if (current) {
      current.onExit()
    }

    this.stack.push(screen)
    screen.onEnter()
  }

  /**
   * Pop the current screen and return to the previous one
   */
  pop(): Screen | null {
    const current = this.stack.pop()
    if (current) {
      current.onExit()
    }

    const previous = this.getCurrentScreen()
    if (previous) {
      previous.onEnter()
    }

    return current ?? null
  }

  /**
   * Replace the current screen with a new one
   */
  replace(screen: Screen): void {
    const current = this.stack.pop()
    if (current) {
      current.onExit()
    }

    this.stack.push(screen)
    screen.onEnter()
  }

  /**
   * Get the currently active screen
   */
  getCurrentScreen(): Screen | null {
    return this.stack[this.stack.length - 1] ?? null
  }

  /**
   * Get the size of the stack
   */
  getStackSize(): number {
    return this.stack.length
  }
}
