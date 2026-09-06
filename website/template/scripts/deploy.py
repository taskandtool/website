#!/usr/bin/env python3
"""Build the site and publish it.

    python3 scripts/deploy.py            build, then deploy
    python3 scripts/deploy.py --no-build deploy what is already built
    python3 scripts/deploy.py --dry-run  build and say what would be deployed

On a Task & Tool machine this calls deploy_site from the platform bridge
(tools/taskandtool.py): the machine uploads the built assets and the Worker
bundle; the platform deploys them to the edge on this app's behalf. No
Cloudflare credential ever exists here. Edge serving must be enabled for the
app first (the owner's Settings page; the AI can ask with
request_capability("edge", why)).

Anywhere else (your own computer, your own Cloudflare account) the same
script falls back to `npx wrangler deploy` with wrangler.jsonc.
"""

import json
import os
import subprocess
import sys

DIST = "dist"
WORKER = os.path.join("build", "worker.mjs")


def fail(msg, code=1):
    print(f"deploy: {msg}", file=sys.stderr)
    sys.exit(code)


def ensure_platform_env():
    """A chat turn's shell may not carry the platform env; the machine's
    /home/sprite/.env does. Re-run under it once when the bridge needs it."""
    env_file = os.path.expanduser("~/.env")
    if os.environ.get("PHOENIX_URL") or not os.path.isfile(env_file) or os.environ.get("_TT_ENV_LOADED"):
        return
    os.environ["_TT_ENV_LOADED"] = "1"
    cmd = "set -a; . ~/.env; set +a; exec python3 \"$0\" \"$@\""
    os.execvp("bash", ["bash", "-c", cmd, os.path.abspath(sys.argv[0]), *sys.argv[1:]])


def build():
    print("== build")
    r = subprocess.run(["npm", "run", "--silent", "build"])
    if r.returncode:
        fail("build failed", r.returncode)


def on_platform():
    bridge = os.path.expanduser("~/tools/taskandtool.py")
    return bool(os.environ.get("PHOENIX_URL")) and os.path.isfile(bridge)


def deploy_platform(dry_run):
    sys.path.insert(0, os.path.expanduser("~"))
    from tools import taskandtool as tt  # noqa: E402

    status = tt.serving_status()
    if status is None:
        fail("could not reach Task & Tool from this machine; try again in a moment")
    if not status.get("edge_enabled"):
        print(json.dumps(status, indent=2))
        fail(
            "edge serving is not enabled for this app. Ask the owner to enable it in the app's "
            "Settings, or call request_capability(\"edge\", why) from tools/taskandtool.py.",
            2,
        )
    files = sum(len(fs) for _, _, fs in os.walk(DIST))
    print(f"== deploy: {files} asset(s) from {DIST}/ + Worker {WORKER}")
    if dry_run:
        print("dry run: nothing sent")
        return
    result = tt.deploy_site(DIST, worker_js=WORKER)
    if isinstance(result, str):
        print(f"live at {result}")
        print(
            "Visitors are now served from the edge. Edits on this machine reach them only "
            "after this script runs again. Whether the site is on the web at all is the "
            "owner's publish setting in the dashboard."
        )
        return
    if result is None:
        fail("the deploy did not complete (platform unreachable or the upload failed)")
    print(json.dumps(result, indent=2))
    fail(f"deploy refused: {result.get('error')}")


def deploy_wrangler(dry_run):
    print("== deploy with wrangler (off-platform: your own Cloudflare account)")
    cmd = ["npx", "wrangler", "deploy"]
    if dry_run:
        cmd.append("--dry-run")
    r = subprocess.run(cmd)
    if r.returncode:
        fail("wrangler failed", r.returncode)


def main(argv):
    # Always run from the app root, wherever the script was invoked from.
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    ensure_platform_env()
    dry_run = "--dry-run" in argv
    if "--no-build" not in argv:
        build()
    if not os.path.isdir(DIST) or not os.path.isfile(WORKER):
        fail(f"nothing to deploy: {DIST}/ or {WORKER} is missing (run npm run build)")
    if on_platform():
        deploy_platform(dry_run)
    else:
        deploy_wrangler(dry_run)


if __name__ == "__main__":
    main(sys.argv[1:])
