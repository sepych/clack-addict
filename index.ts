import { createCliRenderer, Box, TextRenderable } from "@opentui/core"
import { THEME } from "./src/config/theme"
import { SAMPLE_TEXT } from "./src/config/text"
import { TypingEngine } from "./src/core/TypingEngine"
import { renderGameText } from "./src/ui/TextRenderer"

const renderer = await createCliRenderer()

// Initialize Game State
const engine = new TypingEngine(SAMPLE_TEXT)

const textRenderable = new TextRenderable(renderer, { content: renderGameText(engine) })

function updateDisplay() {
  textRenderable.content = renderGameText(engine)
  renderer.requestRender()
}

const app = Box(
  {
    width: "100%",
    height: "100%",
    backgroundColor: THEME.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  Box(
    {
      padding: 2,
    },
    textRenderable
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

  if (keyEvent.sequence && keyEvent.sequence.length === 1) {
    const processed = engine.processInput(keyEvent.sequence)

    if (processed) {
      updateDisplay()

      if (engine.isComplete) {
        // Allow the UI to update one last time before exiting/printing
        setTimeout(() => {
          console.log("\n\nComplete!")
        }, 10)
      }
    }
  }
})

renderer.start()
