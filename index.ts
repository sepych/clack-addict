import { createCliRenderer, Box, TextRenderable, StyledText, fg } from "@opentui/core"
import { THEME } from "./src/config/theme"
import { getRandomSample } from "./src/config/text"
import { TypingEngine } from "./src/core/TypingEngine"
import { renderGameText } from "./src/ui/TextRenderer"

const renderer = await createCliRenderer()

// Game State
type GameState = 'PLAYING' | 'COMPLETE'
let currentState: GameState = 'PLAYING'
let engine = new TypingEngine(getRandomSample())

const textRenderable = new TextRenderable(renderer, { content: renderGameText(engine) })
const statusRenderable = new TextRenderable(renderer, { content: "" })

function updateDisplay() {
  textRenderable.content = renderGameText(engine)
  
  if (currentState === 'COMPLETE') {
    const wpm = engine.wpm
    const acc = engine.accuracy
    statusRenderable.content = new StyledText([
      fg(THEME.fg)("\n\n"),
      fg(THEME.correct)("Complete! "),
      fg(THEME.fg)(`WPM: ${wpm} | Acc: ${acc}%`),
      fg(THEME.fg)("\nPress Enter to continue...")
    ])
  } else {
    statusRenderable.content = ""
  }
  
  renderer.requestRender()
}

const app = Box(
  {
    width: "100%",
    height: "100%",
    backgroundColor: THEME.bg,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  Box(
    {
      padding: 2,
    },
    textRenderable,
    statusRenderable
  )
)

renderer.root.add(app)

renderer.keyInput.on("keypress", (keyEvent) => {
  const key = keyEvent.name

  if (
    key === "escape" ||
    (keyEvent.ctrl && key === "c")
  ) {
    renderer.destroy()
    process.exit(0)
  }

  if (currentState === 'COMPLETE') {
    if (key === 'return' || key === 'enter') {
      // Reset game
      engine = new TypingEngine(getRandomSample())
      currentState = 'PLAYING'
      updateDisplay()
    }
    return
  }

  // PLAYING state
  if (keyEvent.sequence && keyEvent.sequence.length === 1) {
    const processed = engine.processInput(keyEvent.sequence)

    if (processed) {
      if (engine.isComplete) {
        currentState = 'COMPLETE'
      }
      updateDisplay()
    }
  }
})

renderer.start()
