import { createCliRenderer, Box, TextRenderable, StyledText, fg } from "@opentui/core"
import { THEME } from "./src/config/theme"
import { getRandomSample } from "./src/config/text"
import { TypingEngine } from "./src/core/TypingEngine"
import { renderGameText } from "./src/ui/TextRenderer"
import { renderFire } from "./src/ui/FireComponent"

const renderer = await createCliRenderer()

// Game State
type GameState = 'PLAYING' | 'COMPLETE'
let currentState: GameState = 'PLAYING'
let engine = new TypingEngine(getRandomSample())
let fireFrame = 0

const textRenderable = new TextRenderable(renderer, { content: renderGameText(engine) })
const statsRenderable = new TextRenderable(renderer, { content: "" })
const promptRenderable = new TextRenderable(renderer, { content: "" })
const fireRenderable = new TextRenderable(renderer, { content: renderFire(0) })

function updateDisplay() {
  textRenderable.content = renderGameText(engine)
  fireRenderable.content = renderFire(fireFrame, Math.floor(engine.currentStreak / 10))

  if (currentState === 'COMPLETE') {
    const wpm = engine.wpm
    const acc = engine.accuracy
    statsRenderable.content = new StyledText([
      fg(THEME.correct)(`WPM: ${wpm}   ACC: ${acc}%`)
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
  Box({ height: 2 }, fireRenderable),
  Box({ height: 1 }),
  Box(
    {
      padding: 2,
      flexDirection: "column",
      alignItems: "center",
    },
    textRenderable,
    Box({ height: 1 }),
    // Container for results
    Box(
      {
        flexDirection: "row",
      },
      // Left Border Box
      Box({
        width: 1,
        backgroundColor: THEME.cursorBg,
      }),
      // Content Box
      Box(
        {
          padding: 1,
          backgroundColor: THEME.resultBg,
        },
        statsRenderable
      )
    ),
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

// Animation Loop
setInterval(() => {
  fireFrame++
  fireRenderable.content = renderFire(fireFrame, Math.floor(engine.currentStreak / 10))
  renderer.requestRender()
}, 150)
