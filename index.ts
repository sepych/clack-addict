import { createCliRenderer, Box } from "@opentui/core"
import { THEME } from "./src/config/theme.ts"
import { TypingStatsDatabase } from "./src/db/Database.ts"
import { AppContext } from "./src/core/AppContext.ts"
import { ScreenManager } from "./src/screens/ScreenManager.ts"
import { TypingScreen } from "./src/screens/TypingScreen.ts"
import { InputManager } from "./src/input/InputManager.ts"
import { CommandMenu } from "./src/commands/CommandMenu.ts"
import { CommandRegistry } from "./src/commands/types.ts"
import { themeCommand, statsCommand } from "./src/commands/builtins.ts"

const renderer = await createCliRenderer()
const db = new TypingStatsDatabase()
const context = new AppContext(renderer, db, THEME)

const screenManager = new ScreenManager()
context.setScreenManager(screenManager)

const inputManager = new InputManager(screenManager, () => {
  renderer.destroy()
  process.exit(0)
})

// Set up command registry and menu
const commandRegistry = new CommandRegistry()
commandRegistry.register(themeCommand)
commandRegistry.register(statsCommand)

const commandMenu = new CommandMenu(context, commandRegistry)
inputManager.setCommandMenu(commandMenu)

// Create and push initial screen
const typingScreen = new TypingScreen(context)
typingScreen.setCommandMenu(commandMenu)
screenManager.push(typingScreen)

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
  // Command menu overlay
  commandMenu.render(),
  Box({ height: 1 }, commandMenu.getInputRenderable()),
  commandMenu.getMenuRenderable()
)

renderer.root.add(app)

// Set up input handling
renderer.keyInput.on("keypress", (keyEvent) => {
  inputManager.handleKeypress(keyEvent)
})

renderer.start()

