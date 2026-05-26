#!/usr/bin/env bash
set -euo pipefail

REPO="Emmotte/emtupr"
BIN_NAME="emtupr"
INSTALL_DIR="${HOME}/.local/bin"

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

TAG="$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" | grep -m1 '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/')"
if [[ -z "${TAG}" ]]; then
  echo "Unable to determine latest release tag." >&2
  exit 1
fi

ARCHIVE="${BIN_NAME}_${TAG}_${GOOS}_${GOARCH}.tar.gz"
URL="https://github.com/${REPO}/releases/download/${TAG}/${ARCHIVE}"

TMP_DIR="$(mktemp -d -t emtupr.XXXXXX)"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

curl -fsSL "${URL}" -o "${TMP_DIR}/${ARCHIVE}"
tar -xzf "${TMP_DIR}/${ARCHIVE}" -C "${TMP_DIR}"

mkdir -p "${INSTALL_DIR}"
install -m 0755 "${TMP_DIR}/${BIN_NAME}" "${INSTALL_DIR}/${BIN_NAME}"

ensure_path "${INSTALL_DIR}"

echo "Installed ${BIN_NAME} to ${INSTALL_DIR}"
"${INSTALL_DIR}/${BIN_NAME}"
