# Deploying the web app and its site

Palmas publishes to **https://www.dolcesfogato.com/palmas/** as two separate
uploads to two different directories. They are built differently, change at
different times, and neither is derived from the other — keeping them straight
is the whole content of this document.

| Source | Goes to | Built? |
|---|---|---|
| `website/` | `…/palmas/` | no — copied verbatim |
| `dist/pwa/` | `…/palmas/palmas_web/` | yes — `yarn build` |
| `deploy/robots.root.txt` | the **domain root**, as `robots.txt` | no — and shared |

Static hosting, no server-side anything. Deploy is a **manual upload of the
changed files via cPanel File Manager** (for a bulk change: zip → *Extract* in
place, then delete stale files). HTTPS only.

This document is in `docs/` rather than in `website/` on purpose: everything in
`website/` is served publicly, and deployment notes are not something to publish.

## 1. The site — `website/` → `…/palmas/`

Hand-written static HTML. There is no build step; what is in the directory is
what goes on the server, so nothing belongs there that should not be public.

- `index.html` — the landing page
- `privacy.html` — the privacy policy. **Apple requires a reachable privacy
  policy URL at submission**, and this is that URL.
- `sitemap.xml` — three URLs; see the comment inside it for why not more.

## 2. The app — `dist/pwa/` → `…/palmas/palmas_web/`

```bash
yarn build          # writes dist/pwa
```

Upload the *contents* of `dist/pwa/` into `palmas_web/`. The build is relative
to wherever it is served from, so it does not need to know the folder name — but
**it must be reached with a trailing slash**, `…/palmas/palmas_web/` rather than
`…/palmas/palmas_web`. Servers normally redirect to add it.

Delete stale files rather than uploading over the top. Asset filenames are
content-hashed, so old ones accumulate and are never referenced again.

### It is a Progressive Web App, which changes two things

`yarn build` produces `sw.js` and `manifest.json` beside `index.html`. The
service worker precaches the whole app, audio included, so it installs to a home
screen and runs with no network — which is what makes the web app a real answer
on Android, where the Play Store is not currently a route (see
[TODO.md](../TODO.md)).

- **`sw.js` and `manifest.json` must land in `palmas_web/` beside `index.html`,
  not anywhere above it.** A service worker can only control the directory it is
  served from, so one uploaded to the domain root would control the wrong tree
  and one left behind entirely leaves the app working but never installable.
- **Do not let the host cache `sw.js` for long.** The browser re-fetches it to
  discover a new version, so a long `max-age` on that one file is what makes a
  deploy fail to reach anyone. Everything else is content-hashed and can be
  cached hard.

The worker takes over on the next load rather than waiting for every tab to
close, so a visitor gets the new version the second time they open the app.
Nothing is pulled out from under a session already running.

## 3. The root robots.txt — by hand, and shared

`deploy/robots.root.txt` goes to `https://www.dolcesfogato.com/robots.txt`.

It is **shared with the other sites on this domain** and is not owned by Palmas.
`guitar_tap_website` keeps its own copy listing only its own sitemap; uploading
that one removes the Palmas line, and vice versa. The copy here lists both.
Check it names every sitemap on the domain before uploading either.

Only needed when the sitemap set changes, which is rarely.

## Checking a deploy

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.dolcesfogato.com/palmas/
curl -s -o /dev/null -w "%{http_code}\n" https://www.dolcesfogato.com/palmas/palmas_web/
curl -s -o /dev/null -w "%{http_code}\n" https://www.dolcesfogato.com/palmas/privacy.html
curl -s -o /dev/null -w "%{http_code}\n" https://www.dolcesfogato.com/palmas/sitemap.xml
```

All four should be `200`. A **403** on `…/palmas/` means the directory exists but
has no `index.html` — the site half was never uploaded. That is exactly what the
path returned before this directory existed.

## What goes stale

- The version badge in `README.md` and the landing page's feature list, if the
  app gains or loses something.
- `sitemap.xml` `lastmod` dates, when a page's content actually changes.
- The App Store card in `index.html` says "in preparation" — it needs a real
  link once the app is published. See
  [docs/store-listing.md](store-listing.md) for the names and identifiers it
  will be published under.
