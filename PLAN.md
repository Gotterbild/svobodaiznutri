# Svobodaiznutri.ru Migration Plan

## Decisions (2026-10-09)

- Domain: the archive is published at **svobodaiznutri.com** (not .ru); `.ru` will redirect to `.com` (later, see 15).
  Links in comments to the .ru domain are rewritten to .com. The contact email will be replaced by a new one (see 15).

- Engine: same as pashadolgopishet — Eleventy 2.x, PDP project structure and config.
- Design: keep the WordPress design (templates/CSS from `src/`, originally from `_sources/theme/`).
- Pagination: 7 posts per page, 11 pages, `/page/N/` URLs (as on WordPress). Post URLs `/slug/`.
- Posts base: the 73 posts in `src/posts/` + the 5 missing published posts from `_sources/md/posts/`
  (kupolny-dom-svoimi-rukami-i-minimalnymi-sredstvami,
  novye-vozmozhnosti-i-bolshoy-surpriz, svoboda-iznutri-vozvraschaetsya, new-design-2016) = 77 posts (podderzhat-svobodu-iznutri dropped, see below).
- The 3 never-published WP posts (novyj-dizajn-bloga, novosti-mobilnaya-versiya, novyj-adres-sajta): keep as drafts, not published.
- Archive mode (no dynamic features): no comment form, no subscription/contact forms. In place of the comment form:
  "Сайт заархивирован. Отправка комментариев отключена". Old comments are shown read-only.
- Site-wide archive banner under the header: "Сайт находится в архиве и больше не обновляется."
- URLs of all kept posts and pages must stay exactly the same as on WordPress.
- Pages: keep only `/kniga-kak-realizovyvat-mechty/` — with a direct PDF download instead of the subscription form
  (PDF to be provided by the user). Same PDF link replaces the form in post `/kak-realizovyvat-mechty-kniga/`.
  Drop: otpiska, vy-podtverdili-podpisku, kontakty, home, o-nas, podderzhka, spasibo.
- Drop post `podderzhat-svobodu-iznutri` (donations) → 77 published posts = 11 pages × 7.
- Hide 4 posts whose only content was a now-private YouTube video → 73 published posts, still 11 pages.
- Remove subscribe calls-to-action sentences from post text (e.g. sohataya-chudo-pech, kak-realizovyvat-mechty-kniga).
- Third-party: keep Yandex.Metrika counter (remove footer informer badge), keep YouTube embeds,
  remove VK group widget and the footer VK link.
- Dec 2013 posts: use the original WordPress dates (Dec 29–30) from `_sources/c.WordPress.2021-05-30.xml`, not the 2021 dates (Dec 22–31).

## 1–4. Setup, templates, posts, listing — DONE (2026-10-09)

- [x] Eleventy 2.0.1 (as PDP), `eleventy.config.js` + `eleventy.config.drafts.js` from PDP. Old `.eleventy.js` is still
      present, so npm scripts pass `--config=eleventy.config.js` (drop the flag once `src/` and `.eleventy.js` are removed).
- [x] Dependencies trimmed to eleventy, eleventy-plugin-rss, luxon (postcss toolchain and html-minifier dropped; CSS is plain).
- [x] Structure: `content/`, `_includes/`, `_data/`, `public/` (static assets, js, css from `src/`).
- [x] Layouts: `layouts/base.njk` (header, archive banner, sidebar, footer, Yandex.Metrika), `layouts/post.njk`,
      `layouts/page.njk`; includes `postslist.njk`, `pagination.njk`, `comments.njk`, `archive-comments-closed.njk`.
- [x] All posts migrated (not only test posts): 77 published + 3 drafts in `content/blog/YYYY/YYYY-MM-DD-slug/YYYY-MM-DD-slug.md`.
      Images stay in the post's `images/` subfolder (no path rewriting needed); `eleventy.after` hook copies them next to the page.
- [x] `date` set to the exact WordPress local publish time (fixes same-day ordering; 8 posts were off by one day).
      Date display matches WP: `dd.mm.yyyy`.
- [x] `posts` collection = glob `content/blog/**/*.md` (WP tags stay in `tags`, no "posts" tag mixed in).
- [x] Home + `/page/N/` listing, 7 per page, 11 pages, WP-style page numbers (`< 1 … 4 5 [6] 7 8 … 11 >`);
      `/page/1/` redirects to `/`. Verified: pages 1–2 match the WP HTML snapshot post-for-post, page 3 nav markup matches.
