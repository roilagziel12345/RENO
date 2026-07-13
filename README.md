# Minimal Renovate SaaS runner

This repository is a small central Renovate service for many consumers. Each
consumer supplies repository URLs in one file, the runner scans them on a
schedule, and Renovate opens dependency PRs immediately. Nothing is merged
automatically.

## Add a consumer

Edit only `renovate/consumers.json`:

```json
{
  "consumers": [
    {
      "id": "client-a",
      "repositories": [
        "https://github.com/client-a/api",
        "https://github.com/client-a/web"
      ],
      "artifactoryUrl": ""
    }
  ]
}
```

- `id` must be unique.
- `repositories` contains full GitHub repository URLs. Renovate discovers
  `package.json`, `pom.xml`, `requirements.txt`, and nested manifests itself.
- `artifactoryUrl` is optional and can stay empty during the GitHub test. It is
  reserved for the consumer's package registry URL; registry credentials are
  not committed here.

The demo consumer points at this repository. Add more consumer objects or more
repository URLs without adding another runner or configuration file.

## Run the service

Create a GitHub Actions secret named `RENOVATE_TOKEN`. The token must be able to
read the configured repositories, create branches and PRs, and update issues.
Then run **Renovate Runner** from the Actions page. It also runs Sunday through
Thursday at 22:00 UTC and whenever the central configuration changes on `main`.

For a local test:

```sh
export RENOVATE_TOKEN=github-token
docker compose -f renovate/docker-compose.yml run --rm renovate
```

Renovate opens PRs immediately (`dependencyDashboardApproval: false`), limits
the number of concurrent PRs, groups minor and patch updates, labels majors,
and never automerges.

## Validate client PRs

`.github/workflows/pr-verification.yml` is the client workflow template. Copy
it into each consumer repository. On a PR it detects changed dependency
manifests and runs only the relevant checks:

- npm install and tests for Node.js manifests;
- Maven tests for `pom.xml`;
- package installation and pytest for Python requirements.

This repository already uses the workflow, so Renovate PRs against the demo
consumer show whether its Node, Maven, and Python projects still pass.

## Artifactory later

When Artifactory testing starts, set each consumer's `artifactoryUrl` to its
real package repository endpoint and provide credentials through GitHub Actions
secrets. Package managers use different Artifactory repository URLs, so the
field is intentionally recorded but not forced into npm, Maven, or Python
during this public-registry test.
