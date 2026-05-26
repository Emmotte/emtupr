#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/Emmotte/emtupr.git"
BRANCH="tui"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required to install the TUI." >&2
  exit 1
fi

WORKDIR="$(mktemp -d -t emtupr-tui.XXXXXX)"
cleanup() {
  rm -rf "${WORKDIR}"
}
trap cleanup EXIT

git clone --depth 1 --branch "${BRANCH}" "${REPO_URL}" "${WORKDIR}/emtupr"
cd "${WORKDIR}/emtupr"
bash install.sh
