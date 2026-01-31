import { StyledText, fg, bg } from "@opentui/core"
import { THEME } from "../config/theme"

// Double Vertical Resolution Fire
// We map 2 vertical pixels to 1 character height using '▀' (Upper Half Block)
// Top pixel = Foreground Color
// Bottom pixel = Background Color

const PALETTE: Record<string, string> = {
  'Y': THEME.streak.lvl3, // Yellow (Core)
  'O': THEME.streak.lvl4, // Orange (Body)
  'R': THEME.streak.lvl5, // Red (Tips)
  'D': '#560000',         // Dark Red (Base/Shadow) - custom hex for depth
  ' ': ''                 // Transparent
}

const HI_RES_FRAMES = [
  // Frame 1
  [
    "    R     ",
    "  R ROR   ",
    "  RO OYR  ",
    "  OYOR YR ",
  ],
  // Frame 2
  [
    "          ",
    "  R R O   ",
    "  RO OYR  ",
    "  RYOR YR ",
  ],
  // Frame 3
  [
    "     O    ",
    "   Y O    ",
    "  OO OYR  ",
    "  RYOR YR ",
  ],
  // Frame 4
  [
    "    O  O  ",
    "    ROR   ",
    "  RO OYR  ",
    "  OYO OYR ",
  ]
]

export function renderFire(frameIndex: number): StyledText {
  const rawFrame = HI_RES_FRAMES[frameIndex % HI_RES_FRAMES.length]
  if (!rawFrame) return new StyledText([])

  const chunks: any[] = []

  // Process 2 rows at a time
  for (let y = 0; y < rawFrame.length; y += 2) {
    const topRow = rawFrame[y] || ""
    const botRow = rawFrame[y + 1] || ""

    // Determine width (max of both rows)
    const width = Math.max(topRow.length, botRow.length)

    for (let x = 0; x < width; x++) {
      const topPixel = topRow[x] || ' '
      const botPixel = botRow[x] || ' '

      const topColor = PALETTE[topPixel]
      const botColor = PALETTE[botPixel]

      // Logic for combining pixels
      if (!topColor && !botColor) {
        // Both transparent
        chunks.push(fg(THEME.bg)(" "))
      } else if (topColor && !botColor) {
        // Top has color, Bottom is transparent -> Upper block
        chunks.push(fg(topColor)("▀"))
      } else if (!topColor && botColor) {
        // Top transparent, Bottom has color -> Lower block
        chunks.push(fg(botColor)("▄"))
      } else if (topColor && botColor) {
        // Both colored -> Upper block with Background color set to bottom pixel
        // Note: We use '▀' so fg is Top, bg is Bottom
        chunks.push(bg(botColor)(fg(topColor)("▀")))
      }
    }

    // Newline after each combined row (except the last pair)
    if (y < rawFrame.length - 2) {
      chunks.push(fg(THEME.fg)("\n"))
    }
  }

  return new StyledText(chunks)
}
