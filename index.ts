import { createCliRenderer, Box, TextRenderable } from "@opentui/core"
import { bg, fg, StyledText } from "@opentui/core"

const THEME = {
  bg: '#1a1b26',
  fg: '#a9b1d6',
  cursorBg: '#7aa2f7',
  correct: '#9ece6a',
  incorrect: '#f7768e',
  untyped: '#565f89',
}

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog"

const renderer = await createCliRenderer()

let cursorPosition = 0
const correctChars: boolean[] = new Array(SAMPLE_TEXT.length).fill(false)

function renderText(): StyledText {
  const chunks: any[] = []

  for (let i = 0; i < SAMPLE_TEXT.length; i++) {
    const char = SAMPLE_TEXT[i]!

    if (i < cursorPosition) {
      const color = correctChars[i] ? THEME.correct : THEME.incorrect
      chunks.push(fg(color)(char))
    } else if (i === cursorPosition) {
      chunks.push(bg(THEME.cursorBg)(fg(THEME.bg)(char)))
    } else {
      chunks.push(fg(THEME.untyped)(char))
    }
  }

  return new StyledText(chunks)
}

const textRenderable = new TextRenderable(renderer, { content: renderText() })

function updateDisplay() {
  textRenderable.content = renderText()
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

  if (cursorPosition >= SAMPLE_TEXT.length) {
    return
  }

  if (keyEvent.sequence && keyEvent.sequence.length === 1) {
    const expectedChar = SAMPLE_TEXT[cursorPosition]
    const typedChar = keyEvent.sequence

    correctChars[cursorPosition] = typedChar === expectedChar
    cursorPosition++

    updateDisplay()

    if (cursorPosition === SAMPLE_TEXT.length) {
      console.log("\n\nComplete!")
    }
  }
})

renderer.start()
