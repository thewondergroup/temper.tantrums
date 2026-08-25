# Temper Tantrums — pre-launch landing page

Single-file landing page for tempertantrums.co.uk (opening 30 September 2026).

- `index.html` — the whole site (CSS, JS and logos inlined)
- Hosted with GitHub Pages from the `main` branch

## Before launch
1. **Fonts** – Core Circus / Quarto / FS Albert are licensed. Add `@font-face` rules for the webfont files; the font stacks already list them first.
2. **Sign-up form** – currently a placeholder. Point the form `action` at the mailing provider's POST URL and remove the JS submit handler (see comment in `index.html`).
3. **Custom domain** – add a `CNAME` file containing `tempertantrums.co.uk` and point the domain's DNS at GitHub Pages.
