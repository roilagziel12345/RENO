# RENO

Proof-of-concept monorepo for evaluating Mend Renovate across mixed Node.js, Maven, and Python dependency manifests.

## Large-scale Renovate runner

The scale-safe runner lives in `config.js`, which loads `renovate/platform-config.js`. It is designed for one Renovate job per security boundary or client group, not one job per repository.

Repository targets can be supplied in either of these ways:

- `RENOVATE_REPOSITORIES=owner/repo-a,owner/repo-b`
- `renovate/repositories.json`, using `renovate/repositories.example.json` as the template

The real `renovate/repositories.json` is gitignored so private client repo names do not have to be committed.

Default safety controls:

- `prConcurrentLimit: 5`
- `prHourlyLimit: 2`
- `branchConcurrentLimit: 10`
- no automerge
- minor and patch updates grouped together
- all updates require Dependency Dashboard approval before PR creation
- major updates are labelled for client review

Renovate discovers manifests recursively. You do not need to provide paths for `package.json`, `pom.xml`, `requirements.txt`, or nested monorepo services.

## Running Renovate

GitHub Actions:

- `.github/workflows/renovate-runner.yml`
- manually with `workflow_dispatch`
- nightly on the configured cron
- optionally with a comma-separated repository list input

Jenkins:

- central runner: `renovate/Jenkinsfile`
- set `RENOVATE_TOKEN` as a Jenkins credential/environment variable
- optionally pass `RENOVATE_REPOSITORIES`

Local Docker:

```sh
export RENOVATE_TOKEN=...
export RENOVATE_REPOSITORIES=owner/repo-a,owner/repo-b
./renovate/run-renovate.sh
```

## PR verification

`Jenkinsfile` and `.github/workflows/pr-verification.yml` both detect changed dependency manifests and run only the relevant verification:

- npm tests for changed `package.json` or `package-lock.json`
- Maven tests for changed `pom.xml`
- Python install/tests for changed `requirements.txt`

This prevents Renovate PR bursts from triggering full monorepo builds for every dependency update.

## Issue-first approval workflow

Renovate is configured with `dependencyDashboardApproval: true`. That means the
first output is a Dependency Dashboard issue in each target repository. Renovate
does not open a PR or trigger CI until an approved user checks an update in that
issue.

Flow:

1. Renovate scans the repo and updates the dashboard issue.
2. The client/admin reviews available updates in the issue.
3. The client/admin checks the update they want.
4. Renovate opens the PR in that same application repo.
5. CI runs only for the app directories touched by the PR.
