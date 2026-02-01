import { StyledText, fg, bg } from "@opentui/core"
import type { TextChunk } from "@opentui/core"
import { THEME } from "../config/theme"

interface FirePalette {
  core: string
  body: string
  tips: string
  base: string
}

// Map streak levels to palettes (matching theme.ts)
const PALETTES: Record<number, FirePalette> = {
  1: { core: '#e0ffff', body: '#2ac3de', tips: '#0077be', base: '#004050' }, // Cyan
  2: { core: '#f0fff0', body: '#9ece6a', tips: '#228b22', base: '#004000' }, // Green
  3: { core: '#ffffe0', body: '#e0af68', tips: '#daa520', base: '#503000' }, // Yellow
  4: { core: '#ffff00', body: '#ff9e64', tips: '#ff4500', base: '#560000' }, // Orange
  5: { core: '#ffdab9', body: '#f7768e', tips: '#dc143c', base: '#400000' }, // Red
  6: { core: '#e6e6fa', body: '#bb9af7', tips: '#9370db', base: '#200040' }, // Purple
  7: { core: '#ffe4e1', body: '#ff007c', tips: '#c71585', base: '#300030' }, // Magenta
}

const CHAR_TO_ROLE: Record<string, keyof FirePalette> = {
  'Y': 'core',
  'O': 'body',
  'R': 'tips',
  'D': 'base'
}

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

/**
 * Renders a frame of the fire animation.
 * Uses double vertical resolution: 2 text rows = 1 block row.
 * @param frameIndex The animation frame index
 * @param level The fire level (0 = hidden, 1-7 = intensity)
 */
export function renderFire(frameIndex: number, level = 0): StyledText {
  if (level < 1) {
    // Return placeholder with same dimensions (4 chars wide, 2 lines tall)
    // to prevent layout jumps when fire activates
    return new StyledText([
      fg(THEME.bg)("    "),
      fg(THEME.bg)("\n    ")
    ])
  }

  // Clamp level to max 7
  const safeLevel = Math.min(Math.max(level, 1), 7)
  const palette = PALETTES[safeLevel]
  const rawFrame = FRAMES[frameIndex % FRAMES.length]
  
  if (!palette || !rawFrame) return new StyledText([])

  const chunks: TextChunk[] = []

  // Process 2 rows at a time to create 1 line of blocks
  for (let y = 0; y < rawFrame.length; y += 2) {
    const topRow = rawFrame[y] ?? ""
    const botRow = rawFrame[y + 1] ?? ""

    // Determine width (max of both rows)
    const width = Math.max(topRow.length, botRow.length)

    for (let x = 0; x < width; x++) {
      const topChar = topRow[x] ?? ' '
      const botChar = botRow[x] ?? ' '

      const topRole = CHAR_TO_ROLE[topChar]
      const botRole = CHAR_TO_ROLE[botChar]

      const topColor = topRole ? palette[topRole] : undefined
      const botColor = botRole ? palette[botRole] : undefined

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
