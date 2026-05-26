$ErrorActionPreference = 'Stop'

$RepoUrl = 'https://github.com/Emmotte/emtupr.git'
$Branch = 'tui'

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error 'git is required to install the TUI.'
  exit 1
}

$workDir = Join-Path $env:TEMP ("emtupr-tui-" + [guid]::NewGuid().ToString('N'))
$repoDir = Join-Path $workDir 'emtupr'
New-Item -ItemType Directory -Force -Path $workDir | Out-Null

try {
  git clone --depth 1 --branch $Branch $RepoUrl $repoDir
  Set-Location $repoDir
  .\install.ps1
} finally {
  Remove-Item $workDir -Recurse -Force -ErrorAction SilentlyContinue
}
