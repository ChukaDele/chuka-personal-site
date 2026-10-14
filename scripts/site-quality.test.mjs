import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkPage, auditSite } from './check-site-quality.mjs';

const home = readFileSync('dist/index.html', 'utf8');
const about = readFileSync('dist/about.html', 'utf8');
const notes = readFileSync('dist/notes.html', 'utf8');

test('site quality gate passes the actual indexable site and protected routes', () => {
  const report = auditSite();
  assert.equal(report.pages, 14);
  assert.equal(report.indexable, 12);
  assert.equal(report.passed, true, report.errors.join('\n'));
  assert.ok(report.internalUrls > 100);
});

test('site quality gate rejects accidental public noindex', () => {
  const invalid = home.replace('<head>', '<head><meta name="robots" content="noindex">');
  assert.ok(checkPage('/', invalid).errors.some(e => e.includes('noindex')));
});

test('site quality gate rejects incorrect canonical and broken local hyperlinks', () => {
  const wrong = home.replace('rel="canonical" href="https://chukadele.com/"',
    'rel="canonical" href="https://chukadele.com/incorrect.html"');
  assert.ok(checkPage('/', wrong).errors.some(e => e.includes('canonical')));
  const broken = home.replace('</main>', '<a href="/missing-site-quality-qa-20261015.html">broken</a></main>');
  assert.ok(checkPage('/', broken).errors.some(e => e.includes('Broken internal')));
  const directoryLink = home.replace('</main>', '<a href="/img/">broken directory</a></main>');
  assert.ok(checkPage('/', directoryLink).errors.some(e => e.includes('Broken internal')));
});

test('site quality gate enforces image alt on rendered pages', () => {
  assert.equal(checkPage('/about.html', about).errors.length, 0);
  const invalid = about.replace(/(<img\b[^>]*?)\balt="[^"]*"/i, '$1');
  assert.ok(checkPage('/about.html', invalid).errors.some(e => e.includes('alt')));
});

test('case diagrams with mobile horizontal scrolling are keyboard focusable', () => {
  const surface = readFileSync('dist/work-surface-talent.html', 'utf8');
  const accessibleSketch = /<figure\b(?=[^>]*\bclass="sketch")(?=[^>]*\btabindex="0")[^>]*>/;
  assert.match(surface, accessibleSketch);
  const broken = surface.replace('<figure class="sketch" tabindex="0"', '<figure class="sketch"');
  assert.doesNotMatch(broken, accessibleSketch);
});

test('notes route stays noindex and validates other markup', () => {
  assert.equal(checkPage('/notes.html', notes).errors.length, 0);
  const exposed = notes.replace(/<meta name="robots" content="[^"]*"\s*\/?>/i, '');
  assert.ok(checkPage('/notes.html', exposed).errors.some(e => e.includes('missing noindex')));
});
