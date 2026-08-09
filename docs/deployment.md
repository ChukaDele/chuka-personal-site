# Deployment

## Targets

- Repository: `https://github.com/ChukaDele/chuka-personal-site`
- Working branch: `atelier-v1`
- Preview Worker: `chuka-personal-site-atelier-v1`
- Production branch: `main`
- Production Worker: `chuka-personal-site`

Cloudflare uses the generated vinext Worker configuration at `dist/server/wrangler.json`. `npm run deploy:preview` publishes the isolated preview Worker. `npm run deploy` publishes production and must run only from an accepted `main` revision.

## Release gate

1. `npm run lint`
2. `npm run test`
3. `npm run diff-check`
4. Push the exact working revision.
5. Deploy that revision to the isolated Cloudflare preview Worker.
6. Run `major web preflight` against the HTTPS Cloudflare preview and GitHub repository.
7. Run responsive, keyboard, reduced-motion, reverse-scroll, network and console QA on the remote preview.
8. Repair P0 and P1 findings and repeat the preview gate.
9. Fast-forward `main`, publish the production Worker and verify the exact deployed SHA.

A successful build or deploy log is not acceptance evidence. Browser behavior on the exact remote revision is required.
