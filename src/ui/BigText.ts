import { StyledText, fg } from "@opentui/core";

const CHAR_HEIGHT = 5;

const CHARS: Record<string, string[]> = {
  '0': [
    "███",
    "█ █",
    "█ █",
    "█ █",
    "███"
  ],
  '1': [
    " █ ",
    "██ ",
    " █ ",
    " █ ",
    "███"
  ],
  '2': [
    "███",
    "  █",
    "███",
    "█  ",
    "███"
  ],
  '3': [
    "███",
    "  █",
    "███",
    "  █",
    "███"
  ],
  '4': [
    "█ █",
    "█ █",
    "███",
    "  █",
    "  █"
  ],
  '5': [
    "███",
    "█  ",
    "███",
    "  █",
    "███"
  ],
  '6': [
    "███",
    "█  ",
    "███",
    "█ █",
    "███"
  ],
  '7': [
    "███",
    "  █",
    "  █",
    "  █",
    "  █"
  ],
  '8': [
    "███",
    "█ █",
    "███",
    "█ █",
    "███"
  ],
  '9': [
    "███",
    "█ █",
    "███",
    "  █",
    "███"
  ],
  'W': [
    "█ █",
    "█ █",
    "█ █",
    "███",
    "█ █"
  ],
  'P': [
    "███",
    "█ █",
    "███",
    "█  ",
    "█  "
  ],
  'M': [
    "█ █",
    "███",
    "███",
    "█ █",
    "█ █"
  ],
  'A': [
    "███",
    "█ █",
    "███",
    "█ █",
    "█ █"
  ],
  'C': [
    "███",
    "█  ",
    "█  ",
    "█  ",
    "███"
  ],
  'L': [
    "█  ",
    "█  ",
    "█  ",
    "█  ",
    "███"
  ],
  'K': [
    "█ █",
    "█ █",
    "██ ",
    "█ █",
    "█ █"
  ],
  'D': [
    "██ ",
    "█ █",
    "█ █",
    "█ █",
    "██ "
  ],
  'I': [
    "███",
    " █ ",
    " █ ",
    " █ ",
    "███"
  ],
  'T': [
    "███",
    " █ ",
    " █ ",
    " █ ",
    " █ "
  ],
  ':': [
    "   ",
    " █ ",
    "   ",
    " █ ",
    "   "
  ],
  '%': [
    "█  ",
    "  █",
    " █ ",
    "█  ",
    "  █"
  ],
  '.': [
    "   ",
    "   ",
    "   ",
    "   ",
    " █ "
  ],
  ' ': [
    "  ",
    "  ",
    "  ",
    "  ",
    "  "
  ]
};

const UNKNOWN_CHAR = [
  "???",
  "???",
  "???",
  "???",
  "???"
];

export function renderBigText(text: string, color: string): StyledText {
  const rows: string[] = Array.from({ length: CHAR_HEIGHT }, () => "");

  for (const char of text.toUpperCase()) {
    const charData = CHARS[char] ?? UNKNOWN_CHAR;
    for (let i = 0; i < CHAR_HEIGHT; i++) {
      const line = charData[i] ?? "";
      const currentRow = rows[i] ?? "";
      rows[i] = currentRow + line + " "; // Add 1px gap between chars
    }
  }

  // Join rows with newlines
  const fullText = rows.join("\n");
  
  return new StyledText([
    fg(color)(fullText)
  ]);
}
