import { Box, BoxRenderable, TextRenderable, StyledText, fg } from "@opentui/core"
import type { KeyEvent } from "@opentui/core"
import { BaseScreen } from "./Screen.ts"
import { TypingScreen } from "./TypingScreen.ts"
import { renderBigText } from "../ui/BigText.ts"
import { AppContext } from "../core/AppContext.ts"

/**
 * The initial splash screen of the application
 */
export class SplashScreen extends BaseScreen {
  readonly name = 'Splash'

  private titleRenderable: TextRenderable
  private promptRenderable: TextRenderable

  constructor(context: AppContext) {
    super(context)

    const theme = this.context.currentTheme
    
    this.titleRenderable = new TextRenderable(context.renderer, {
      content: renderBigText("CLACKADDICT", theme.fg),
    })

    this.promptRenderable = new TextRenderable(context.renderer, {
      content: new StyledText([
        fg(theme.untyped)("Press Enter to start")
      ]),
    })
  }

  onKeypress(event: KeyEvent): void {
    if (event.name === 'return' || event.name === 'enter') {
      this.context.getScreenManager()?.replace(new TypingScreen(this.context))
    }
  }

  render(): BoxRenderable {
    const theme = this.context.currentTheme

    const container = new BoxRenderable(
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

    container.add(Box({ marginBottom: 2 }, this.titleRenderable))
    container.add(this.promptRenderable)

    return container
  }
}
