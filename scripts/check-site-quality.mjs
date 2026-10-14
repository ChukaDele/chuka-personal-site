#!/usr/bin/env node
// Rendered-site quality check. Browser and runtime Worker checks are separate.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { indexablePaths, redirects, origin } from '../src/data/routes.js';

const root = resolve(process.cwd(), 'dist');
const decode = text => String(text ?? '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const tags = (html, tag) =>
  [...html.matchAll(new RegExp('<' + tag + '\\b[^>]*>', 'gi'))].map(match => match[0]);
function attribute(tag, name) {
  const match = tag.match(new RegExp("\\b" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)')", 'i'));
  return decode(match ? match[1] ?? match[2] : '');
}
function metaValue(head, property, value) {
  const tag = tags(head, 'meta').find(t => attribute(t, property).toLowerCase() === value.toLowerCase());
  return tag ? attribute(tag, 'content') : '';
}
function fileFor(dist, route) {
  return join(dist, route === '/' ? 'index.html' : route.replace(/^\//, ''));
}
export function checkPage(route, html, dist = root) {
  const errors = [];
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  if (!head) errors.push('Missing head element');
  if (!/<html\b[^>]*\blang=["']en(?:-GB)?["']/i.test(html)) errors.push('Missing document language');
  if (!metaValue(head, 'name', 'viewport')) errors.push('Missing viewport');
  const title = decode(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim();
  const description = metaValue(head, 'name', 'description');
  const indexable = indexablePaths.includes(route);
  if (!title || (indexable && title.length < 12)) errors.push('Missing or short page title');
  if (!description || (indexable && description.length < 30)) errors.push('Missing or short meta description');
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) errors.push('Expected exactly one H1, found ' + h1Count);
  const canonicals = tags(head, 'link').filter(t => attribute(t, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
  if (indexable) {
    if (canonicals.length !== 1 || attribute(canonicals[0], 'href') !== new URL(route, origin).href)
      errors.push('Missing/incorrect self-canonical');
    for (const [p, v] of [['property', 'og:image'], ['property', 'og:title'], ['name', 'twitter:card']]) {
      if (!metaValue(head, p, v)) errors.push('Missing social metadata: ' + v);
    }
  }
  const robots = metaValue(head, 'name', 'robots');
  if (indexable && /noindex|none/i.test(robots)) errors.push('Indexable page has noindex');
  if (!indexable && !/noindex/i.test(robots)) errors.push('Restricted page missing noindex');

  for (const img of tags(html, 'img')) {
    if (!/\balt\s*=/.test(img)) errors.push('Image missing alt attribute');
    if (!attribute(img, 'src') && !attribute(img, 'srcset')) errors.push('Image missing src/srcset');
  }
  let checkedUrls = 0;
  const seen = new Set();
  for (const tag of html.match(/<(?:a|img|source|video|audio|script|link)\b[^>]*>/gi) ?? []) {
    for (const key of ['href', 'src', 'poster']) {
      const raw = attribute(tag, key);
      if (!raw || raw.startsWith('#') || seen.has(key + ':' + raw) ||
        /^(?:mailto:|tel:|data:|javascript:|blob:)/i.test(raw)) continue;
      seen.add(key + ':' + raw);
      let url;
      try { url = new URL(raw, origin + '/'); }
      catch { errors.push('Malformed ' + key + ': ' + raw); continue; }
      if (url.origin !== origin) continue;
      let path;
      try { path = decodeURIComponent(url.pathname); }
      catch { errors.push('Invalid URL encoding: ' + raw); continue; }
      if (path.includes('\0') || path.includes('..')) { errors.push('Unsafe path: ' + raw); continue; }
      const file = fileFor(dist, path);
      const alternative = redirects[path] ? fileFor(dist, redirects[path]) : null;
      if (!existsSync(file) && !(alternative && existsSync(alternative)))
        errors.push('Broken internal ' + key + ': ' + raw);
      checkedUrls += 1;
    }
  }
  return { route, title, description, indexable, h1Count, checkedUrls, errors };
}
export function auditSite(dist = root) {
  const pages = [];
  const errors = [];
  for (const route of [...indexablePaths, '/notes.html', '/404.html']) {
    const file = fileFor(dist, route);
    if (!existsSync(file) || !statSync(file).isFile()) {
      errors.push(route + ': missing rendered HTML');
      continue;
    }
    const result = checkPage(route, readFileSync(file, 'utf8'), dist);
    pages.push(result);
    for (const issue of result.errors) errors.push(route + ': ' + issue);
  }
  if (pages.length !== 14) errors.push('Expected 14 static pages');
  const indexable = pages.filter(p => p.indexable);
  for (const field of ['title', 'description']) {
    if (new Set(indexable.map(p => p[field])).size !== indexable.length)
      errors.push('Duplicate indexable ' + field);
  }
  return { passed: errors.length === 0, pages: pages.length,
    indexable: indexable.length, internalUrls: pages.reduce((n, p) => n + p.checkedUrls, 0), errors };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = auditSite();
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
}
