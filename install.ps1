$ErrorActionPreference = 'Stop'

$GoVersion = '1.22.6'
$InstallRoot = Join-Path $env:USERPROFILE 'tools'
$GoDir = Join-Path $InstallRoot 'go'
$GoBin = Join-Path $GoDir 'bin'
$GoExe = Join-Path $GoBin 'go.exe'
$UserBin = Join-Path $env:USERPROFILE 'go\bin'

function Add-ToUserPath {
  param([string]$PathToAdd)
  $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
  if ($userPath -notlike "*$PathToAdd*") {
    [Environment]::SetEnvironmentVariable('Path', "$PathToAdd;$userPath", 'User')
  }
  if ($env:PATH -notlike "*$PathToAdd*") {
    $env:PATH = "$PathToAdd;$env:PATH"
  }
}

$existingGo = Get-Command go -ErrorAction SilentlyContinue
if ($existingGo) {
  $GoExe = $existingGo.Source
} elseif (-not (Test-Path $GoExe)) {
  $zip = Join-Path $env:TEMP "go$GoVersion.zip"
  Invoke-WebRequest -Uri "https://go.dev/dl/go$GoVersion.windows-amd64.zip" -OutFile $zip
  if (Test-Path $GoDir) { Remove-Item $GoDir -Recurse -Force }
  Expand-Archive -Path $zip -DestinationPath $InstallRoot -Force
}

Add-ToUserPath $GoBin

& $GoExe version | Out-Null

if (-not (Test-Path $UserBin)) {
  New-Item -ItemType Directory -Force -Path $UserBin | Out-Null
}

if (-not (Get-Command gum -ErrorAction SilentlyContinue)) {
  $env:GOBIN = $UserBin
  & $GoExe install github.com/charmbracelet/gum@latest
}

Add-ToUserPath $UserBin

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir
& $GoExe mod tidy
& $GoExe run .
