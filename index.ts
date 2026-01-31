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
const statsRenderable = new TextRenderable(renderer, { content: "" })
const promptRenderable = new TextRenderable(renderer, { content: "" })

function updateDisplay() {
  textRenderable.content = renderGameText(engine)
  
  if (currentState === 'COMPLETE') {
    const wpm = engine.wpm
    const acc = engine.accuracy
    statsRenderable.content = new StyledText([
      fg(THEME.correct)(`WPM: ${wpm}`),
      fg(THEME.untyped)(" | "),
      fg(THEME.correct)(`ACC: ${acc}%`)
    ])
    promptRenderable.content = new StyledText([
      fg(THEME.untyped)("Press Enter to continue...")
    ])
  } else {
    statsRenderable.content = ""
    promptRenderable.content = ""
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
      flexDirection: "column",
      alignItems: "center",
    },
    textRenderable,
    Box({ height: 1 }),
    statsRenderable,
    Box({ height: 1 }),
    promptRenderable
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
