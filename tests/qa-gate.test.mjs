import test from 'node:test';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createEvidence } from '../scripts/generate-qa-evidence.mjs';
import { assertDeploySha } from '../scripts/live-site-smoke.mjs';

test('release catalog has all 47 unique Website Launch QA v2.0 controls', async () => {
  const catalog = JSON.parse(await readFile('.website-qa/catalog.json', 'utf8'));
  assert.equal(catalog.standard, 'Website Launch QA v2.0');
  assert.equal(catalog.controls.length, 47);
  assert.equal(new Set(catalog.controls.map(control => control.id)).size, 47);
  assert.deepEqual(new Set(catalog.controls.map(control => control.priority)), new Set(['P0', 'P1', 'P2']));
});

test('evidence generation fails closed with every control NOT_TESTED', async () => {
  const sha = 'a'.repeat(40);
  const evidence = await createEvidence({ catalogPath: '.website-qa/catalog.json', sha });
  assert.equal(evidence.generated_status, 'CLOSEOUT_BLOCKED');
  assert.equal(Object.keys(evidence.controls).length, 47);
  assert.ok(Object.values(evidence.controls).every(item => item.status === 'NOT_TESTED' && item.release_sha === sha));
  assert.ok(Object.values(evidence.approvals).every(item => item.status === 'NOT_TESTED'));
});

test('live smoke rejects a wrong deployment SHA before accepting page content', async () => {
  const actualSha = 'a'.repeat(40);
  const wrongSha = 'b'.repeat(40);
  assert.throws(() => assertDeploySha(new Headers({ 'X-Deploy-SHA': actualSha }), wrongSha), /does not equal/);
});


test('local-production-release: npm deploy refuses outside protected GitHub production job', () => {
  const result = spawnSync(process.execPath, ['scripts/deploy-production.mjs', '--enable-indexing'], {
    cwd: process.cwd(), encoding: 'utf8',
    env: { ...process.env, GITHUB_ACTIONS: 'false', GITHUB_JOB: '', GITHUB_RUN_ID: '',
      INDEXING_APPROVED_SHA: '0000000000000000000000000000000000000000' },
    timeout: 8000,
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Production releases require the approved GitHub production workflow/);
});
