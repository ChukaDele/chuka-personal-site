# SEO baseline: 4 October 2026

## Confirmed Search Console state
- Active property: https://chukadele.com/ (URL-prefix). The property selector showed no chukadele.com Domain property.
- Homepage URL Inspection: URL is on Google; Page is indexed.
- Last crawl displayed: Oct 4, 2026, 2:25:43 PM. UI timezone was not independently verified.
- Crawled as Googlebot smartphone. Crawl allowed: Yes. Page fetch: Successful. Indexing allowed: Yes.
- User-declared canonical: https://chukadele.com/. Google-selected canonical: Inspected URL.
- Sitemap /sitemap.xml: submitted and last read Oct 4, 2026; Success; 12 discovered pages.
- Overview Performance and Indexing reports still processing data. Sitewide indexed count, impressions, clicks, CTR and average position are not yet available.
- Public search returned the homepage and subpages in one search engine, while another returned none. These searches do not establish Google coverage.

## Public baseline
Checked deployed SHA 56095c9f6b3f1ad4de3932990ecdd07b0c3d1d1e.
All 12 sitemap URLs returned HTTP 200, self-referencing canonical URLs and no blocking meta/header noindex.
robots.txt returned 200, Allow: / and the canonical sitemap URL. sitemap.xml returned 200 XML with 12 canonical URLs.
Notes returned 200 with noindex in both HTML and headers and was excluded from sitemap, as required by project guidance.
A deliberately missing URL returned real 404 and noindex.
Extensionless /about redirected 308 to /about.html; /index.html redirected 308 to /.
HTTPS www redirected 301 to HTTPS apex. HTTP apex and HTTP www served 200 with noindex rather than redirecting.
Each checked page had identical title Chuka Dele and description Chukwuka Dele-Oyeleru.
Server-rendered navigation links connect the general pages; the homepage links all six cases. No sitemap page is orphaned from the homepage.
JSON-LD already supplies Person, WebSite and WebPage, with ProfilePage/mainEntity on About and a public LinkedIn sameAs link.

## Priority actions
1. Add DNS-verified Domain property chukadele.com to cover all protocols/subdomains, retaining the existing URL-prefix property. Requires authenticated DNS access; no DNS connector is available here.
2. Release route-specific title/description metadata and the brand alternateName relationship in this change.
3. Release the known public host HTTP/www redirects, preserving path and query. Recheck HTTP URLs after deployment because edge rules may run before the Worker.
4. Retain canonical .html paths, current sitemap and robots. Sitemap has already been submitted successfully; no duplicate submission is needed.
5. Use Chuka Dele consistently as the public brand. Retain the legal name and longer familiar name as identity aliases. A future visible About sentence can say: "I’m Chukwuka Dele-Oyeleru, known as Chuka Dele." Add only confirmed social profile URLs to sameAs; no guessed handles.
6. When Search Console finishes processing, record sitewide indexed/excluded counts and exclusion reasons, plus a 28-day Performance baseline. Track Chuka Dele, Chukwuka Dele-Oyeleru and chukadele.com queries separately. Do not treat unavailable data as zero.
7. Keep Notes excluded until its content is reviewed. Publish useful case studies and original writing with contextual links as they become ready.

## Changes and release
Route-specific existing contextual descriptions replace the one-name-only descriptions. Titles use the short public brand. OG/Twitter and JSON-LD webpage metadata follow the same registry.
Person.name retains the full name; alternateName links Chuka Dele and Chuka Dele-Oyeleru.
Known HTTP/www public origins redirect permanently to https://chukadele.com. Preview origins remain isolated and noindex.
No biography, outcomes, assets, dependencies, DNS or account permissions changed.

Production and preview builds each passed 14 tests. Lint and diff checks passed. Build warnings remain for the existing drawn/paper image references and a large JavaScript chunk; performance remediation is separate from this indexing fix.
Independent adversarial review confirmed the metadata approach and identified the release indexing trap.
No production deployment has been performed from this session: authenticated Cloudflare deployment access is unavailable.
Release the exact reviewed commit using deploy:enable-indexing, never plain deploy, which intentionally disables indexing.
After deployment verify title, description, alternateName, HTTP redirects, robots, 12 sitemap URLs, Notes exclusion and X-Deploy-SHA. Request homepage/About recrawl after the new metadata is live.

## References
- https://support.google.com/webmasters/answer/34592
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
