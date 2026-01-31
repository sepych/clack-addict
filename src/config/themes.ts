import type { Theme } from "../core/AppContext.ts"

export const THEME_TOKYO_NIGHT: Theme = {
  name: 'Tokyo Night',
  bg: '#1a1b26',
  fg: '#a9b1d6',
  resultBg: '#292e42',
  cursorBg: '#7aa2f7',
  correct: '#9ece6a',
  incorrect: '#f7768e',
  untyped: '#565f89',
  streak: {
    lvl1: '#2ac3de',   // Cyan-Teal
    lvl2: '#9ece6a',   // Green
    lvl3: '#e0af68',   // Yellow
    lvl4: '#ff9e64',   // Orange
    lvl5: '#f7768e',   // Red
    lvl6: '#bb9af7',   // Purple
    lvl7: '#ff007c',   // Magenta
  }
}

export const THEME_DRACULA: Theme = {
  name: 'Dracula',
  bg: '#282a36',
  fg: '#f8f8f2',
  resultBg: '#44475a',
  cursorBg: '#6272a4',
  correct: '#50fa7b',
  incorrect: '#ff5555',
  untyped: '#6272a4',
  streak: {
    lvl1: '#8be9fd',   // Cyan
    lvl2: '#50fa7b',   // Green
    lvl3: '#f1fa8c',   // Yellow
    lvl4: '#ffb86c',   // Orange
    lvl5: '#ff5555',   // Red
    lvl6: '#bd93f9',   // Purple
    lvl7: '#ff79c6',   // Pink
  }
}

export const THEME_MONOKAI: Theme = {
  name: 'Monokai',
  bg: '#272822',
  fg: '#f8f8f2',
  resultBg: '#3e3d32',
  cursorBg: '#66d9ef',
  correct: '#a6e22e',
  incorrect: '#f92672',
  untyped: '#75715e',
  streak: {
    lvl1: '#66d9ef',   // Cyan
    lvl2: '#a6e22e',   // Green
    lvl3: '#e6db74',   // Yellow
    lvl4: '#fd971f',   // Orange
    lvl5: '#f92672',   // Magenta
    lvl6: '#ae81ff',   // Purple
    lvl7: '#f92672',   // Pink
  }
}

export const THEME_NORD: Theme = {
  name: 'Nord',
  bg: '#2e3440',
  fg: '#eceff4',
  resultBg: '#3b4252',
  cursorBg: '#88c0d0',
  correct: '#a3be8c',
  incorrect: '#bf616a',
  untyped: '#4c566a',
  streak: {
    lvl1: '#81a1c1',   // Blue
    lvl2: '#a3be8c',   // Green
    lvl3: '#ebcb8b',   // Yellow
    lvl4: '#d08770',   // Orange
    lvl5: '#bf616a',   // Red
    lvl6: '#b48ead',   // Purple
    lvl7: '#bf616a',   // Rose
  }
}

export const ALL_THEMES: Record<string, Theme> = {
  tokyo_night: THEME_TOKYO_NIGHT,
  dracula: THEME_DRACULA,
  monokai: THEME_MONOKAI,
  nord: THEME_NORD,
}

// Legacy export for backward compatibility
export const THEME = THEME_TOKYO_NIGHT
