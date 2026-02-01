export enum CharStatus {
  Untyped,
  Correct,
  Incorrect,
}

export class TypingEngine {
  public readonly text: string
  private _cursorPosition = 0
  private _charStatuses: CharStatus[]
  private _charTimestamps: number[] = []
  private _currentStreak = 0
  private _startTime: number | null = null
  private _endTime: number | null = null

  constructor(text: string) {
    this.text = text
    this._charStatuses = Array.from({ length: text.length }, () => CharStatus.Untyped)
  }

  get cursorPosition(): number {
    return this._cursorPosition
  }

  get currentStreak(): number {
    return this._currentStreak
  }

  get isComplete(): boolean {
    return this._cursorPosition >= this.text.length
  }

  get startTime(): number | null {
    return this._startTime
  }

  get endTime(): number | null {
    return this._endTime
  }

  getCharStatus(index: number): CharStatus {
    return this._charStatuses[index] ?? CharStatus.Untyped
  }

  get accuracy(): number {
    if (this._cursorPosition === 0) return 100

    const correctCount = this._charStatuses.filter(s => s === CharStatus.Correct).length
    return Math.round((correctCount / this._cursorPosition) * 100)
  }

  get wpm(): number {
    const end = this._endTime ?? Date.now()
    const start = this._startTime

    if (!start || start === end) return 0

    const timeInMinutes = (end - start) / 60000
    const correctChars = this._charStatuses.filter(s => s === CharStatus.Correct).length
    
    // Standard WPM formula: (Characters / 5) / Minutes
    // We use correct characters for Net WPM
    return Math.round((correctChars / 5) / timeInMinutes)
  }

  /**
   * Calculates WPM based on a rolling window of recent characters (last 5-10)
   */
  get recentWpm(): number | null {
    const MIN_CHARS = 5
    const MAX_CHARS = 10

    if (this._charTimestamps.length < MIN_CHARS) return null

    const windowSize = Math.min(this._charTimestamps.length, MAX_CHARS)
    const recentTimestamps = this._charTimestamps.slice(-windowSize)

    const firstTimestamp = recentTimestamps[0]
    const lastTimestamp = recentTimestamps[recentTimestamps.length - 1]

    if (firstTimestamp === undefined || lastTimestamp === undefined) return null

    const timeMs = lastTimestamp - firstTimestamp
    if (timeMs <= 0) return null

    // Standard WPM formula: (Characters / 5) / Minutes
    // charsTyped is windowSize - 1 because we calculate time between the first and last char in the window
    const charsTyped = windowSize - 1
    const timeInMinutes = timeMs / 60000

    return Math.round((charsTyped / 5) / timeInMinutes)
  }

  /**
   * Processes a single character input.
   * @param char The character typed by the user.
   * @returns true if the input was processed (valid move), false if ignored (e.g. game over)
   */
  processInput(char: string): boolean {
    if (this.isComplete) {
      return false
    }

    this._startTime ??= Date.now()

    const expectedChar = this.text[this._cursorPosition]
    
    if (char === expectedChar) {
      this._charStatuses[this._cursorPosition] = CharStatus.Correct
      this._currentStreak++
    } else {
      this._charStatuses[this._cursorPosition] = CharStatus.Incorrect
      this._currentStreak = 0
    }

    this._cursorPosition++
    this._charTimestamps.push(Date.now())

    if (this._cursorPosition >= this.text.length) {
      this._endTime = Date.now()
    }

    return true
  }
}
