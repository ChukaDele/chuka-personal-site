# Deployment

## Targets

- Repository: `https://github.com/ChukaDele/chuka-personal-site`
- Working branch: `atelier-v1`
- Preview Worker: `chuka-personal-site-atelier-v1`
- Production branch: `main`
- Production Worker: `chuka-personal-site`

Cloudflare uses the generated vinext Worker configuration at `dist/server/wrangler.json`. `npm run deploy:preview` publishes the isolated preview Worker. `npm run deploy` publishes production and must run only from an accepted `main` revision. Both commands inject the current Git SHA. The Worker returns it as `X-Deploy-SHA` so browser acceptance can be bound to the actual runtime.

Search indexing is default-deny. Preview deployments omit `SITE_URL` and `ALLOW_INDEXING`, so the Worker sends `X-Robots-Tag: noindex, nofollow`, metadata omits canonical URLs, `robots.txt` disallows crawling and the sitemap is empty. Production may become indexable only when both build-time and runtime environments receive the same verified HTTPS `SITE_URL` and `ALLOW_INDEXING=true`. The runtime also requires the request hostname to match `SITE_URL` exactly.

## Release gate

1. `npm run lint`
2. `npm run test`
3. `npm run diff-check`
4. Push the exact working revision.
5. Deploy that revision to the isolated Cloudflare preview Worker.
6. Confirm `X-Deploy-SHA` exactly matches `git rev-parse HEAD`; a query parameter is not deployment provenance.
7. Run `major web preflight` against the HTTPS Cloudflare preview and GitHub repository.
8. Run responsive, keyboard, reduced-motion, reverse-scroll, network and console QA on the remote preview.
9. Repair P0 and P1 findings and repeat the preview gate.
10. Verify the production domain, contact route, résumé and final content before enabling indexing.
11. Supply the same `SITE_URL` and `ALLOW_INDEXING=true` values to the build and Worker runtime.
12. Fast-forward `main`, publish the production Worker and verify the exact deployed SHA, canonical URLs, sitemap and indexing headers.

A successful build or deploy log is not acceptance evidence. Browser behavior on the exact remote revision is required.
