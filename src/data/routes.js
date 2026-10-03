import { works } from './works.js';

export const origin = 'https://chukadele.com';
export const pages = {
  '/': ['Strategy and operations: diagnosing the problem, designing how the work should run, and building what it needs.', 'jerome-mono'],
  '/about.html': ['About Chuka Dele-Oyeleru and his approach to strategy and operations.', 'portrait-mono'],
  '/work.html': ['Selected strategy, operations and delivery work by Chuka Dele-Oyeleru.', 'weighing-mono'],
  '/library.html': ['Chuka Dele-Oyeleru’s library of books, essays, films and listening.', 'pacioli'],
  '/notes.html': ['Working notes by Chuka Dele-Oyeleru.', 'hoist'],
  '/press.html': ['Biographies, portraits and speaking information for Chuka Dele-Oyeleru.', 'portrait-press-mono'],
  '/resume.html': ['Chuka Dele-Oyeleru’s experience and qualifications in strategy and operations.', 'ledger'],
  ...Object.fromEntries(works.map(w => [`/work-${w.id}.html`, [w.brief[0], w.shot || 'weighing-mono']])),
};
export const indexablePaths = Object.keys(pages).filter(path => path !== '/notes.html');
export function canonicalPath(path) {
  if (path === '/' || path === '/index.html') return '/';
  return path.endsWith('.html') ? path : `${path.replace(/\/$/, '')}.html`;
}
export const redirects = {
  '/index.html': '/',
  '/index': '/',
  '/speaking': '/press.html',
  '/speaking.html': '/press.html',
  '/work/bredge': '/work-the-bredge.html',
  ...Object.fromEntries(Object.keys(pages).filter(p => p !== '/').map(p => [p.slice(0, -5), p])),
  ...Object.fromEntries(works.map(w => [`/work/${w.id}`, `/work-${w.id}.html`])),
};
