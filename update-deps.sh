#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCKFILE="/tmp/update-deps.lock"

if [ -e "$LOCKFILE" ]; then
  echo "Error: update-deps.sh is already running (lock: $LOCKFILE). Aborting."
  exit 1
fi
trap 'rm -f "$LOCKFILE"' EXIT
touch "$LOCKFILE"

UPDATE_FRONTEND=false
UPDATE_BACKEND=false

for arg in "$@"; do
  case "$arg" in
    --frontend) UPDATE_FRONTEND=true ;;
    --backend)  UPDATE_BACKEND=true ;;
    *)
      echo "Usage: $0 [--frontend] [--backend]"
      echo "  No flags: updates both."
      exit 1
      ;;
  esac
done

if ! $UPDATE_FRONTEND && ! $UPDATE_BACKEND; then
  UPDATE_FRONTEND=true
  UPDATE_BACKEND=true
fi

if $UPDATE_FRONTEND; then
  echo "==> Updating frontend dependencies..."
  cd "$SCRIPT_DIR/frontend"

  if [ ! -f "package.json" ]; then
    echo "Error: package.json not found in frontend/. Aborting."
    exit 1
  fi

  if ! command -v npx &>/dev/null; then
    echo "Error: npx not found. Install Node.js first. Aborting."
    exit 1
  fi

  npx --yes npm-check-updates -u
  npm install
  npm audit || true
fi

if $UPDATE_BACKEND; then
  echo "==> Updating backend dependencies..."
  cd "$SCRIPT_DIR/backend"

  if [ ! -f "requirements.txt" ]; then
    echo "Error: requirements.txt not found in backend/. Aborting."
    exit 1
  fi

  if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
  elif [ -f ".venv/Scripts/activate" ]; then
    source .venv/Scripts/activate
  elif [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
  elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
  else
    echo "Error: no virtual environment found in backend/ (.venv or venv). Aborting."
    exit 1
  fi

  if ! command -v pip &>/dev/null; then
    echo "Error: pip not found in the virtual environment. Aborting."
    deactivate 2>/dev/null || true
    exit 1
  fi

  pip install --upgrade -r requirements.txt

  # Save updated versions back, but only for packages already in requirements.txt
  sed 's/[=<>!\r].*//' requirements.txt > /tmp/req_names.txt
  UPDATED=$(pip freeze | grep -i -F -f /tmp/req_names.txt)
  rm /tmp/req_names.txt
  if [ -z "$UPDATED" ]; then
    echo "Error: pip freeze produced no matches — requirements.txt left unchanged."
    deactivate 2>/dev/null || true
    exit 1
  fi
  echo "$UPDATED" > requirements.txt

  deactivate 2>/dev/null || true
fi

echo "==> Done."
