$ErrorActionPreference = 'Stop'

$Repo = 'Emmotte/emtupr'
$BinName = 'emtupr'
$InstallDir = Join-Path $env:USERPROFILE '.local\bin'

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

$release = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/latest"
$tag = $release.tag_name
if (-not $tag) {
  Write-Error 'Unable to determine latest release tag.'
  exit 1
}

$assetName = "${BinName}_${tag}_windows_amd64.zip"
$asset = $release.assets | Where-Object { $_.name -eq $assetName } | Select-Object -First 1
if (-not $asset) {
  Write-Error "Release asset not found: $assetName"
  exit 1
}

$tempDir = Join-Path $env:TEMP ("emtupr-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
$zipPath = Join-Path $tempDir $assetName
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zipPath
Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force

if (-not (Test-Path $InstallDir)) {
  New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
}

Copy-Item -Path (Join-Path $tempDir "$BinName.exe") -Destination (Join-Path $InstallDir "$BinName.exe") -Force
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Add-ToUserPath $InstallDir

Write-Host "Installed $BinName to $InstallDir"
& (Join-Path $InstallDir "$BinName.exe")
