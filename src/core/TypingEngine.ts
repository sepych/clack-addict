export enum CharStatus {
  Untyped,
  Correct,
  Incorrect,
}

export class TypingEngine {
  public readonly text: string
  private _cursorPosition: number = 0
  private _charStatuses: CharStatus[]

  constructor(text: string) {
    this.text = text
    this._charStatuses = new Array(text.length).fill(CharStatus.Untyped)
  }

  get cursorPosition(): number {
    return this._cursorPosition
  }

  get isComplete(): boolean {
    return this._cursorPosition >= this.text.length
  }

  getCharStatus(index: number): CharStatus {
    return this._charStatuses[index] ?? CharStatus.Untyped
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

    const expectedChar = this.text[this._cursorPosition]
    
    if (char === expectedChar) {
      this._charStatuses[this._cursorPosition] = CharStatus.Correct
    } else {
      this._charStatuses[this._cursorPosition] = CharStatus.Incorrect
    }

    this._cursorPosition++
    return true
  }
}
