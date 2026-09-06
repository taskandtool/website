#!/usr/bin/env bash
# Website Starter App setup. Task & Tool runs this in ~/app when the Starter
# App is installed, and again whenever the machine is replaced. Safe to re-run
# any time:
#
#     bash ~/app/.claude/skills/website/setup.sh
#
# What it does, each step skipped when already done:
#   1. seeds the app from the template (only into an empty app directory)
#   2. initialises git and makes the first commit when there is no history
#   3. installs the npm dependencies and builds the CSS once
#   4. installs the Obscura headless browser (the clone-site skill's capture)
#   5. registers the `web` service (`npm run dev`) so the site is live on the
#      machine's URL, or restarts it after a replacement
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$SKILL_DIR/template"
APP="$(pwd)"

echo "== website starter app: setup in $APP"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "node and npm are required (Node 20 or newer); install them and re-run" >&2
  exit 1
fi
node_major="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$node_major" -lt 20 ]; then
  echo "Node $(node --version) found; the site needs Node 20 or newer (see /.sprite/llm-dev.txt for the version manager)" >&2
  exit 1
fi

# 1. Seed. Only an app with no project in it gets the template; an app that
# already holds code (a cloned repo, a site built earlier, a restored backup)
# is left exactly as it is.
if [ ! -f package.json ] && [ ! -d src ] && [ ! -f index.html ]; then
  echo "== seeding the app from the template"
  (cd "$TEMPLATE" && tar --exclude=node_modules --exclude=dist --exclude=build \
      --exclude=public/site.css -cf - .) | tar -xf - -C "$APP"
  # Dotfiles do not travel through the skill install, so the template
  # carries them under plain names and they are renamed here.
  [ -f _gitignore ] && mv -f _gitignore .gitignore
  [ -f _env.example ] && mv -f _env.example .env.example
else
  echo "== app already holds a project; not seeding (template: $TEMPLATE)"
fi

# 2. Git: the site is the owner's repo from the first minute.
if [ ! -d .git ]; then
  git init -q
fi
if ! git rev-parse --verify HEAD >/dev/null 2>&1 && [ -f package.json ]; then
  git add -A
  git -c user.name="${GIT_AUTHOR_NAME:-$(git config user.name || echo 'Task & Tool')}" \
      -c user.email="${GIT_AUTHOR_EMAIL:-$(git config user.email || echo 'website@taskandtool.app')}" \
      commit -q -m "Website Starter App" && echo "== first commit made"
fi

# 3. Dependencies and the first CSS build.
if [ -f package.json ]; then
  echo "== npm install"
  if [ -f package-lock.json ]; then
    npm ci --no-audit --no-fund --loglevel=error || npm install --no-audit --no-fund --loglevel=error
  else
    npm install --no-audit --no-fund --loglevel=error
  fi
  if grep -q '"css"' package.json; then
    echo "== building the CSS"
    npm run --silent css
  fi
fi

# 4. Obscura: the headless browser the clone-site skill captures with. Same
# binary and version stamp as the Company Brain, so the two share one install.
OBSCURA_VERSION="${OBSCURA_VERSION:-v0.2.1}"
OBSCURA_REPO="https://github.com/h4ckf0r0day/obscura"
if [ -w /usr/local/bin ]; then
  BIN=/usr/local/bin
elif command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
  BIN=/usr/local/bin
  SUDO="sudo -n"
else
  BIN="$HOME/.local/bin"
fi
SUDO="${SUDO:-}"
$SUDO mkdir -p "$BIN"
case "$(uname -s)-$(uname -m)" in
  Linux-x86_64|Linux-amd64) asset="obscura-x86_64-linux.tar.gz" ;;
  Linux-aarch64|Linux-arm64) asset="obscura-aarch64-linux.tar.gz" ;;
  *) asset="" ;;
esac
stamp="$BIN/.obscura-version"
if [ -z "$asset" ]; then
  echo "== obscura: no build for $(uname -s)/$(uname -m); site capture falls back to plain fetching"
elif [ -x "$BIN/obscura" ] && [ "$(cat "$stamp" 2>/dev/null || true)" = "$OBSCURA_VERSION" ]; then
  echo "== obscura $OBSCURA_VERSION already installed"
else
  echo "== obscura $OBSCURA_VERSION -> $BIN"
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  if curl -fsSL --retry 3 "$OBSCURA_REPO/releases/download/$OBSCURA_VERSION/$asset" -o "$tmp/obscura.tgz"; then
    tar xzf "$tmp/obscura.tgz" -C "$tmp"
    main_bin="$(find "$tmp" -type f -name obscura | head -1)"
    worker_bin="$(find "$tmp" -type f -name obscura-worker | head -1)"
    if [ -n "$main_bin" ]; then
      $SUDO install -m 755 "$main_bin" "$BIN/obscura"
      [ -n "$worker_bin" ] && $SUDO install -m 755 "$worker_bin" "$BIN/obscura-worker"
      echo "$OBSCURA_VERSION" | $SUDO tee "$stamp" >/dev/null
      echo "installed obscura $OBSCURA_VERSION"
    else
      echo "obscura binary not found in $asset; site capture falls back to plain fetching"
    fi
  else
    echo "could not download obscura; site capture falls back to plain fetching"
  fi
fi

# 5. The web service: the site is live on this machine's URL from now on.
# `npm run dev` rebuilds the CSS and restarts the server on every change.
if command -v sprite-env >/dev/null 2>&1 && [ -f package.json ]; then
  if sprite-env services get web >/dev/null 2>&1; then
    echo "== restarting the web service"
    sprite-env services restart web >/dev/null 2>&1 || true
  else
    echo "== registering the web service (npm run dev on port 3000)"
    sprite-env services create web \
      --cmd bash --args "-c,set -a; . /home/sprite/.env; set +a; exec npm run dev" \
      --dir "$APP" --env "PORT=3000" --http-port 3000 >/dev/null 2>&1 \
      && echo "web service registered" \
      || echo "could not register the web service; see the website skill for the command"
  fi
fi

echo "== website starter app setup done"
