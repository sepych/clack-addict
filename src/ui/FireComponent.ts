import { StyledText, fg, bg } from "@opentui/core"
import { THEME } from "../config/theme"

// --- DESIGNER CONFIGURATION START ---

// 1. Color Palette (Edit hex codes here)
const FIRE_PALETTE = {
  core:    '#FFD700', // Yellow
  body:    '#FF8C00', // Orange
  tips:    '#FF4500', // Red
  base:    '#560000', // Dark Red
}

// 2. Pixel Mapping (Map characters to Palette colors)
const PIXEL_MAP: Record<string, string> = {
  'Y': FIRE_PALETTE.core,
  'O': FIRE_PALETTE.body,
  'R': FIRE_PALETTE.tips,
  'D': FIRE_PALETTE.base,
  ' ': '' // Transparent
}

// 3. Animation Frames
// '▀' represents 2 vertical pixels.
// The strings below are the "texture".
const FRAMES = [
  // Frame 1
  [
    " D  ",
    " R R",
    "RYYO",
    "OYYY",
  ],
  // Frame 2
  [
    " R  ",
    "  R ",
    "ROYO",
    "OYYY",
  ],
  // Frame 3
  [
    "  D ",
    " RY ",
    "RYYR",
    "OYYY",
  ],
  // Frame 4
  [
    "    ",
    "DR R",
    " OYO",
    "OYYO",
  ]
]

// --- DESIGNER CONFIGURATION END ---

/**
 * Renders a frame of the fire animation.
 * Uses double vertical resolution: 2 text rows = 1 block row.
 */
export function renderFire(frameIndex: number): StyledText {
  const rawFrame = FRAMES[frameIndex % FRAMES.length]
  if (!rawFrame) return new StyledText([])

  const chunks: any[] = []

  // Process 2 rows at a time to create 1 line of blocks
  for (let y = 0; y < rawFrame.length; y += 2) {
    const topRow = rawFrame[y] || ""
    const botRow = rawFrame[y + 1] || ""

    // Determine width (max of both rows)
    const width = Math.max(topRow.length, botRow.length)

    for (let x = 0; x < width; x++) {
      const topChar = topRow[x] || ' '
      const botChar = botRow[x] || ' '

      const topColor = PIXEL_MAP[topChar]
      const botColor = PIXEL_MAP[botChar]

      // Rendering Logic:
      // We use the Upper Half Block '▀'.
      // The Foreground color colors the top half.
      // The Background color colors the bottom half.

      if (!topColor && !botColor) {
        // Both transparent
        chunks.push(fg(THEME.bg)(" "))
      } else if (topColor && !botColor) {
        // Top colored, Bottom transparent
        chunks.push(fg(topColor)("▀"))
      } else if (!topColor && botColor) {
        // Top transparent, Bottom colored -> Use Lower Block '▄'
        chunks.push(fg(botColor)("▄"))
      } else if (topColor && botColor) {
        // Both colored -> Top is FG, Bottom is BG
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
