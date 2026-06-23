// Edit only this list. Use full GitHub repository URLs.
const repositoryUrls = [
  'https://github.com/roilagziel12345/RENO.git',
  'https://github.com/roilagziel12345/newrepos.git',
];

module.exports = {
  platform: 'github',
  token: process.env.RENOVATE_TOKEN,
  repositories: repositoryUrls.map((url) => new URL(url).pathname.slice(1).replace(/\.git$/, '')),
  onboarding: false,
  requireConfig: 'ignored',
  dependencyDashboard: false,
  prHourlyLimit: 0,
};
