# Minimal self-hosted Renovate runner

This is an on-prem Docker runner for Renovate. It automatically discovers supported dependency files anywhere in the selected repositories, including nested `package.json`, `pom.xml`, and `requirements.txt`, then opens GitHub pull requests for available updates.

## Setup

Copy `.env.example` to `.env` and set `RENOVATE_TOKEN` to a GitHub PAT or GitHub App token that can read repositories and create branches and pull requests. `.env` is ignored by Git; no secret is stored in source control.

```powershell
Copy-Item .env.example .env
docker compose run --rm renovate
```

## Repositories

Edit only `repositoryUrls` in `config.js`. Each entry must be a full HTTPS GitHub clone URL, for example `https://github.com/owner/repository.git`. Do not provide file paths: Renovate scans the entire repository itself. The config converts URLs internally because Renovate's GitHub API accepts `owner/repository` identifiers.

`onboarding: false` and `requireConfig: 'ignored'` allow this one central config to process each repository. Pull requests are created automatically when updates are found; branch protection and the repository's checks still control merging.

## Schedule

Use `cron/renovate.cron` on the on-prem runner host. Change `/opt/renovate-runner` to the deployment directory, create its `logs` directory, then install it with `crontab -e`. The supplied entry runs daily at 02:00 local server time and writes to `logs/renovate.log`.

## Renovate PR checks

`.github/workflows/pr-verification.yml` runs for pull requests that modify dependency manifests. It executes `npm install` and `npm test` for Node, `mvn test` for Maven, and installs Python requirements followed by `pytest` when tests exist.
