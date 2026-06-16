# Renovate Fleet Test Set

This directory intentionally contains many differently shaped dependency manifests
to test Renovate discovery at scale.

- `node-api-*`: standalone npm services
- `java-api-*`: standalone Maven services
- `python-job-*`: standalone Python services
- `commerce-monorepo`: nested multi-service repo layout
- `platform-monorepo`: nested multi-module repo layout

The dependencies are intentionally old so Renovate can discover and update them.
