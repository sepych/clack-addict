import { Box, BoxRenderable, TextRenderable, StyledText, fg } from "@opentui/core"
import type { KeyEvent } from "@opentui/core"
import { BaseScreen } from "./Screen.ts"
import { AppContext } from "../core/AppContext.ts"
import { TypingEngine } from "../core/TypingEngine.ts"
import { getRandomSample } from "../config/text.ts"
import { renderGameText } from "../ui/TextRenderer.ts"
import { renderFire } from "../ui/FireComponent.ts"
import type { CommandMenu } from "../commands/CommandMenu.ts"

type GameState = 'PLAYING' | 'COMPLETE'

/**
 * The main typing game screen
 */
export class TypingScreen extends BaseScreen {
  readonly name = 'Typing'

  private currentState: GameState = 'PLAYING'
  private engine: TypingEngine
  private fireFrame: number = 0
  private commandMenu: CommandMenu | null = null

  // UI Renderables
  private textRenderable: TextRenderable
  private statsRenderable: TextRenderable
  private promptRenderable: TextRenderable
  private fireRenderable: TextRenderable
  private resultsContainer: BoxRenderable

  constructor(context: AppContext) {
    super(context)
    this.engine = new TypingEngine(getRandomSample())

    this.textRenderable = new TextRenderable(context.renderer, {
      content: renderGameText(this.engine)
    })
    this.statsRenderable = new TextRenderable(context.renderer, { content: "" })
    this.promptRenderable = new TextRenderable(context.renderer, { content: "" })
    this.fireRenderable = new TextRenderable(context.renderer, {
      content: renderFire(0)
    })

    this.resultsContainer = new BoxRenderable(context.renderer, {
      flexDirection: "row",
      visible: false,
    })

    this.resultsContainer.add(
      Box({
        width: 1,
        backgroundColor: context.currentTheme.cursorBg,
      })
    )

    this.resultsContainer.add(
      Box(
        {
          padding: 1,
          backgroundColor: context.currentTheme.resultBg,
        },
        this.statsRenderable
      )
    )
  }

  setCommandMenu(menu: CommandMenu): void {
    this.commandMenu = menu
  }

  onKeypress(event: KeyEvent): void {
    const key = event.name

    if (this.currentState === 'COMPLETE') {
      if (key === 'return' || key === 'enter') {
        this.resetGame()
      }
      return
    }

    // PLAYING state - handle character input
    if (event.sequence && event.sequence.length === 1) {
      const char = event.sequence

      // Check if command menu should intercept
      if (this.commandMenu && char === "/" && !this.commandMenu.isActive()) {
        this.commandMenu.open()
        return
      }

      const processed = this.engine.processInput(char)

      if (processed) {
        if (this.engine.isComplete) {
          this.currentState = 'COMPLETE'
          this.context.db.saveSession(this.engine.wpm, this.engine.accuracy)
        }
        this.updateDisplay()
      }
    }
  }

  render(): BoxRenderable {
    const theme = this.context.currentTheme

    return new BoxRenderable(
      this.context.renderer,
      {
        width: "100%",
        height: "100%",
        backgroundColor: theme.bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }
    )
  }

  override onEnter(): void {
    this.updateDisplay()
    // Start animation loop
    const interval = setInterval(() => {
      this.fireFrame++
      this.fireRenderable.content = renderFire(
        this.fireFrame,
        Math.floor(this.engine.currentStreak / 10)
      )
      this.context.renderer.requestRender()
    }, 150)

    // Store interval for cleanup
    ;(this as any)._animationInterval = interval
  }

  override onExit(): void {
    // Clean up animation loop
    const interval = (this as any)._animationInterval
    if (interval) {
      clearInterval(interval)
    }
  }

  private resetGame(): void {
    this.engine = new TypingEngine(getRandomSample())
    this.currentState = 'PLAYING'
    this.fireFrame = 0
    this.updateDisplay()
  }

  private updateDisplay(): void {
    const theme = this.context.currentTheme

    this.textRenderable.content = renderGameText(this.engine)
    this.fireRenderable.content = renderFire(
      this.fireFrame,
      Math.floor(this.engine.currentStreak / 10)
    )

    if (this.currentState === 'COMPLETE') {
      this.resultsContainer.visible = true
      const wpm = this.engine.wpm
      const acc = this.engine.accuracy
      this.statsRenderable.content = new StyledText([
        fg(theme.fg)(`WPM: ${wpm}   ACC: ${acc}%`)
      ])
      this.promptRenderable.content = new StyledText([
        fg(theme.untyped)("Press Enter to continue...")
      ])
    } else {
      this.resultsContainer.visible = false
      this.statsRenderable.content = ""
      this.promptRenderable.content = ""
    }

    this.context.renderer.requestRender()
  }

  // Public accessors for UI building
  getFireRenderable(): TextRenderable {
    return this.fireRenderable
  }

  getTextRenderable(): TextRenderable {
    return this.textRenderable
  }

  getStatsRenderable(): TextRenderable {
    return this.statsRenderable
  }

  getPromptRenderable(): TextRenderable {
    return this.promptRenderable
  }

  getResultsContainer(): BoxRenderable {
    return this.resultsContainer
  }
}
