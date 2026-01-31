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
  const rows: string[] = Array(CHAR_HEIGHT).fill("");

  for (const char of text.toUpperCase()) {
    const charData = CHARS[char] || UNKNOWN_CHAR;
    for (let i = 0; i < CHAR_HEIGHT; i++) {
      rows[i] += charData[i] + " "; // Add 1px gap between chars
    }
  }

  // Join rows with newlines
  const fullText = rows.join("\n");
  
  return new StyledText([
    fg(color)(fullText)
  ]);
}
