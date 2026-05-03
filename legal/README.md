# Legal documents

Public-facing copies of the privacy policy and terms of service. App Store Connect requires a publicly hosted URL for both — host these as static pages and link them in App Store Connect under **App Information → Privacy Policy URL** and **License Agreement** (or include the terms URL in the app description).

## Hosting options

- **GitHub Pages**: Easiest. Push these files under a repo with Pages enabled, point at `https://<user>.github.io/<repo>/privacy` and `/terms`.
- **Vercel / Netlify**: Drop them into a tiny static site, get a custom domain like `nutrigeo.ge/privacy`.
- **Cloudflare Pages**: Same idea, free tier.

## Keeping the in-app and hosted copies in sync

The in-app screens (`app/profile/privacy.tsx` and `app/profile/terms.tsx`) read from `i18n/locales/{en,ka}.json`. When you change one, change the other. Bump the `legal.lastUpdatedDate` and `legal.effectiveFromDate` keys in both locale files, and update the dates at the top of `privacy.md` / `terms.md`.

## Translation

A Georgian translation of these documents is needed for users in Georgia. See `i18n/locales/ka.json` (`privacy.*` and `terms.*` keys) for the canonical Georgian text used in the app. Mirror those into `privacy.ka.md` / `terms.ka.md` once the public site supports language switching.
