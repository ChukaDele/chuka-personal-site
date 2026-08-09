# Deployment

The production target is Cloudflare Workers. The current official Cloudflare guidance supports Vite applications through the Cloudflare Vite plugin and Workers static assets.

## Release checklist

1. Authenticate the intended GitHub account and create the dedicated repository.
2. Push `main`, then a working branch such as `atelier-v1`.
3. Authenticate the intended Cloudflare account with Wrangler and create or connect the Worker.
4. Connect the repository in Cloudflare Workers Builds. Set `main` as production and enable preview URLs for non-production branches.
5. Run `npm run build` and `npm test` locally without a persistent server.
6. Use the generated branch URL for browser QA. Never use a local browser URL.
7. Promote accepted code through `main`, then open the returned `workers.dev` URL for production checks.

No custom domain is assumed. A `workers.dev` URL is the safe Phase 1 production endpoint until the owner chooses a domain.
