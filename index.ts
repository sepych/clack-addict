import { createCliRenderer, Box } from "@opentui/core"
import { THEME } from "./src/config/theme.ts"
import { TypingStatsDatabase } from "./src/db/Database.ts"
import { AppContext } from "./src/core/AppContext.ts"
import { ScreenManager } from "./src/screens/ScreenManager.ts"
import { TypingScreen } from "./src/screens/TypingScreen.ts"
import { ThemeScreen } from "./src/screens/ThemeScreen.ts"
import { StatsScreen } from "./src/screens/StatsScreen.ts"
import { InputManager } from "./src/input/InputManager.ts"
import { EscapeMenu } from "./src/ui/EscapeMenu.ts"

const renderer = await createCliRenderer()
const db = new TypingStatsDatabase()
const context = new AppContext(renderer, db, THEME)

const screenManager = new ScreenManager()
context.setScreenManager(screenManager)

const inputManager = new InputManager(screenManager, () => {
  renderer.destroy()
  process.exit(0)
})

// Create and push initial screen
const typingScreen = new TypingScreen(context)
screenManager.push(typingScreen)

// Create escape menu
const escapeMenu = new EscapeMenu(context)
escapeMenu.setHandler({
  onMenuSelect(option) {
    if (option === "theme") {
      screenManager.push(new ThemeScreen(context))
    } else if (option === "stats") {
      screenManager.push(new StatsScreen(context))
    } else if (option === "quit") {
      renderer.destroy()
      process.exit(0)
    }
  }
})

inputManager.setEscapeMenu(escapeMenu)

// Build the main app UI
const app = Box(
  {
    width: "100%",
    height: "100%",
    backgroundColor: THEME.bg,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  Box({ height: 2 }, typingScreen.getFireRenderable()),
  Box({ height: 1 }),
  Box(
    {
      padding: 2,
      flexDirection: "column",
      alignItems: "center",
    },
    typingScreen.getTextRenderable(),
    Box({ height: 1 }),
    typingScreen.getResultsContainer(),
    Box({ height: 1 }),
    typingScreen.getPromptRenderable()
  ),
  // Escape menu overlay
  escapeMenu.getRenderable()
)

renderer.root.add(app)

// Set up input handling
renderer.keyInput.on("keypress", (keyEvent) => {
  inputManager.handleKeypress(keyEvent)
})

renderer.start()

