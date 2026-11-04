#!/usr/bin/env bash
# Website Starter App setup. Task & Tool runs this in ~/app after the
# repository is cloned onto the machine, and again whenever the machine is
# replaced. Safe to re-run any time:
#
#     bash ~/app/.taskandtool/setup.sh
#
# The app's own files are not this script's business: they arrive with the
# clone. tt-crawl and its browsers are after-setup.sh's, once the site is up.
set -euo pipefail

APP="$(pwd)"

echo "== website starter app: setup in $APP"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "node and npm are required (Node 20 or newer); install them and re-run" >&2
  exit 1
fi
node_major="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$node_major" -lt 20 ]; then
  echo "Node $(node --version) found; the site needs Node 20 or newer (nvm install 22)" >&2
  exit 1
fi

# 1. Git: the site is the owner's repo from the first minute. A clone already
# is one; a working copy written in some other way is made one here.
if [ ! -d .git ]; then
  git init -q
fi
if ! git rev-parse --verify HEAD >/dev/null 2>&1 && [ -f package.json ]; then
  git add -A
  git -c user.name="${GIT_AUTHOR_NAME:-$(git config user.name || echo 'Task & Tool')}" \
      -c user.email="${GIT_AUTHOR_EMAIL:-$(git config user.email || echo 'website@taskandtool.app')}" \
      commit -q -m "Website Starter App" && echo "== first commit made"
fi

# 2. Dependencies and the first CSS build.
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

# 3. /admin is the team's: Task & Tool asks for a sign-in there even once the
# site is public (src/business.tsx answers 404 to anyone it does not name).
# Declaring a path already declared changes nothing.
if [ -f "$HOME/tools/taskandtool.py" ]; then
  python3 "$HOME/tools/taskandtool.py" add-private-path /admin || true
fi

# 4. The web service, which the manifest's `ready` check looks for: a failure here fails the setup.
if [ -f "$HOME/tools/taskandtool.py" ] && [ -f package.json ]; then
  echo "== serving dev (npm run dev on port 3000)"
  python3 "$HOME/tools/taskandtool.py" serve "npm run dev" --port 3000
fi

echo "== website starter app setup done. Next: dev answers at localhost:3000; for a first homepage, npm run brand-from-site -- <their site> once after-setup.sh has installed tt-crawl"
