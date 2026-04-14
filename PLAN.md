# Svobodaiznutri.ru Migration Plan

## 1. Setup and Base Configuration

### 1.1 Create new project structure
- [ ] Create `content/` directory as main content folder
- [ ] Create `content/blog/` for posts organized by year
- [ ] Create `content/blog/2013/`, `2014/`, `2015/`, `2016/` subdirectories
- [ ] Create `_includes/` directory for templates
- [ ] Create `_includes/layouts/` for layout templates
- [ ] Create `_data/` directory for site data
- [ ] Create `public/` directory for static assets

### 1.2 Update .gitignore
- [ ] Add `_sources/` to .gitignore
- [ ] Add `_example/` to .gitignore
- [ ] Add `node_modules/` if not already present
- [ ] Add `_site/` if not already present
- [ ] Add `.cache/` for any caching

### 1.3 Update package.json
- [ ] Update `@11ty/eleventy` to latest 2.x version
- [ ] Remove `postcss`, `postcss-cli`, `postcss-nested`, `autoprefixer`, `cssnano`
- [ ] Keep `html-minifier`, `rimraf`, `cross-env`
- [ ] Update `npm-run-all` to latest
- [ ] Update all other dependencies to latest compatible versions
- [ ] Update build scripts to remove postcss steps
- [ ] Add script for local development server

### 1.4 Create eleventy.config.js
- [ ] Copy base structure from `_example/eleventy.config.js`
- [ ] Configure input directory as `content/`
- [ ] Configure includes directory as `../_includes/`
- [ ] Configure data directory as `../_data/`
- [ ] Configure output directory as `_site/`
- [ ] Set `pathPrefix` to `/` for custom domain
- [ ] Add passthrough copy for images (`content/**/*.{jpg,png,gif,jpeg,pdf,doc}`)
- [ ] Add passthrough copy for `public/` to root
- [ ] Add date filters (using existing `date` and `datetime` filters)
- [ ] Add `postExcerpt` filter from existing `.eleventy.js`
- [ ] Add `tagLink` and category link filters
- [ ] Add `i18n` filter
- [ ] Configure HTML minification for production
- [ ] Configure BrowserSync 404 page

### 1.5 Copy static assets
- [ ] Copy `src/static/` contents to `public/`
- [ ] Copy `src/css/` to `public/css/`
- [ ] Copy `src/js/` to `public/js/`
- [ ] Verify favicon and other meta files are present

### 1.6 Copy data files
- [ ] Copy `src/_data/i18n.js` to `_data/i18n.js`
- [ ] Create `_data/metadata.js` with site metadata (title, url, description, author)

## 2. Layouts and Templates

### 2.1 Create base layout
- [ ] Copy `src/_layouts/layout.njk` to `_includes/layouts/base.njk`
- [ ] Update to work with Eleventy 2.x
- [ ] Add archive notice after header but before main content
- [ ] Ensure proper CSS/JS includes
- [ ] Test that layout renders correctly

### 2.2 Create post layout
- [ ] Copy `src/_layouts/post.njk` to `_includes/layouts/post.njk`
- [ ] Set base layout as parent
- [ ] Keep thumbnail/cover image handling
- [ ] Keep post metadata (date, tags, categories)
- [ ] Keep previous/next post navigation
- [ ] Add placeholder for comments section
- [ ] Ensure permalink field is respected

### 2.3 Create posts list layout
- [ ] Copy `src/_layouts/posts.njk` to `_includes/layouts/home.njk`
- [ ] Implement excerpt display using `postExcerpt` filter
- [ ] Keep READMORE functionality
- [ ] Add pagination support
- [ ] Ensure thumbnail display works

### 2.4 Copy includes
- [ ] Copy `src/_includes/header.njk` to `_includes/header.njk`
- [ ] Copy `src/_includes/footer.njk` to `_includes/footer.njk`
- [ ] Copy `src/_includes/sidebar.njk` to `_includes/sidebar.njk`
- [ ] Copy any other includes from `src/_includes/`
- [ ] Update paths in includes to work with new structure

## 3. Test Posts Migration

### 3.1 Select test posts
- [ ] Choose 1 post from `eko-stroitelstvo` category
- [ ] Choose 1 post from `eko-proektirovanie` category
- [ ] Choose 1 post from `eko-otoplenie` category
- [ ] Choose 1 post from `eko-fundament` category
- [ ] Choose 1 post from `eko-elektrichestvo` category
- [ ] Choose 1 post from `eko-myshlenie` category if exists

### 3.2 Migrate test posts structure
- [ ] For each test post, create folder: `content/blog/YYYY/YYYY-MM-DD-slug/`
- [ ] Rename `index.md` to `YYYY-MM-DD-slug.md` inside the folder
- [ ] Copy existing images from `src/posts/YYYY/*/images/` to post folder root
- [ ] Verify frontmatter has: title, date, categories, tags, coverImage, permalink
- [ ] Update image paths in markdown from `images/photo.jpg` to `photo.jpg`
- [ ] Verify READMORE comment is present
- [ ] Test that posts build correctly

### 3.3 Create blog.11tydata.js
- [ ] Create `content/blog/blog.11tydata.js`
- [ ] Set default layout to `layouts/post.njk`
- [ ] Add posts to `posts` collection

## 4. Articles List Page

### 4.1 Create posts list template
- [ ] Create `content/index.njk` as home page
- [ ] Use posts list layout
- [ ] Configure pagination (10 posts per page)
- [ ] Display post excerpts using `postExcerpt` filter
- [ ] Show post thumbnails
- [ ] Show post metadata (date, categories, tags)
- [ ] Add pagination navigation
- [ ] Test navigation between paginated pages

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

## 6. Comments

### 6.1 Parse comments.xml
- [ ] Create script `scripts/parse-comments.js`
- [ ] Parse `_sources/comments.xml`
- [ ] Extract: author name, date, comment text, parent comment ID
- [ ] Group comments by post (using post ID or permalink)
- [ ] Generate `comments.json` file for each post folder
- [ ] Handle nested/threaded comments structure

### 6.2 Create comments template
- [ ] Create `_includes/comments.njk`
- [ ] Check if `comments.json` exists for current post
- [ ] If exists, render comments with existing HTML/CSS structure
- [ ] Maintain nesting/threading
- [ ] Hide "Answer" button
- [ ] Add archive notice: "Сайт находится в архиве. Комментарии отключены."

### 6.3 Integrate comments into post layout
- [ ] Include comments template in `_includes/layouts/post.njk`
- [ ] Test that comments display correctly
- [ ] Verify nested comments render properly
- [ ] Test posts without comments show archive notice only

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
