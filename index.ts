import { createCliRenderer, Box, BoxRenderable } from "@opentui/core"
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

// Keep track of current screen renderable
let currentScreenRenderable: BoxRenderable | null = null

function updateScreenDisplay(screenWrapper: BoxRenderable) {
  // Remove old screen if it exists
  if (currentScreenRenderable && (currentScreenRenderable as any).id) {
    try {
      screenWrapper.remove((currentScreenRenderable as any).id)
    } catch (e) {
      // Ignore removal errors
    }
  }

  // Add new screen
  const currentScreen = screenManager.getCurrentScreen()
  if (currentScreen) {
    currentScreenRenderable = currentScreen.render()
    screenWrapper.add(currentScreenRenderable)
  }
  renderer.requestRender()
}

// Create screen wrapper
const screenWrapper = new BoxRenderable(renderer, {
  width: "100%",
  height: "100%",
})

// Initial screen render
updateScreenDisplay(screenWrapper)

// Override screenManager methods to update display when screen changes
const originalPush = screenManager.push.bind(screenManager)
screenManager.push = function(screen) {
  originalPush(screen)
  updateScreenDisplay(screenWrapper)
}

const originalPop = screenManager.pop.bind(screenManager)
screenManager.pop = function() {
  const result = originalPop()
  updateScreenDisplay(screenWrapper)
  return result
}

const originalReplace = screenManager.replace.bind(screenManager)
screenManager.replace = function(screen) {
  originalReplace(screen)
  updateScreenDisplay(screenWrapper)
}

// Build the main app UI with screen wrapper and escape menu
const app = Box(
  {
    width: "100%",
    height: "100%",
    backgroundColor: THEME.bg,
  },
  screenWrapper,
  // Escape menu overlay
  escapeMenu.getRenderable()
)

renderer.root.add(app)

// Set up input handling
renderer.keyInput.on("keypress", (keyEvent) => {
  inputManager.handleKeypress(keyEvent)
})

renderer.start()