- [x] Verified: built post URLs == WP published post URLs (minus dropped `podderzhat-svobodu-iznutri`).

### Found during 1–4, to handle later
- GitHub workflow fixed: Node from `.nvmrc` (20), actions v4, `npm ci`, deploy `_site` to `gh-pages` on push to master.
- `/feed/` linked in `<head>` but not built yet — section 12.


## 5. Single Article Page — DONE (verified by user, 2026-10-09)

### 5.1 Verify post rendering
- [x] Test that post content renders correctly
- [x] Verify thumbnail displays
- [x] Verify metadata (date, categories, tags) displays
- [x] Test that images in content display correctly
- [x] Verify READMORE is not shown on single post page

### 5.2 Test navigation
- [x] Verify previous/next post links work
- [x] Test that permalink URLs are correct
- [x] Test internal links between posts work

### 5.3 Verify sidebar
- [x] Test that sidebar renders
- [x] Test sidebar links work

### 5.4 Popular posts in sidebar
- [x] Identify or create list of popular posts in `_data/`
- [x] Add popular posts section to sidebar
- [x] Display post titles with links
- [x] Style according to existing design

## 6. Comments — DONE (2026-10-09)

- [x] `scripts/import_wp_comments.py` reads `_sources/c.WordPress.2021-05-30.xml` (full export; `comments.xml` lacks parent ids)
      and writes `<post>.11tydata.json` next to each post: 268 approved comments on 48 posts (1 unapproved skipped).
- [x] WordPress thread order and markup (depth-1..3, `bypostauthor`, `#id` anchor, date), no reply links.
- [x] "Сайт заархивирован. Отправка комментариев отключена" box under every post (in place of the form).
- [x] Verified: comment ids and order identical to the WP HTML snapshot on all 73 snapshot posts.
- [x] Footer VK link removed (user request).

## 7. Book Page — DONE (2026-10-09)

- [x] `/kniga-kak-realizovyvat-mechty/` (`content/pages/2014-09-16-kniga-kak-realizovyvat-mechty/`): text + cover,
      subscription form replaced by a direct PDF download.
- [x] PDF downloaded from the live site (it was a WP attachment, not in the exports):
      `Павел-Долгов.-Как-реализовывать-мечты.pdf` (42 pages). Also kept at its old URL
      `/wp-content/uploads/Павел-Долгов.-Как-реализовывать-мечты.pdf` (links in old subscriber emails).
- [x] Post `/kak-realizovyvat-mechty-kniga/`: subscription sections ("Улучшаем жизнь!", "Но и это ещё не всё!") + form
      replaced by the download link. `/sohataya-chudo-pech/`: subscribe paragraph + form removed.

## 8–9. Categories and tags — DONE (2026-10-09)

- [x] `/category/<slug>/` and `/tag/<slug>/` with `/page/N/`, 7 per page, same pager as home
      (collections `categoryPages`/`tagPages` in `eleventy.config.js`, templates `content/category.njk`, `content/tag.njk`).
- [x] Category names/descriptions from WP export in `_data/categoryInfo.js` (incl. `news`, not in the menu).
- [x] Verified against WP snapshot: all category and tag listing pages identical post-for-post.
      Not rebuilt on purpose: `/tag/novosti/page/2/` (only held the dropped donation post), `/tag/s/` (typo tag removed in 2021).

### Header and VK (user requests, 2026-10-09)
- [x] Header: no inline menu; burger button at all widths, menu (all items) in the dropdown.
- [x] All mentions of VK groups removed: footer link, VK bullet in `/new-design-2016/`,
      music group line in `/zdravstvuite-dorogie-chitateli/`, comments 9443/9445/9446 on `/fire/` (see `EXCLUDED_COMMENTS`).
      Kept: links to third-party VK pages (`/kupolny-dom-…/`, `/planirovka-3-nash-metod/` + one comment there),
      Email kept. Personal VK (account deleted) removed too: "вКонтакте" dropped from 3 sentences
      (`/pochemu-ya-pereehal-iz-goroda-na-zemlu/` ×2, `/zdravstvuite-dorogie-chitateli/`).

## 10. Images — DONE (2026-10-09)

- [x] 17 missing WP thumbnails (`-300x225` etc., 404 on the live site too) regenerated from originals in `_sources/html/wp-content/`;
      3 images referenced via `/wp-content/uploads/2013/12/` copied into their posts.
