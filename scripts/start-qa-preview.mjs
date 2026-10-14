import { execFileSync, spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error('QA_DEPLOY_SHA must be a full lowercase Git SHA.');
if (process.env.QA_DEPLOY_SHA && process.env.QA_DEPLOY_SHA !== sha) {
  throw new Error(`QA_DEPLOY_SHA ${process.env.QA_DEPLOY_SHA} does not match checkout HEAD ${sha}.`);
}
const port = process.env.QA_PORT || '8799';
if (!/^\d{2,5}$/.test(port)) throw new Error('QA_PORT must be a numeric TCP port.');

const command = process.platform === 'win32' ? 'wrangler.cmd' : 'wrangler';
const child = spawn(command, [
  'dev', '--local', '--port', port,
  '--var', `DEPLOY_SHA:${sha}`,
  '--var', 'ALLOW_INDEXING:false',
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH || join(tmpdir(), 'chuka-site-qa-wrangler.log'),
    WRANGLER_REGISTRY_PATH: process.env.WRANGLER_REGISTRY_PATH || join(tmpdir(), 'chuka-site-wrangler-registry'),
    MINIFLARE_REGISTRY_PATH: process.env.MINIFLARE_REGISTRY_PATH || join(tmpdir(), 'chuka-site-miniflare-registry'),
  },
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
child.on('exit', (code, signal) => process.exitCode = signal ? 1 : (code ?? 1));
