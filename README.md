<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# emtupr TUI

This branch converts the project into a terminal UI built with **Bubble Tea**, with an optional **Gum** launcher prompt.

## Run the TUI

### One-step install (no Go required)

Windows (PowerShell):
`powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -useb https://raw.githubusercontent.com/Emmotte/emtupr/tui/install.ps1 | iex"`

macOS/Linux (bash):
`curl -fsSL https://raw.githubusercontent.com/Emmotte/emtupr/tui/install.sh | bash`

These installers download the latest **GitHub Release**. Create one by tagging:
`git tag tui-v0.1.0 && git push origin tui-v0.1.0`

### One-command run (requires Go installed)

`go run github.com/Emmotte/emtupr@tui`

### From source

**Prerequisites:** Go 1.22+

1. Run:
   `go run .`
2. If Gum isn't installed (or you want to skip it):
   `go run . --no-gum`

## Web app (previous version)

The original Vite + React app remains in this branch if you still want to run it locally:

1. Install dependencies:
   `npm install`
2. Run:
   `npm run dev`
