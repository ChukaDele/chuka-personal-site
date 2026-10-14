# Website QA release-candidate evidence report

Report date: 14 October 2026.

Candidate source baseline: `c9dc575f3d1349d4a0c90fd66d21a1750e8f31c4`, confirmed as the starting worktree HEAD and the production `X-Deploy-SHA` supplied for this pilot.

Current implementation state: uncommitted working tree. No immutable release-candidate SHA exists yet. Evidence generated against the starting SHA would become stale after these changes are committed.

## Decision

`CLOSEOUT_BLOCKED` and `ENFORCEMENT_PARTIAL`.

The pilot contains an executable local and CI quality gate. Independent review is `PENDING`. Owner acceptance is `NOT_TESTED`. GitHub required checks, authenticated approvals and Cloudflare deployment protections were not inspected or changed. No deployment, merge or publication occurred.

## Evidence boundary

| Evidence item | Current state | What it proves |
| --- | --- | --- |
| Local source and build checks | `AUTOMATED_PASS` on the uncommitted working tree | Both indexing modes, 43 Node tests, syntax checks, whitespace checks and a zero-high dependency audit passed locally |
| Local Chromium suite | `AUTOMATED_PASS`, 52 passed and 5 intentional duplicate-project skips | Browser behavior passed at 1440 by 900, 390 by 844 and 1280 by 720 through the local Worker |
| Production live smoke | `LIVE_SHA_SMOKE_PASS` for `c9dc575f3d1349d4a0c90fd66d21a1750e8f31c4` | The live Worker returned that exact header and the checked responses matched current source expectations across 13 HTML routes and 13 OG assets |
| Wrong-SHA negative smoke | `EXPECTED_FAIL`, exit code 1 | An all-zero supplied SHA cannot produce a passing live-smoke result |
| Independent reviewer | `PENDING` | Nothing until a distinct reviewer records evidence |
| Owner acceptance | `NOT_TESTED` | A green automated check cannot supply this decision |
| Required GitHub check | `NOT_TESTED` | A workflow file does not prove branch-rule enforcement |
| Cloudflare deployment protection | `NOT_TESTED` | Source code cannot prove host-side protection |

## Observed transient during validation

One intermediate aggregate run failed during the mobile keyboard journey with a stackless `SyntaxError: Unexpected end of JSON input` while Playwright was waiting for the ETAP URL. The trace showed that the ETAP document had loaded. Five focused repetitions then passed. The test now pairs each Enter-key activation with an explicit load-complete URL wait. The final full `npm run qa:site` run passed. No website runtime code was changed for this ungrounded transient.

## 47-control default

Run `npm run qa:evidence -- <release-sha> <external-output.json>` after an immutable candidate exists. The generated file includes every R01-R19 and X01-X28 control. Missing evidence defaults to `NOT_TESTED`. Prelaunch, live and closeout approvals also default to `NOT_TESTED`.

Automated results may later support individual controls. They must not be copied into `PASS` without a release-SHA-bound artifact, a distinct reviewer where required and authenticated owner acceptance where required. Conditional controls need an independent applicability decision. Universal P0 and P1 controls cannot disappear through a local assumption.

The production smoke applies to the existing live baseline. It does not validate the uncommitted QA implementation as deployed. The browser pass applies to the local working tree. These evidence scopes must remain separate.
