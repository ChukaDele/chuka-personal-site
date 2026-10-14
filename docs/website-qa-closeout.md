# Website QA release-candidate evidence report

Report date: 14 October 2026.

Candidate source baseline: `c9dc575f3d1349d4a0c90fd66d21a1750e8f31c4`, confirmed as the starting worktree HEAD and the production `X-Deploy-SHA` supplied for this pilot.

Current implementation state: draft [GitHub PR #14](https://github.com/ChukaDele/chuka-personal-site/pull/14), containing source-only QA changes. The release candidate is the exact PR HEAD after the final approved commit; no production deployment of it has occurred. The live production baseline remains a different reviewed SHA.

## Decision

`CLOSEOUT_BLOCKED` and `ENFORCEMENT_PARTIAL`.

The pilot contains an executable local and CI quality gate, a deployed GitHub branch ruleset and a protected production environment. The first hosted PR #14 run passed `validate`, `secret-scan` and `site-quality`, while later changes require a new run. Independent approval remains `PENDING`, owner acceptance `NOT_TESTED`, and the new production workflow lacks a scoped Cloudflare credential. No production deployment or merge has occurred.

## Evidence boundary

| Evidence item | Current state | What it proves |
| --- | --- | --- |
| Local source and build checks | `AUTOMATED_PASS` on the uncommitted working tree | Both indexing modes, 43 Node tests, syntax checks, whitespace checks and a zero-high dependency audit passed locally |
| Local Chromium suite | `AUTOMATED_PASS`, 52 passed and 5 intentional duplicate-project skips | Browser behavior passed at 1440 by 900, 390 by 844 and 1280 by 720 through the local Worker |
| Production live smoke | `LIVE_SHA_SMOKE_PASS` for `c9dc575f3d1349d4a0c90fd66d21a1750e8f31c4` | The live Worker returned that exact header and the checked responses matched current source expectations across 13 HTML routes and 13 OG assets |
| Wrong-SHA negative smoke | `EXPECTED_FAIL`, exit code 1 | An all-zero supplied SHA cannot produce a passing live-smoke result |
| Independent reviewer | `PENDING` | Nothing until a distinct reviewer records evidence |
| Owner acceptance | `NOT_TESTED` | A green automated check cannot supply this decision |
| Required GitHub checks | `GITHUB_PR_PASS` on the previously tested commit | Hosted `validate`, `site-quality` and `secret-scan` passed; active ruleset 25099076 requires all three and one code-owner approval. New commits require retesting |
| Cloudflare deployment protection | `ENFORCEMENT_PARTIAL` | The protected production release workflow is prepared but untested, its token is missing, and broad local Wrangler OAuth is still active |

## Observed transient during validation

One intermediate aggregate run failed during the mobile keyboard journey with a stackless `SyntaxError: Unexpected end of JSON input` while Playwright was waiting for the ETAP URL. The trace showed that the ETAP document had loaded. Five focused repetitions then passed. The test now pairs each Enter-key activation with an explicit load-complete URL wait. The final full `npm run qa:site` run passed. No website runtime code was changed for this ungrounded transient.

## 47-control default

Run `npm run qa:evidence -- <release-sha> <external-output.json>` after an immutable candidate exists. The generated file includes every R01-R19 and X01-X28 control. Missing evidence defaults to `NOT_TESTED`. Prelaunch, live and closeout approvals also default to `NOT_TESTED`.

Automated results may later support individual controls. They must not be copied into `PASS` without a release-SHA-bound artifact, a distinct reviewer where required and authenticated owner acceptance where required. Conditional controls need an independent applicability decision. Universal P0 and P1 controls cannot disappear through a local assumption.

The production smoke applies to the existing live baseline. It does not validate the QA implementation as deployed. Browser evidence from the first PR run applies only to that exact CI candidate SHA. Evidence scopes must remain separate and every updated PR commit must run hosted checks again.
