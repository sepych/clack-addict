import { createCliRenderer, Box, BoxRenderable } from "@opentui/core"
import { THEME } from "./src/config/theme.ts"
import { TypingStatsDatabase } from "./src/db/Database.ts"
import { AppContext } from "./src/core/AppContext.ts"
import { ScreenManager } from "./src/screens/ScreenManager.ts"
import { TypingScreen } from "./src/screens/TypingScreen.ts"
import { InputManager } from "./src/input/InputManager.ts"

const renderer = await createCliRenderer()
const db = new TypingStatsDatabase()
const context = new AppContext(renderer, db, THEME)

const screenManager = new ScreenManager()
context.setScreenManager(screenManager)

function cleanup() {
  const currentScreen = screenManager.getCurrentScreen()
  if (currentScreen) {
    currentScreen.onExit()
  }
  db.close()
  renderer.destroy()
}

context.onQuit = () => {
  cleanup()
  process.exit(0)
}

const inputManager = new InputManager(screenManager, context, () => {
  context.onQuit?.()
})

// Create and push initial screen
const typingScreen = new TypingScreen(context)
screenManager.push(typingScreen)

// Keep track of current screen renderable
let currentScreenRenderable: BoxRenderable | null = null

function updateScreenDisplay(screenWrapper: BoxRenderable) {
  // Remove old screen if it exists
  if (currentScreenRenderable) {
    try {
      screenWrapper.remove(currentScreenRenderable.id)
    } catch (_e) {
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

// Build the main app UI with screen wrapper
const app = Box(
  {
    width: "100%",
    height: "100%",
    backgroundColor: THEME.bg,
  },
  screenWrapper
)

renderer.root.add(app)

// Set up input handling
renderer.keyInput.on("keypress", (keyEvent) => {
  inputManager.handleKeypress(keyEvent)
})

renderer.start()

