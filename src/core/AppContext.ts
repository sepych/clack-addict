import { CliRenderer } from "@opentui/core"
import { TypingStatsDatabase } from "../db/Database.ts"
import type { ScreenManager } from "../screens/ScreenManager.ts"

export interface Theme {
  name: string
  bg: string
  fg: string
  resultBg: string
  cursorBg: string
  correct: string
  incorrect: string
  untyped: string
  streak: {
    lvl1: string
    lvl2: string
    lvl3: string
    lvl4: string
    lvl5: string
    lvl6: string
    lvl7: string
  }
}

/**
 * Shared application context
 * Provides access to renderer, database, theme, and screen manager
 */
export class AppContext {
  private screenManager: ScreenManager | null = null

  constructor(
    readonly renderer: CliRenderer,
    readonly db: TypingStatsDatabase,
    private _currentTheme: Theme
  ) {}

  get currentTheme(): Theme {
    return this._currentTheme
  }

  setTheme(theme: Theme): void {
    this._currentTheme = theme
  }

  setScreenManager(manager: ScreenManager): void {
    this.screenManager = manager
  }

  getScreenManager(): ScreenManager | null {
    return this.screenManager
  }
}
