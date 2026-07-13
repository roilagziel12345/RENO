const fs = require("fs");
const path = require("path");

function repositorySlug(repositoryUrl, consumerId) {
  let parsed;

  try {
    parsed = new URL(repositoryUrl);
  } catch {
    throw new Error(
      `Consumer "${consumerId}" has an invalid repository URL: ${repositoryUrl}`,
    );
  }

  const slug = parsed.pathname.replace(/^\/+|\/+$/g, "").replace(/\.git$/, "");

  if (!slug || !slug.includes("/")) {
    throw new Error(
      `Consumer "${consumerId}" repository must be a full URL such as https://github.com/org/repo.`,
    );
  }

  return slug;
}

function loadRepositories() {
  const consumerFile = path.join(__dirname, "renovate", "consumers.json");
  const parsed = JSON.parse(fs.readFileSync(consumerFile, "utf8"));

  if (!Array.isArray(parsed.consumers) || parsed.consumers.length === 0) {
    throw new Error("renovate/consumers.json must contain at least one consumer.");
  }

  const seenConsumers = new Set();
  const seenRepositories = new Set();
  const repositories = [];

  for (const consumer of parsed.consumers) {
    if (!consumer.id || !Array.isArray(consumer.repositories)) {
      throw new Error("Every consumer needs an id and a repositories array.");
    }
    if (seenConsumers.has(consumer.id)) {
      throw new Error(`Duplicate consumer id: ${consumer.id}`);
    }
    seenConsumers.add(consumer.id);

    if (consumer.artifactoryUrl) {
      try {
        new URL(consumer.artifactoryUrl);
      } catch {
        throw new Error(`Consumer "${consumer.id}" has an invalid artifactoryUrl.`);
      }
    }

    for (const repositoryUrl of consumer.repositories) {
      const repository = repositorySlug(repositoryUrl, consumer.id);
      if (seenRepositories.has(repository)) {
        throw new Error(`Repository is assigned more than once: ${repository}`);
      }
      seenRepositories.add(repository);
      repositories.push(repository);
    }
  }

  return repositories;
}

module.exports = {
  platform: process.env.RENOVATE_PLATFORM || "github",
  endpoint: process.env.RENOVATE_ENDPOINT || undefined,
  repositories: loadRepositories(),
  onboarding: false,
  requireConfig: "optional",
  extends: [
    "config:recommended",
    ":semanticCommits",
    ":separateMajorReleases",
    ":timezone(Asia/Jerusalem)",
  ],
  dependencyDashboard: true,
  dependencyDashboardApproval: false,
  dependencyDashboardTitle: "Renovate Dependency Dashboard",
  labels: ["dependencies", "renovate"],
  prConcurrentLimit: 5,
  prHourlyLimit: 2,
  branchConcurrentLimit: 10,
  prCreation: "immediate",
  rangeStrategy: "bump",
  rebaseWhen: "behind-base-branch",
  automerge: false,
  platformAutomerge: false,
  packageRules: [
    {
      description: "Group low-risk non-major updates.",
      matchUpdateTypes: ["minor", "patch"],
      groupName: "minor and patch dependency updates",
      groupSlug: "minor-patch",
    },
    {
      description: "Label major updates for client review.",
      matchUpdateTypes: ["major"],
      labels: ["dependencies", "renovate", "major-update"],
    },
  ],
};
