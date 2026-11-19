# English copy — working rules

User requested a full independent English copy of the latest Russian site on 19 November 2026.
Source: novye-vysoka-design, codex/design c2516d796b47fd7a633923592bf299eef906f7ab; published codex/pages 729847d0ba627d3d57ccbc39a635258334049104.

- Work only in this independent clone, branch codex/english. Site source is dist/. New destination is novye-vysoka-en; Pages branch codex/pages contains dist at its root.
- russian-source is read-only; never push to it. Do not change the Russian or Chinese repositories.
- Translate all user-facing text, metadata, accessibility labels, dynamic states, vector/map labels and downloadable PDFs into natural English. Keep photographs, videos, filenames/IDs where practical, behaviour and layout.
- User instruction of 19 November 2026 supersedes editorial adaptation: translate as literally as English grammar permits from the latest Russian original. Preserve structure, formulation, sentence order, repetitions and caveats. Add no marketing copy or explanatory glosses. Existing international phone functionality stays.
- Preserve facts, numbers, dates, RUB prices, contact details, routes, caveats and four-neighbourhood scope. Four named map regions remain unchanged.
- Glossary: Novye Vysoka; Magazin Zemli; Vysokovsky Bor; Chyornaya Rechka (Black River); Degtyaritsy; Nikolo-Korma; Koprino; Yaroslavl; Rybinsk; Uglich. Use plot, neighbourhood, master plan. Use the Russian land-area term sotka in prices (per sotka); show 100 m² only in the unit tooltip. Use British English consistently.
- Forms remain demos, no automatic success without backend confirmation. Adapt phone entry to international numbers, following the already approved Chinese implementation.
- Do not modify speech in original recordings, physical signs in real photos or external websites. Document those boundaries.
- Before publication: test scripts, git diff --check, HTTP and console, desktop/mobile layouts, all galleries/routes/plans/forms. Render and inspect translated PDF output.

- User instruction 19 November 2026: retain the Russian unit sotka (Chinese 索特卡) in prices and areas; do not replace it with 100 m² in visible labels. 1 sotka remains 100 m²; no prices or numeric areas are changed.