- [x] Links around images removed (they led to `/wp-content/...` → 404), incl. 6 links to blogspot copies.
- [x] Photo galleries restored from the WP export: 14 galleries / 48 photos in 9 posts, as `<div class="gal">` thumbnails
      with `data-full` full-size copies; built-in lightbox in `public/js/script.js` (prev/next, Esc, arrows, caption).
- [x] PDFs linked from posts copied next to the posts (`pochemu-ya-pereehal-…`, `vybor-uchastka-…`); drawing link in
      `chertyozh-pechi-…` points to a local copy; broken tmall link got `https://` (was broken on WP too).
- [x] 2 unrecoverable images removed (user decision): table in `/idealniy-razmer-doma/`, picture in
      `/pochemu-ya-pereehal-iz-goroda-na-zemlu/` (surrounding text still refers to them).
- [x] 41 small in-post thumbnails (≤320px, were click-to-enlarge on WP) replaced with originals scaled to max 960px wide,
      in 9 posts; in-post images capped at 80vh height and centred.
- [x] Click-to-enlarge for single images: full-resolution originals for 30 images in `images/full/`
      (`fullResImages` transform adds `data-full`); any image shown scaled down also opens in the lightbox.
- [x] 6 images that never rendered (straight quotes inside captions) fixed: quotes → «».
- [x] Sentences referring to the 2 removed images reworded.

## 10a. Text and link fixes (2026-10-09)

