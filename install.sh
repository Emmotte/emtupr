#!/usr/bin/env bash
set -euo pipefail

GO_VERSION="1.22.6"
INSTALL_ROOT="${HOME}/.local"
GO_DIR="${INSTALL_ROOT}/go"
GO_BIN="${GO_DIR}/bin"
GOBIN="${HOME}/.local/bin"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

add_path_line() {
  local target_file="$1"
  local line="$2"
  if [[ -f "${target_file}" ]] && grep -Fqs "${line}" "${target_file}"; then
    return
  fi
  printf '\n%s\n' "${line}" >> "${target_file}"
}

ensure_path() {
  local bin_path="$1"
  export PATH="${bin_path}:${PATH}"
  add_path_line "${HOME}/.profile" "export PATH=\"${bin_path}:\$PATH\""
  if [[ -f "${HOME}/.bashrc" ]]; then
    add_path_line "${HOME}/.bashrc" "export PATH=\"${bin_path}:\$PATH\""
  fi
  if [[ -f "${HOME}/.zshrc" ]]; then
    add_path_line "${HOME}/.zshrc" "export PATH=\"${bin_path}:\$PATH\""
  fi
}

if ! command -v go >/dev/null 2>&1; then
  OS="$(uname -s)"
  ARCH="$(uname -m)"

  case "${OS}" in
    Darwin) GOOS="darwin" ;;
    Linux) GOOS="linux" ;;
    *) echo "Unsupported OS: ${OS}" >&2; exit 1 ;;
  esac

  case "${ARCH}" in
    x86_64|amd64) GOARCH="amd64" ;;
    arm64|aarch64) GOARCH="arm64" ;;
    *) echo "Unsupported architecture: ${ARCH}" >&2; exit 1 ;;
  esac

  URL="https://go.dev/dl/go${GO_VERSION}.${GOOS}-${GOARCH}.tar.gz"
  TMP_FILE="$(mktemp -t go.tgz.XXXXXX)"

  curl -fsSL "${URL}" -o "${TMP_FILE}"
  rm -rf "${GO_DIR}"
  mkdir -p "${INSTALL_ROOT}"
  tar -C "${INSTALL_ROOT}" -xzf "${TMP_FILE}"
  rm -f "${TMP_FILE}"
fi

ensure_path "${GO_BIN}"

if ! command -v gum >/dev/null 2>&1; then
  mkdir -p "${GOBIN}"
  export GOBIN
  go install github.com/charmbracelet/gum@latest
  ensure_path "${GOBIN}"
fi

go mod tidy
go run .
