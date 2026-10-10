# svobodaiznutri.com — static archive

Archived copy of the «Свобода Изнутри» blog (2013–2018), originally on WordPress.
Built with [Eleventy](https://www.11ty.dev/) 2.x, same setup as pashadolgopishet.
The site is read-only: no comment, subscription or contact forms; old comments are shown as they were.

## Commands

```sh
npm install
npm start        # dev server with live reload (drafts included)
npm run build    # build into _site/ (drafts excluded)
```

Deployment: every push to `master` runs `.github/workflows/build.yml`, which builds the site and
publishes `_site/` to the `gh-pages` branch (GitHub Pages, custom domain from `content/CNAME`).

## Structure

- `content/blog/YYYY/YYYY-MM-DD-slug/YYYY-MM-DD-slug.md` — posts. Each post folder holds its images in `images/`
  (full-resolution copies, where they exist, in `images/full/`) and `<post>.11tydata.json` with its comments.
  `permalink` keeps the original WordPress URL (`/slug/`). `draft: true` hides a post.
- `content/pages/` — the book page `/kniga-kak-realizovyvat-mechty/` with the PDF.
- `content/index.njk`, `category.njk`, `tag.njk` — listings, 7 posts per page, `/page/N/` like WordPress.
- `content/feed/`, `content/sitemap/` — Atom feed (`/feed/feed.xml`, also at the old `/feed/`) and `sitemap.xml`.
- `_includes/` — layouts and partials (WordPress theme markup), `_data/` — site metadata, menu, category names.
- `public/` — static files copied as is: CSS, JS (menu, gallery lightbox), favicons, the book PDF at its old
  `/wp-content/uploads/` URL.
- `scripts/import_wp_comments.py` — regenerates the comment files from the WordPress export.
- `_sources/` (not committed) — the WordPress XML export and a downloaded copy of the old site.

## History

Decisions and the migration log are in `PLAN.md`.

## License

The content is licensed under CC BY 4.0. The source code for page structure, CSS and JS is licensed under MIT.
