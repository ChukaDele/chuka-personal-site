import { execFileSync, spawnSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const preview = process.argv.includes('--preview');
const enableIndexing = process.argv.includes('--enable-indexing');
const sha = git('rev-parse', 'HEAD');
const branch = git('branch', '--show-current');
function assertReleaseTree() {
  // This protects against accidental local npm deployments. The real trust
  // boundary is GitHub's protected environment and Cloudflare credentials.
  if (!preview && !(
    process.env.GITHUB_ACTIONS === 'true' &&
    process.env.GITHUB_REF === 'refs/heads/main' &&
    process.env.GITHUB_SHA === sha &&
    process.env.GITHUB_JOB === 'production-deploy' &&
    process.env.GITHUB_RUN_ID
  )) throw new Error('Production releases require the approved GitHub production workflow; local npm deploy is disabled.');
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Expected a full Git SHA.');
  if (git('rev-parse', 'HEAD') !== sha || git('status', '--porcelain')) throw new Error('Deploy requires an unchanged, clean committed worktree.');
  if (!preview && branch !== 'main') throw new Error('Production deploy requires main.');
  if (enableIndexing && (preview || process.env.INDEXING_APPROVED_SHA !== sha)) throw new Error('Indexing requires INDEXING_APPROVED_SHA equal to the accepted production SHA.');
}
function run(command, args, env) {
  const result = spawnSync(command, args, { stdio: 'inherit', env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
const env = { ...process.env, ALLOW_INDEXING: enableIndexing ? 'true' : 'false', WRANGLER_LOG_PATH: '.wrangler/wrangler.log' };
if (!preview) env.UI_STRESS_QA = 'false';
assertReleaseTree();
// Keep deployment credentials out of npm/Astro build plugins.
// Only the final Wrangler process may receive the Cloudflare API token.
const buildEnv = { ...env };
for (const key of ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_API_KEY', 'CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_EMAIL', 'CF_API_TOKEN']) {
  delete buildEnv[key];
}
run('npm', ['run', 'build'], buildEnv);
assertReleaseTree();
run('./node_modules/.bin/wrangler', [
  'deploy', '--config', 'wrangler.jsonc',
  '--name', preview ? 'chuka-personal-site-atelier-v1' : 'chuka-personal-site',
  '--var', `DEPLOY_SHA:${sha}`, '--var', `ALLOW_INDEXING:${env.ALLOW_INDEXING}`,
], env);
