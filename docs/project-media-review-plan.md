# Project media review plan

Source review branch: `codex/project-updates-review-20261009`, based on main at `e1e8068`. Keep Strategy & Operations as the primary professional classification. Preserve the other five cases’ factual copy and approved assets unless a concrete source supports a correction.

## Surface copy and provenance

The owner selected **USE SUPPLIED OUTCOME, NO QUOTE**. The added outcome attributes to the client that the website generated Surface Talent’s first external inbound enquiry, which converted into an exclusive retainer. Its provenance is the owner’s supplied pasted outcome; it has not been independently verified against the original email. No testimonial quotation or gift mention/image is approved. The existing nonclaim remains: throughput was not measured, the hire is not credited to the software, and Chuka did not make the placement. The card keeps the scope tied to the existing CRM and the new website, without claiming greenfield conception or sole authorship.

PR6 is available locally at `origin/content/surface-talent-release-20261008`, exact commit `a9d2ab2f73a0709efe4c8fd2048a66e04b72bad4`. Its two-file diff matches `.launch-input/pr6-exact.diff` byte for byte. The verified reliability contribution, post-internship brief, **8 October 2026** release milestone and relevant regression test are integrated into the `184a32a` draft, preserving the supplied client-attributed outcome without a quote and the current `v=c-mark-v2` favicon tests. The internship dates remain **15 June–4 September 2026**; the **8 September** website handover and **8 October** post-internship application release remain separate events. This is local source integration only; PR6 has not been merged or published by this task.

## Owner-approved curated integration — 9 October 2026

Goal: d3ffd0fc-c9d8-43f6-8a75-20b4cb77929e. Implementation branch: codex/project-updates-review-20261009, clean baseline 72027c7ded8354880d103995aee52bbf7a54ce46.

The owner approved the recommended pack, then explicitly narrowed the main portfolio to the strongest work rather than a portfolio dump. This selection supersedes the broader selected_ids and older placement suggestions in the local approval receipts. Exact integrated whitelist: **S-I1 S-I2 H-I2 H-I3 H-V1 I-I1 I-V1 E-V1 B-I2 R-I2 R-V2**.

| Case | Curated placement |
| --- | --- |
| Surface Talent | S-I1 website homepage becomes the case hero. S-I2 replaces the older candidate capture. Both are public staging captures dated 9 October 2026, not production proof. Existing role/import captures retain their 22 September date. |
| HoneyCoin | H-I2 accounts/withdrawal and H-I3 funding/payment replace the older gallery; one H-V1 overview in Delivery. Existing hero remains for product context. Studio interface figures are not operating results. |
| Idara | I-I1 website/order interface becomes the hero; I-V1 service-entry motion in Service. Older gallery removed to avoid repetition. Chuka’s product/service leadership is distinct from studio authorship. |
| Rvysion | R-I2 Lateral Frontiers hero replaces Rayna imagery; a small Client part includes the full original R-V2 and reviewed poster. Approved role: “I led strategy and the project for the Lateral Frontiers rebrand and new website.” Studio designers and engineers receive design/build credit. Existing factual Rayna own-product narrative and results remain. |
| ETAP | Only E-V1, the approved 12-second excerpt from original 00:05 to 00:17, replaces the launch still. Credit identifies co-presentation with a colleague. Existing fleet and event evidence remain. |
| The Bredge | B-I2 problem illustration replaces the B-I1 hero carrying an unsupported engagement claim. Existing B-I3 sample remains, explicitly labelled illustrative figures, not client data or results. No new outcome claims. |

Do not integrate H-I1, I-I2, E-I1, E-I2, Voxtell, new Rayna media, alternates or a Bredge brand film. Future design explorations belong in a **separate playground**, not this main portfolio. That is local planning only: no new playground route or publishing is included here. No new quote or gift material is included.

## Provenance and rendering

The local approval receipts in .launch-input/approved-project-media and .launch-input/approved-lateral-media authorize the selected assets and destinations. [curated-media.json](curated-media.json) records each integrated ID, source, approved input SHA-256 and reviewed poster SHA-256 where applicable. Original downloads and receipts stay local.

Images follow the existing WebP/full-size plus 900px pattern with original aspect ratio and no crop. Posters use the reviewed frame with encoding conversion only (plus a responsive 900px derivative). All four MP4s are byte-for-byte copies of the approved files: no re-edit, re-encoding or new excerpt. The full Lateral film is approximately 40.8 MB; metadata preload and intentional native playback avoid autoplay downloads.

The existing Part case renderer accepts an optional video field, with native controls, playsinline, metadata preload, dimensions, accessible label, associated caption and fallback link. Videos start at a static poster for every motion preference, including reduced motion; playback requires intentional user action. Existing artwork, favicon and motion code are unchanged. No historical artwork was added.

## Validation and controller handoff

This is local source integration and a clean commit only. The controller owns resource leases and the **one exact-commit preview build** and subsequent browser/review checks. This worker must not use MajorCLI, acquire a build, compile, serve, browse, push, deploy or change production.

Run source checks with `node --test tests/curated-media.test.mjs`, relevant source-only regression checks, `npm run lint` and `GIT_CONFIG_GLOBAL=/dev/null git diff --check`. Source contracts and media hashes do not establish visual acceptance; responsive, accessibility, playback and reduced-motion browser review remain with the controller on the exact committed preview.

Worker validation: all four curated-media tests and the existing identity metadata and Surface release source regressions passed. The npm executable was unreadable in this environment; its five declared lint commands were run directly with `node --check`, plus checks of the changed data and test files. Whitespace checks passed. A source comparison against 72027c7 confirmed all pre-existing claim copy, roles, dates, results and narrative unchanged, excluding the explicitly changed media captions and added Lateral Client part. Every full-size WebP/poster was also compared byte-for-byte with an encoding-only conversion of its approved input. No compile, local server, browser, push or deployment was run.
