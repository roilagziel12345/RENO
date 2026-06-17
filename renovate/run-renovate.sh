#!/usr/bin/env sh
set -eu

: "${RENOVATE_TOKEN:?Set RENOVATE_TOKEN to a GitHub token or GitLab token with repo access.}"
: "${RENOVATE_REPOSITORIES:?Set RENOVATE_REPOSITORIES, for example owner/repo.}"

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

docker run --rm \
  -v "$REPO_ROOT:/usr/src/app:ro" \
  -w /usr/src/app \
  -e RENOVATE_TOKEN \
  -e RENOVATE_PLATFORM="${RENOVATE_PLATFORM:-github}" \
  -e RENOVATE_ENDPOINT="${RENOVATE_ENDPOINT:-}" \
  -e RENOVATE_REPOSITORIES \
  -e RENOVATE_REQUIRE_CONFIG=optional \
  -e LOG_LEVEL="${LOG_LEVEL:-info}" \
  renovate/renovate:latest
