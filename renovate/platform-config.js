const fs = require("fs");
const path = require("path");

function repositoriesFromEnv() {
  return (process.env.RENOVATE_REPOSITORIES || "")
    .split(",")
    .map((repo) => repo.trim())
    .filter(Boolean);
}

function repositoriesFromFile() {
  const repoFile = path.join(__dirname, "repositories.json");

  if (!fs.existsSync(repoFile)) {
    return [];
  }

  const parsed = JSON.parse(fs.readFileSync(repoFile, "utf8"));

  if (!Array.isArray(parsed.repositories)) {
    throw new Error("renovate/repositories.json must contain a repositories array.");
  }

  return parsed.repositories;
}

const repositories = repositoriesFromEnv();
const fileRepositories = repositories.length > 0 ? [] : repositoriesFromFile();

module.exports = {
  platform: process.env.RENOVATE_PLATFORM || "github",
  endpoint: process.env.RENOVATE_ENDPOINT || undefined,
  repositories: repositories.length > 0 ? repositories : fileRepositories,
  onboarding: false,
  requireConfig: "optional",
  dependencyDashboard: true,
  labels: ["dependencies", "renovate"],
  prConcurrentLimit: 5,
  prHourlyLimit: 2,
  branchConcurrentLimit: 10,
  prCreation: "immediate",
  rangeStrategy: "bump",
  rebaseWhen: "behind-base-branch",
  recreateWhen: "always",
  automerge: false,
  platformAutomerge: false,
  packageRules: [
    {
      description: "Group low-risk non-major updates to reduce CI pressure.",
      matchUpdateTypes: ["minor", "patch"],
      groupName: "minor and patch dependency updates",
      groupSlug: "minor-patch",
    },
    {
      description: "Require dashboard approval for major updates.",
      matchUpdateTypes: ["major"],
      dependencyDashboardApproval: true,
      labels: ["dependencies", "renovate", "major-update"],
    },
  ],
};
