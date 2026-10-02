#!/usr/bin/env bash
# Website Starter App setup. Task & Tool runs this in ~/app after the
# repository is cloned onto the machine, and again whenever the machine is
# replaced. Safe to re-run any time:
#
#     bash ~/app/.taskandtool/setup.sh
#
# What it does, each step skipped when already done:
#   1. makes sure the working copy is a git repo with a commit in it
#   2. installs the npm dependencies and builds the CSS once
#   3. installs tt-crawl (the site reader) and its browsers
#   4. registers the `web` service (`npm run dev`) so the site is live on the
#      machine's URL, or restarts it after a replacement
#
# The app's own files are not this script's business: they arrive with the
# clone.
set -euo pipefail

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

# 3. tt-crawl (github.com/taskandtool/crawler), the site reader the migrate-site
# skill captures with, and the browsers it drives.
CRAWLER_REF="${CRAWLER_REF:-main}"
CRAWLER="git+https://github.com/taskandtool/crawler@$CRAWLER_REF"
echo "== tt-crawl $CRAWLER_REF"
# The crawler's main, every run: the first install brings its dependencies;
# the second replaces its own code even when its version number did not move.
python3 -m pip install --quiet --upgrade "ttcrawl @ $CRAWLER" 2>&1 | tail -2 || true
python3 -m pip install --quiet --force-reinstall --no-deps "ttcrawl @ $CRAWLER" 2>&1 | tail -2 || true
python3 -m ttcrawl --version || echo "tt-crawl did not install; site capture is unavailable until it does"

# tt-crawl on the PATH, then the browsers it drives: Chrome reads pages and
# takes screenshots, Obscura is the small fallback. Done here so a first crawl
# never downloads a browser mid-conversation.
python3 -m ttcrawl setup || echo "tt-crawl setup did not finish every step; its JSON line says which"

# 4. The web service: the site is live on this machine's URL from now on.
# `npm run dev` rebuilds the CSS and restarts the server on every change.
# This is what the manifest's `ready` check looks for, so a failure here is a
# failure of the setup: an app that reports installed and serves nothing is
# the one outcome worth exiting non-zero for.
if command -v sprite-env >/dev/null 2>&1 && [ -f package.json ]; then
  if sprite-env services get web >/dev/null 2>&1; then
    echo "== restarting the web service"
    sprite-env services restart web >/dev/null 2>&1 || true
  else
    echo "== registering the web service (npm run dev on port 3000)"
    sprite-env services create web \
      --cmd bash --args "-c,set -a; . /home/sprite/.env; set +a; exec npm run dev" \
      --dir "$APP" --env "PORT=3000" --http-port 3000
    echo "web service registered"
  fi
fi

echo "== website starter app setup done"
