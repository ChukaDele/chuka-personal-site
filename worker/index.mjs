import { origin, redirects, indexablePaths } from '../src/data/routes.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const indexable = env.ALLOW_INDEXING === 'true' && url.origin === origin;
    const finish = response => {
      const headers = new Headers(response.headers);
      headers.set('X-Deploy-SHA', env.DEPLOY_SHA || 'unconfigured');
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      headers.set('Content-Security-Policy', "frame-ancestors 'none'");
      headers.set('X-Frame-Options', 'DENY');
      headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      if (!indexable || url.pathname === '/notes.html' || response.status >= 400) headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(request.method === 'HEAD' ? null : response.body, { status: response.status, statusText: response.statusText, headers });
    };
    if (!/^[a-f0-9]{40}$/.test(env.DEPLOY_SHA || '')) {
      return finish(new Response('Deployment provenance is not configured.', { status: 503, headers: { 'Cache-Control': 'no-store' } }));
    }
    if (!['GET', 'HEAD'].includes(request.method)) return finish(new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } }));
    const redirect = redirects[url.pathname.replace(/\/$/, '')];
    if (redirect) return finish(new Response(null, { status: 308, headers: { Location: `${redirect}${url.search}`, 'Cache-Control': 'public, max-age=0, must-revalidate' } }));
    if (url.pathname === '/robots.txt') {
      return finish(new Response(indexable ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } }));
    }
    if (url.pathname === '/sitemap.xml') {
      return finish(new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable ? indexablePaths.map(path => `<url><loc>${origin}${path}</loc></url>`).join('') : ''}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' } }));
    }
    try {
      const assetUrl = new URL(request.url);
      if (assetUrl.pathname === '/') assetUrl.pathname = '/index.html';
      let response = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (response.status === 404 || url.pathname === '/404.html') {
        const missing = await env.ASSETS.fetch(new Request(new URL('/404.html', url), { method: request.method }));
        response = new Response(missing.body, { status: 404, headers: missing.headers });
      }
      const headers = new Headers(response.headers);
      if (url.pathname === '/' || headers.get('Content-Type')?.includes('text/html')) headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      return finish(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
    } catch {
      return finish(new Response('Temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } }));
    }
  },
};
