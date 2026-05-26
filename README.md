<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# emtupr TUI

This branch converts the project into a terminal UI built with **Bubble Tea**, with an optional **Gum** launcher prompt.

## Run the TUI

**Prerequisites:** Go 1.22+

### One-step install (recommended)

Windows (PowerShell):
`.\install.ps1`

macOS/Linux (bash):
`bash install.sh`

Windows one-liner (git clone + run):
`powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -useb https://raw.githubusercontent.com/Emmotte/emtupr/tui/bootstrap.ps1 | iex"`

macOS/Linux one-liner (git clone + run):
`curl -fsSL https://raw.githubusercontent.com/Emmotte/emtupr/tui/bootstrap.sh | bash`

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
