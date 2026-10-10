# svobodaiznutri.com — static archive

Archived copy of the «Свобода Изнутри» blog (2013–2018), originally on WordPress.
Built with [Eleventy](https://www.11ty.dev/) 2.x. The site is read-only: no comment, subscription or contact forms; old comments are shown as they were.

## Commands

```sh
npm install
npm start        # dev server with live reload (drafts included)
npm run build    # build into _site/ (drafts excluded)
```

Deployment: every push to `master` runs `.github/workflows/build.yml`, which builds the site and
publishes `_site/` to the `gh-pages` branch (GitHub Pages).

## License

The content is licensed under CC BY 4.0. The source code for page structure, CSS and JS is licensed under MIT.