- [x] Broken italics: quote in `/glina-i-glinobeton/` de-italicised, `Плюсы_:_` in `/likbez-po-tehnologiam-ekostroitelstva/`.
- [x] "Поделиться статьёй … кнопочки ниже" removed (`/glina-i-glinobeton/`; share buttons don't exist anymore).
- [x] Dead Google Sites "(читать онлайн, скачать)" links removed, book titles kept
      (`/glina-i-glinobeton/`, `/kak-sdelat-chudo-pech-1-podgotovka/`, `/iz-chego-stroit-steny-ekodoma/`).
- [x] All 62 external links checked. Dead ones unlinked or the sentence trimmed: bibl.at.ua, dokumentika.org,
      mirodolie.ru (×2), sandbaghouse.com, ecology.md, stroiteli.info, goandsee.ru, maps.rosreestr.ru,
      7 unavailable YouTube videos; in comments (via `scripts/import_wp_comments.py`): mirtesen link unlinked,
      `/page/14/` → `/page/11/`.
- [ ] Kept, uncertain: mirtv.ru homepage (403 to bots), ozzyzello.livejournal.com (redirects to login).
- [x] 4 posts whose embedded YouTube video became private are hidden (`draft: true`, user decision):
      `/stroim-iz-meshkov-video/`, `/tyaga-nashey-pechki/`, `/gorodskie-istorii-tri-holma/`,
      `/gorodskie-istorii-odin-den-v-rostovgrade/`. No other page links to them. Site: 73 posts, 11 pages.
- mirtv.ru: not the only content of any article. Dead programme link: "Дополнение 10.06.2014" paragraph removed from
  `/zachem-ya-zakruglil-svoy-dom/` (user confirmed). Channel homepage link in `/kosmicheskie-korabli-…/` kept.

## 11. URL Verification — DONE (2026-10-09)

- [x] Every WordPress URL checked against the build (posts, pages, categories, tags, listing pages, feed):
      73 posts, book page, 21 category/tag pages, 29 listing pages and `/feed/` exist at the same URLs.
- [x] Missing on purpose (decisions above): 7 dropped pages, `podderzhat-svobodu-iznutri`, 4 hidden video posts,
      `/tag/s/`, `/tag/novosti/page/2/`, `/page/12/`, and the last listing page of `eko-myshlenie` (p.3),
      `eko-stroitelstvo` (p.10), `budni` (p.4), `otoplenie` tag (p.3) — fewer posts now; listing page numbers may differ.
- [x] Internal links: no broken internal links/images in the built site; absolute self-links only in comments (valid).

## 12. RSS Feed — DONE (2026-10-09)

- [x] Atom feed (as PDP) with all 77 posts, full content, absolute URLs: `/feed/feed.xml`,
      same feed also at `/feed/index.html` so the old WordPress URL `/feed/` keeps working on GitHub Pages.
- [x] `<link rel="alternate">` in `<head>`. No JSON feed (not needed for an archive).

## 13. Additional Features — DONE (2026-10-09)

- [x] 404 page (`content/404.md`), sitemap + robots.txt.
- [x] Archive banner on every page (61 listing pages, 73 posts, book, 404); comments-closed notice on every post.

## 14. Testing and Verification — DONE (2026-10-09)

- [x] Clean build, no errors/warnings; simulated CI checkout (without gitignored `_sources/`) → `npm ci` + build
      produces an identical `_site`.
- [x] Phone width (375px) checked for home, post with gallery, book page; desktop compared with the live WP site.
- [x] Works without JavaScript: `<noscript>` shows the menu expanded (burger needs JS); images and galleries visible.
- [x] Post images get `loading="lazy"`; heaviest page ≈2.6 MB of images; gallery/full-size originals load only on click.

## 15. Go-live — READY, scheduled by the user for another day

Prepared:
- [x] Workflow `.github/workflows/build.yml` (Node from `.nvmrc`, `npm ci`, `npm run build-ghpages`, publish `_site`
      to `gh-pages` on push to `master`), `content/CNAME` = `svobodaiznutri.com`.
- [x] Site URL `.com` everywhere it matters (canonical, Open Graph, feed, sitemap, robots.txt, comment links).

To do (user):
- [ ] Push to `master`, check the Actions run is green (it creates the `gh-pages` branch).
- [ ] Enable GitHub Pages on the repo (not enabled yet): Settings → Pages → source = branch `gh-pages`, `/ (root)`;
      custom domain `svobodaiznutri.com`; Enforce HTTPS once the certificate is issued.
- [ ] DNS for `svobodaiznutri.com`: A records 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153;
      `www` CNAME → `gotterbild.github.io`. (The preview URL `gotterbild.github.io/svobodaiznutri/` won't render
      correctly — root-absolute paths — check locally with `npm start` instead.)
- [ ] Check on `https://svobodaiznutri.com`: a few posts, `/feed/`, `/kniga-kak-realizovyvat-mechty/` and its PDF, 404 page.
- [ ] Redirect `svobodaiznutri.ru` → `svobodaiznutri.com` (permanent 301, keeping the path, e.g. registrar URL forwarding).
      All post URLs are unchanged, so old links, search results, `/feed/` subscriptions and the book PDF link in old
      subscriber emails (`/wp-content/uploads/Павел-Долгов.-Как-реализовывать-мечты.pdf`) keep working through it.
- [ ] New contact email (to be chosen): replace `paveldolgov@svobodaiznutri.ru` in `/new-design-2016/`
      (`content/blog/2016/2016-03-06-new-design-2016/`) — the only place it appears on the site.
- Note: a reader's email (`el.grineva@yandex.ru`) is in one of the comments, as it was on WordPress; remove if preferred.
- Note: GitHub Pages serves `/feed/` as `text/html` (the content is Atom XML); feed readers handle it.

## 16. Cleanup — POSTPONED (do after the site is live and verified)

### 16.1 Remove from the repo
- [ ] `src/` — old 2021 Eleventy 0.12 site; all content is migrated to `content/` (posts, images; pages still pending: book)
- [ ] `.eleventy.js` — old config; then drop `--config=eleventy.config.js` from npm scripts
- [ ] `postcss.config.js` — postcss is no longer used
- [ ] `.gitignore`: drop the `_example/` line (folder already removed)
- [ ] `PLAN.md` — once everything is done (or move the "Decisions" part into README)

### 16.2 Code leftovers — DONE (2026-10-09)
- [x] Unused WordPress-era CSS removed (subscription form, related posts, share widget, comment form inputs):
      50 selectors; screenshots of 6 pages (desktop + phone) pixel-identical before/after.
- [x] Commented-out jQuery code removed from `public/js/script.js`.

### 16.3 Outside the repo / not committed
- [ ] `../svobodaiznutri.ru_2/` (wp_to_md_converter + temp) — the export is done, the result is in `_sources/md`
- [ ] `_sources/подписчики.csv` — newsletter subscribers' emails (personal data); delete unless you need it
- [ ] `_sources/comments.xml` — subset of `c.WordPress.2021-05-30.xml`, not used by any script
- Keep: `_sources/c.WordPress.2021-05-30.xml` and `_sources/html/` (used by `scripts/import_wp_comments.py` and as image source)

### 16.4 Documentation — DONE (2026-10-09)
- [x] README.md rewritten: commands, deploy, structure, where decisions live.
