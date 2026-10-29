#!/usr/bin/env bash
# Activates an uploaded release on the server. Run by .github/workflows/deploy.yml:
#   bash /var/www/newdirection/releases/<id>/ops/deploy/activate.sh <id>
#
# Layout:
#   /var/www/newdirection/releases/<id>   one folder per deploy (source + .next + node_modules)
#   /var/www/newdirection/shared          .env.production, kept across deploys
#   /var/www/newdirection/current         symlink to the live release (PM2 cwd)
set -euo pipefail

APP_DIR=/var/www/newdirection
APP_NAME=newdirection
KEEP_RELEASES=5
HEALTH_URL=http://127.0.0.1:3000/

RELEASE_ID="${1:?usage: activate.sh <release-id>}"
RELEASE="$APP_DIR/releases/$RELEASE_ID"
CURRENT="$APP_DIR/current"
PREVIOUS="$(readlink -f "$CURRENT" || true)"

switch_to() {
  ln -sfn "$1" "$APP_DIR/current.tmp"
  mv -Tf "$APP_DIR/current.tmp" "$CURRENT"
  pm2 startOrReload "$CURRENT/ecosystem.config.cjs" --update-env
}

healthy() {
  for _ in $(seq 1 30); do
    curl -fs -o /dev/null "$HEALTH_URL" && return 0
    sleep 1
  done
  return 1
}

cd "$RELEASE"
ln -sfn "$APP_DIR/shared/.env.production" .env.production

# Reuse the previous node_modules (hardlinked) when the lockfile is unchanged.
if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS/node_modules" ] && cmp -s package-lock.json "$PREVIOUS/package-lock.json"; then
  echo "Lockfile unchanged, reusing node_modules from $(basename "$PREVIOUS")"
  cp -al "$PREVIOUS/node_modules" node_modules
else
  npm ci --no-audit --no-fund
fi

echo "Switching $CURRENT -> $RELEASE_ID"
switch_to "$RELEASE"

running_cwd=""
healthy && running_cwd="$(readlink -f "/proc/$(pm2 pid "$APP_NAME")/cwd" || true)"
if [ "$running_cwd" != "$RELEASE" ]; then
  echo "Health check failed (cwd: ${running_cwd:-none})" >&2
  if [ -n "$PREVIOUS" ]; then
    echo "Rolling back to $(basename "$PREVIOUS")" >&2
    switch_to "$PREVIOUS"
    healthy || echo "Previous release is not healthy either" >&2
  fi
  exit 1
fi

pm2 save
echo "Live: $RELEASE_ID"

cd "$APP_DIR/releases"
live="$(readlink -f "$CURRENT")"
ls -1 | sort -r | tail -n +$((KEEP_RELEASES + 1)) | while read -r old; do
  [ "$APP_DIR/releases/$old" = "$live" ] || rm -rf -- "$APP_DIR/releases/$old"
done
