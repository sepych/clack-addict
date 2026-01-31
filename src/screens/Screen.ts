import { BoxRenderable, KeyEvent } from "@opentui/core"
import { AppContext } from "../core/AppContext.ts"

/**
 * Base interface for all screens
 * Screens represent different views in the application
 */
export interface Screen {
  readonly name: string

  /**
   * Called when screen becomes active
   */
  onEnter(): void

  /**
   * Called when screen is about to be deactivated
   */
  onExit(): void

  /**
   * Handle keyboard input
   */
  onKeypress(event: KeyEvent): void

  /**
   * Render the screen's UI
   */
  render(): BoxRenderable
}

/**
 * Base class for screens with common functionality
 */
export abstract class BaseScreen implements Screen {
  abstract readonly name: string

  constructor(protected context: AppContext) {}

  onEnter(): void {
    // Override in subclasses
  }

  onExit(): void {
    // Override in subclasses
  }

  abstract onKeypress(event: KeyEvent): void

  abstract render(): BoxRenderable
}
