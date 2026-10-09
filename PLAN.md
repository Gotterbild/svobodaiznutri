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
- ~250 links to `/wp-content/uploads/...` (mostly full-size image links around inline images, a few `<img src>`) — section 10.
- `/feed/` linked in `<head>` but not built yet — section 12.

## 5. Single Article Page

### 5.1 Verify post rendering
- [ ] Test that post content renders correctly
- [ ] Verify thumbnail displays
- [ ] Verify metadata (date, categories, tags) displays
- [ ] Test that images in content display correctly
- [ ] Verify READMORE is not shown on single post page

### 5.2 Test navigation
- [ ] Verify previous/next post links work
- [ ] Test that permalink URLs are correct
- [ ] Test internal links between posts work

### 5.3 Verify sidebar
- [ ] Test that sidebar renders
- [ ] Test sidebar links work

### 5.4 Popular posts in sidebar
- [ ] Identify or create list of popular posts in `_data/`
- [ ] Add popular posts section to sidebar
- [ ] Display post titles with links
- [ ] Style according to existing design

## 6. Comments — DONE (2026-10-09)

- [x] `scripts/import_wp_comments.py` reads `_sources/c.WordPress.2021-05-30.xml` (full export; `comments.xml` lacks parent ids)
      and writes `<post>.11tydata.json` next to each post: 268 approved comments on 48 posts (1 unapproved skipped).
- [x] WordPress thread order and markup (depth-1..3, `bypostauthor`, `#id` anchor, date), no reply links.
- [x] "Сайт заархивирован. Отправка комментариев отключена" box under every post (in place of the form).
- [x] Verified: comment ids and order identical to the WP HTML snapshot on all 73 snapshot posts.
- [x] Footer VK link removed (user request).

## 7. Book Page

### 7.1 Create book page
- [ ] Copy content from `_sources/md/pages/2014-09-16-kniga-kak-realizovyvat-mechty/index.md`
- [ ] Create `content/kniga-kak-realizovyvat-mechty/index.md` or appropriate path
- [ ] Set frontmatter with permalink from original
- [ ] Use appropriate layout (base or post)
- [ ] Copy any images to page folder
- [ ] Update image paths
- [ ] Test that page renders correctly
- [ ] Verify permalink works

## 8. Categories

### 8.1 Create individual category pages
- [ ] Create `content/category.njk` with pagination
- [ ] Generate page for each category
- [ ] Set permalink pattern to `/category/{category-slug}/`
- [ ] Display all posts in category
- [ ] Use posts list template/include
- [ ] Show category name using `i18n` filter

## 9. Tags

### 9.1 Create individual tag pages
- [ ] Create `content/tag.njk` with pagination
- [ ] Generate page for each tag
- [ ] Set permalink pattern to `/tag/{tag-slug}/`
- [ ] Display all posts with tag
- [ ] Use posts list template/include
- [ ] Show tag name using `i18n` filter


## 10. Full Posts Migration

### 10.1 Migrate all remaining posts
- [ ] For each post in `_sources/md/posts/`:
  - [ ] Create folder structure in `content/blog/YYYY/YYYY-MM-DD-slug/`
  - [ ] Copy/create markdown file as `YYYY-MM-DD-slug.md`
  - [ ] Copy frontmatter (title, date, categories, tags, coverImage)
  - [ ] Ensure permalink is set correctly
  - [ ] Copy content with READMORE tag
  - [ ] Update internal links if needed

### 10.2 Migrate all images
- [ ] For each post, identify images from HTML export or existing `src/posts/`
- [ ] Copy images to post folder root
- [ ] Update image references in markdown to remove `images/` path
- [ ] Create list of missing images

### 10.3 Verify all images exist
- [ ] Create script to check all image references in markdown
- [ ] Compare with files on disk
- [ ] Generate report of missing images
- [ ] Locate missing images in `_sources/html/` or `_sources/theme/`
- [ ] Copy missing images to appropriate post folders
- [ ] Re-run verification until all images found

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

## 12. RSS Feed

### 12.1 Install RSS plugin
- [ ] Add `@11ty/eleventy-plugin-rss` to dependencies
- [ ] Configure plugin in `eleventy.config.js`

### 12.2 Create RSS feed template
- [ ] Create `content/feed/feed.xml.njk`
- [ ] Include all posts in feed
- [ ] Set correct metadata (title, description, URL)
- [ ] Add post content to feed items
- [ ] Set permalink to `/feed.xml` or existing feed URL

### 12.3 Create JSON feed
- [ ] Create `content/feed/feed.json.njk`
- [ ] Use same structure as XML feed
- [ ] Set permalink appropriately

### 12.4 Add feed links to layout
- [ ] Add RSS feed link to `_includes/layouts/base.njk` head
- [ ] Add feed links to footer or appropriate location

## 13. Additional Features

### 13.1 Create 404 page
- [ ] Create `content/404.md`
- [ ] Use appropriate layout
- [ ] Add helpful navigation links
- [ ] Configure server to use 404.html

### 13.2 Add sitemap
- [ ] Create sitemap template or use plugin
- [ ] Include all posts and pages
- [ ] Exclude drafts and pagination pages
- [ ] Set permalink to `/sitemap.xml`

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

## 16. Cleanup

### 16.1 Backup verification
- [ ] Ensure all original content is backed up
- [ ] Verify nothing is lost
- [ ] Keep `_sources/` and `_example/` folders until final confirmation

### 16.2 Remove old files (only after everything confirmed working)
- [ ] Remove `src/` directory
- [ ] Remove old `.eleventy.js`
- [ ] Remove `postcss.config.js`
- [ ] Remove old `package-lock.json` (will be regenerated)
- [ ] Remove any other obsolete files

### 16.3 Documentation
- [ ] Update README.md with new structure
- [ ] Document build process
- [ ] Document deployment process
- [ ] Add notes about archived status
- [ ] Document where to find original content (`_sources/`)

### 16.4 Final verification
- [ ] Full site build test
- [ ] Check all URLs work
- [ ] Verify all images load
- [ ] Test all navigation
- [ ] Verify RSS feeds work
- [ ] Check GitHub Pages deployment
- [ ] Test custom domain
- [ ] Get final approval before removing old structure
