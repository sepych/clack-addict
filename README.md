# ⌨️ ClackAddict

An unhinged, terminal-based typing speed test built for speed demons and keyboard enthusiasts.

*Terminal aesthetics for the truly obsessed.*

[Screencast from 2026-02-01 21-14-10.webm](https://github.com/user-attachments/assets/edb7d3ad-f538-467e-9a8b-14fdf84181ec)


## 🔥 Features

- **Blazing Fast**: Built with Bun and `@opentui/core` for minimal latency.
- **Fire Mode**: Hit high streaks to set your terminal on fire (literally).
- **Multiple Themes**: Tokyo Night, Dracula, Monokai, Nord, SynthWave '84, and more.
- **Stats Tracking**: Monitor your WPM, accuracy, and daily averages.
- **Big Text**: Glorious ASCII art for that retro feel.

## 🚀 Installation

Install **ClackAddict** with a single command:

```bash
curl -fsSL https://raw.githubusercontent.com/sepych/clack-addict/master/install | bash
```

Once installed, simply run:

```bash
clack-addict
```

## 🎮 How to Play

1. Launch the app and stare at the glorious **CLACKADDICT** splash screen.
2. Press **Enter** to dive into the madness.
3. Type the text as fast as you can.
4. Watch your WPM climb and your streak ignite.
5. Hit **Escape** to change themes or view stats.
6. Try not to break your mechanical switches.

## 🛠️ Development

To run tests:
```bash
bun test
```

To lint:
```bash
bun run lint
```

To build a standalone binary:
```bash
bun run build
```

## 🗑️ Uninstallation

To completely remove ClackAddict from your system:

1. Remove the installation directory:
   ```bash
   rm -rf ~/.clack-addict
   ```
2. Open your shell configuration file (e.g., `~/.zshrc`, `~/.bashrc`, or `~/.config/fish/config.fish`) and remove the line that adds `~/.clack-addict/bin` to your `PATH`.

## 📜 License

MIT
