import { ThemeScreen } from "../screens/ThemeScreen.ts"
import { StatsScreen } from "../screens/StatsScreen.ts"
import type { Command } from "./types.ts"
import type { AppContext } from "../core/AppContext.ts"

/**
 * /theme command - opens theme selector
 */
export const themeCommand: Command = {
  name: "theme",
  description: "Change color theme",
  aliases: ["t"],
  execute(context: AppContext) {
    const screenManager = context.getScreenManager()
    if (screenManager) {
      const themeScreen = new ThemeScreen(context)
      screenManager.push(themeScreen)
    }
  },
}

/**
 * /stats command - opens stats viewer
 */
export const statsCommand: Command = {
  name: "stats",
  description: "View typing statistics",
  aliases: ["s"],
  execute(context: AppContext) {
    const screenManager = context.getScreenManager()
    if (screenManager) {
      const statsScreen = new StatsScreen(context)
      screenManager.push(statsScreen)
    }
  },
}
