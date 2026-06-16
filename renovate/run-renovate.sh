#!/usr/bin/env sh
set -eu

: "${RENOVATE_TOKEN:?Set RENOVATE_TOKEN to a GitHub token or GitLab token with repo access.}"
: "${RENOVATE_REPOSITORIES:?Set RENOVATE_REPOSITORIES, for example owner/repo.}"

docker run --rm \
  -e RENOVATE_TOKEN \
  -e RENOVATE_PLATFORM="${RENOVATE_PLATFORM:-github}" \
  -e RENOVATE_ENDPOINT="${RENOVATE_ENDPOINT:-}" \
  -e RENOVATE_REPOSITORIES \
  -e LOG_LEVEL="${LOG_LEVEL:-info}" \
  -v "$(pwd)/renovate.json:/usr/src/app/config.json:ro" \
  renovate/renovate:latest
