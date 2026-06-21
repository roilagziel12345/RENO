/** Edit only this list. Full HTTPS GitHub repository URLs are required. */
const repositoryUrls = [
  'https://github.com/roilagziel12345/RENO.git',
  'https://github.com/roilagziel12345/newrepos.git',
];

function toRepositorySlug(repositoryUrl) {
  const url = new URL(repositoryUrl);
  if (url.protocol !== 'https:' || url.hostname !== 'github.com') {
    throw new Error(`Only HTTPS github.com repository URLs are supported: ${repositoryUrl}`);
  }

  const parts = url.pathname.replace(/^\//, '').replace(/\.git$/, '').split('/');
  if (parts.length !== 2 || parts.some((part) => !part)) {
    throw new Error(`Expected a full GitHub repository URL: ${repositoryUrl}`);
  }
  return parts.join('/');
}

module.exports = {
  platform: 'github',
  token: process.env.RENOVATE_TOKEN,
  repositories: repositoryUrls.map(toRepositorySlug),
  // Default managers recursively find package.json, pom.xml, requirements.txt, etc.
  onboarding: false,
  requireConfig: 'ignored',
  dependencyDashboard: false,
  prConcurrentLimit: 10,
  prHourlyLimit: 0,
  labels: ['dependencies', 'renovate'],
};
