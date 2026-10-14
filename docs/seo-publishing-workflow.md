# Evidence-led SEO publishing workflow

Status: operational research and live technical preflight validated on 14 October 2026. A new article has **not** been published or approved, and no ranking, GSC traffic or LinkedIn reach result has been established.

## Source of truth and trigger

Canonical orchestration: `~/Projects/project-baracks/skills/internal/seo-os/SKILL.md`
Playbook: `~/Projects/project-baracks/skills/internal/seo-os/references/founder-led-search-experiment.md`
Runnable preflight: `~/Projects/project-baracks/scripts/seo-content-experiment.mjs`
Pilot input: `~/Projects/project-baracks/examples/seo-chukadele-surface-talent.json`

Use the same route when asked to grow organic search, research specific keywords, write articles based on actual work, test LinkedIn search distribution or make site content discoverable. The site remains primarily a Strategy & Operations portfolio. Research should make positioning more specific without changing that classification.

## Experiment operating procedure

1. Find an existing high-value question using GSC impressions and a documented UK search result, when data is available. If no GSC evidence exists, label the keyword as a hypothesis, not a verified opportunity.
2. Examine relevant pages and note search intent, weak coverage and competitor arguments. Record URLs, dates, the limitations of the evidence and any unverified SERP positions.
3. Use a public, owner-approved first-person case. No invented metrics, testimonials, client claims or fabricated anecdotes. Keep confidential material out of marketing artifacts.
4. Improve the relevant owned page before creating a new URL. Each indexable article must include sufficient helpful original material, contextual internal links, descriptive title, canonical, crawl permission and a meaningful contact/next-action path.
5. Prepare a distinct native LinkedIn article with a relevant link back to the owned page. Editorial and client clearance are mandatory before publishing.
6. Run the deterministic preflight, then publish only with approval. Manually inspect mobile rendering and internal/external links. Confirm HTTP 200, robots, canonical and sitemap membership. Search Console recrawl requests are allowed; do not use Google's restricted Indexing API for ordinary content.
7. Record actual published URLs and monitor GSC clicks, impressions, query/page positions, LinkedIn referrals and qualified enquiries after 7 and 30 days. Record unknowns rather than zeroes. Rank screenshots alone do not establish value.

## Proven dry run

From the Major repository:

```sh
node --test scripts/seo-content-experiment.test.mjs
node scripts/seo-content-experiment.mjs examples/seo-chukadele-surface-talent.json --live --out /tmp/major-seo-chukadele-20261014
```

Executed on 14 October 2026. Five deterministic tests passed. The live page `https://chukadele.com/work-surface-talent.html` returned HTTP 200, one title and H1, one matching canonical, no noindex, accessible robots and sitemap, with the page in the 12-URL sitemap. The generated package was `ready-for-editorial-review`, with no blocker on sourcing or public technical checks.

The sample query is a **hypothesis**: “CV parsing mistakes before candidate scoring”. The input contains two dated relevant source articles, not claimed measured top-ranked results. The firsthand input links to existing public Surface Talent case and notes pages. Owner/client approvals remain false. No new site article or LinkedIn article was published.

## Known boundaries

- The Notes page remains noindex under the existing content approval rule. Do not change it as a shortcut for the experiment.
- Google Search Console performance data has not been pulled into the runner; connecting it and measuring demand remains necessary.
- This checks the real deployed page; it does not establish whether Google currently indexes it, what position it ranks, or whether traffic converts.
- Changes to article content, social publishing and production website deployments must use existing site review and Cloudflare release safeguards.
- Google Search Central's current people-first and AI content guidance takes precedence over short-form SEO hacks: https://developers.google.com/search/docs/fundamentals/creating-helpful-content and https://developers.google.com/search/docs/fundamentals/using-gen-ai-content .

## Unpublished working drafts

Store draft article copy outside the public Git repository until the owner confirms editorial and any client approval. The current Surface Talent pilot is held in the owner-local private review directory ~/Documents/SEO-Pilot-Review/. A technical preflight or GitHub CI result does not permit public posting.
