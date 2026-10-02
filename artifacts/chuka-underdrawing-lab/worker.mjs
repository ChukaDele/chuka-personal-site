export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = url.pathname === '/robots.txt'
      ? new Response('User-agent: *\nDisallow: /\n', {headers:{'Content-Type':'text/plain'}})
      : await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    headers.set('X-Deploy-SHA', env.DEPLOY_SHA || 'unbound-draft');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Cache-Control', /\.(jpg|woff2)$/.test(url.pathname) ? 'public, max-age=3600' : 'no-cache');
    return new Response(response.body, {status:response.status,statusText:response.statusText,headers});
  }
};
