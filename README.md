# Novye Vysoka — English edition

Independent English copy of the latest published Russian site, created on 19 November 2026.

- English website: https://kcska18051-crypto.github.io/novye-vysoka-en/
- English repository: https://github.com/kcska18051-crypto/novye-vysoka-en
- Working branch: codex/english; site files: dist/.
- GitHub Pages branch: codex/pages; the contents of dist/ are at the branch root.
- Russian source: kcska18051-crypto/novye-vysoka-design, codex/design c2516d796b47fd7a633923592bf299eef906f7ab.
- Published Russian source: codex/pages 729847d0ba627d3d57ccbc39a635258334049104. Its root tree exactly matches the source dist/ tree dc4455d0f9cf1e2e4aadc857ce7de77eec9dcc9a.

The English edition translates the page, navigation, forms, validation, runtime messages, accessibility text, neighbourhood and route information, map captions, wordmark and downloadable PDFs. All original photographs and recordings, routes, prices in roubles, dates, contact details, factual caveats and neighbourhood scope are preserved. A sotka is explained as 100 m²; no currency conversion is applied.

The original Russian audio and speech, actual signs photographed on location, incidental labels in the original location basemap and external third-party websites remain in their source language. Original Russian PDF documents and source artwork are retained locally for reference and are excluded from the public repository.

Forms are demonstrations and do not send or store enquiries. Both accept international phone numbers with a leading plus and country code. A success state is shown only after a future backend dispatches the lead:success event. The source user-agreement link remains a placeholder.

## Local preview and checks

Run node server.cjs, then open http://127.0.0.1:4174/. PORT can override the preview port.

Run node --test tests/*.test.cjs for data, translation and international phone checks. The original outdated Russian copy snapshots were replaced by checks against the captured source facts, routes and map geometry in tests/fixtures/russian-source-contract.json.

Run node tools/verify-english-browser.cjs for responsive browser checks. It uses Playwright from the Codex bundled Node runtime; CHECK_URL overrides the default http://127.0.0.1:4181/. CHECK_WIDTHS can select comma-separated widths. Screenshots and results go under tmp/english-browser-qa/.

The Russian and Chinese sites are separate repositories and were not changed by this work.
