# Svobodaiznutri.ru Migration Plan

## Decisions (2026-10-09)

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
- [ ] Kept, uncertain: mirtv.ru (403 to bots), ozzyzello.livejournal.com (redirects to login).
- [ ] 4 embedded YouTube videos are now PRIVATE (show "Video unavailable"): `/stroim-iz-meshkov-video/`,
      `/tyaga-nashey-pechki/`, `/gorodskie-istorii-tri-holma/`, `/gorodskie-istorii-odin-den-v-rostovgrade/` — decision pending.

## 11. URL Verification

### 11.1 Verify article URLs
- [ ] Build site and generate list of all article URLs
- [ ] Compare with original WordPress URLs from `_sources/c.WordPress.2021-05-30.xml`
- [ ] Ensure permalinks match exactly
- [ ] Check that pagination URLs can differ (acceptable)
- [ ] Fix any mismatches

### 11.2 Verify page URLs
- [ ] Build site and generate list of all page URLs
- [ ] Compare with original WordPress page URLs
- [ ] Ensure book page URL matches original
- [ ] Fix any mismatches

### 11.3 Verify category and tag URLs
- [ ] Verify category URLs match `/category/{slug}/` pattern
- [ ] Verify tag URLs match `/tag/{slug}/` pattern
- [ ] Test that all category/tag links work

### 11.4 Test internal links
- [ ] Scan all markdown content for internal links
- [ ] Verify links point to correct URLs
- [ ] Update any broken internal links
- [ ] Test navigation between posts

## 12. RSS Feed — DONE (2026-10-09)

- [x] Atom feed (as PDP) with all 77 posts, full content, absolute URLs: `/feed/feed.xml`,
      same feed also at `/feed/index.html` so the old WordPress URL `/feed/` keeps working on GitHub Pages.
- [x] `<link rel="alternate">` in `<head>`. No JSON feed (not needed for an archive).

## 13. Additional Features

### 13.1 Create 404 page — DONE
- [x] `content/404.md` (GitHub Pages serves `/404.html` automatically)

### 13.2 Add sitemap — DONE (2026-10-09)
- [x] `/sitemap.xml`: home + all posts (+ pages once added); no drafts, listing or category/tag pages
- [x] `Sitemap:` line in `robots.txt`

### 13.3 Verify archive notice
- [ ] Check that archive notice appears after header on all pages
- [ ] Verify notice appears in comments section
- [ ] Ensure text is in Russian
- [ ] Test on different page types (post, page, list)

## 14. Testing and Verification

### 14.1 Build verification
- [ ] Run `npm run build` successfully
- [ ] Check for build errors or warnings
- [ ] Verify all posts generated
- [ ] Verify all pages generated
- [ ] Check category and tag pages generated

### 14.2 Content verification
- [ ] Manually check several posts from each year
- [ ] Verify formatting is correct
- [ ] Test that images display
- [ ] Check that comments appear
- [ ] Verify metadata is correct

### 14.3 Navigation verification
- [ ] Test navigation between posts
- [ ] Test category navigation
- [ ] Test tag navigation
- [ ] Test pagination
- [ ] Test all links in sidebar
- [ ] Test header and footer links

### 14.4 Style verification
- [ ] Compare rendered site with HTML export
- [ ] Verify CSS is applied correctly
- [ ] Check responsive design
- [ ] Test on different browsers
- [ ] Verify fonts and images load

### 14.5 Performance check
- [ ] Check build time is reasonable
- [ ] Verify page load times
- [ ] Check image sizes are acceptable
- [ ] Test site works without JavaScript

## 15. GitHub Pages Deployment

### 15.1 Create GitHub Actions workflow
- [ ] Copy `_example/.github/workflows/gh-pages.yml`
- [ ] Update to use latest Node.js version
- [ ] Update build command to `npm run build`
- [ ] Set correct publish directory as `_site`
- [ ] Configure to run on push to main/master branch

### 15.2 Create CNAME file
- [ ] Create `content/CNAME` with `svobodaiznutri.ru`
- [ ] Add passthrough copy for CNAME in config

### 15.3 Test deployment
- [ ] Push to GitHub
- [ ] Verify GitHub Actions workflow runs
- [ ] Check that site builds successfully
- [ ] Verify site is published to gh-pages branch
- [ ] Test site at GitHub Pages URL
- [ ] Configure custom domain in GitHub repository settings

### 15.4 DNS configuration
- [ ] Verify DNS points to GitHub Pages
- [ ] Test that https://svobodaiznutri.ru loads correctly
- [ ] Enable HTTPS in GitHub Pages settings
- [ ] Test all URLs work with custom domain

## 16. Cleanup — POSTPONED (do after the site is live and verified)

### 16.1 Remove from the repo
- [ ] `src/` — old 2021 Eleventy 0.12 site; all content is migrated to `content/` (posts, images; pages still pending: book)
- [ ] `.eleventy.js` — old config; then drop `--config=eleventy.config.js` from npm scripts
- [ ] `postcss.config.js` — postcss is no longer used
- [ ] `.gitignore`: drop the `_example/` line (folder already removed)
- [ ] `PLAN.md` — once everything is done (or move the "Decisions" part into README)

### 16.2 Code leftovers
- [ ] `public/style.css`, `public/media.css`: unused WordPress-era rules (`.widget_wysija*` subscription form,
      `.related_posts_by_taxonomy`, `.comment-respond` form inputs, `.top-widget`)
- [ ] `public/js/script.js`: commented-out jQuery code (SVG inlining, fancybox, wysija)
- [ ] `_includes/widget-popular-posts.njk` uses old WP plugin class names — fine to keep, just noting

### 16.3 Outside the repo / not committed
- [ ] `../svobodaiznutri.ru_2/` (wp_to_md_converter + temp) — the export is done, the result is in `_sources/md`
- [ ] `_sources/подписчики.csv` — newsletter subscribers' emails (personal data); delete unless you need it
- [ ] `_sources/comments.xml` — subset of `c.WordPress.2021-05-30.xml`, not used by any script
- Keep: `_sources/c.WordPress.2021-05-30.xml` and `_sources/html/` (used by `scripts/import_wp_comments.py` and as image source)

### 16.4 Documentation
- [ ] Rewrite README.md (current one is the 2021 TODO list): structure, `npm start` / `npm run build`, deploy, archive status
