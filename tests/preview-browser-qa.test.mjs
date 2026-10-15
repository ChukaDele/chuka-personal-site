import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const command=fileURLToPath(new URL('../scripts/preview-browser-qa.mjs', import.meta.url));
const probe=env=>spawnSync(process.execPath,[command],{
  cwd:fileURLToPath(new URL('..', import.meta.url)),
  env:{...process.env,...env},
  encoding:'utf8',
  timeout:8000,
});

test('refuses to execute browser QA without a deliberate exact preview URL and release SHA',()=>{
  const result=probe({PREVIEW_URL:'',EXPECTED_SHA:''});
  assert.notEqual(result.status,0);
  assert.match(result.stderr,/Set PREVIEW_URL and EXPECTED_SHA/);
});
test('refuses localhost, HTTP and off-domain previews before opening any browser',()=>{
  for(const url of [
    'http://localhost:3000/',
    'https://localhost/',
    'https://chukadele.com/',
    'http://chuka-personal-site-atelier-v1.thebredge.workers.dev/',
    'https://chuka-personal-site-atelier-v1.thebredge.workers.dev.evil.com/',
  ]){
    const result=probe({PREVIEW_URL:url,EXPECTED_SHA:'0'.repeat(40)});
    assert.notEqual(result.status,0,url);
    assert.match(result.stderr,/canonical HTTPS Cloudflare preview/);
  }
});
test('rejects non-exact SHA before any browser or network call',()=>{
  const url='https://chuka-personal-site-atelier-v1.thebredge.workers.dev/';
  for(const sha of ['abc','1234567','0'.repeat(39),'Z'.repeat(40)]){
    const result=probe({PREVIEW_URL:url,EXPECTED_SHA:sha});
    assert.notEqual(result.status,0,sha);
    assert.match(result.stderr,/EXPECTED_SHA must be a full release SHA/);
  }
});
