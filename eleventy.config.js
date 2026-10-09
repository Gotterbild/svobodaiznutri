const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const pluginDrafts = require("./eleventy.config.drafts.js");
const i18n = require("./_data/i18n.js");

const POSTS_GLOB = "content/blog/**/*.md";

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/style.css` ends up in `_site/style.css`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
	});
	eleventyConfig.addPassthroughCopy("content/CNAME");

	// Posts and pages live in their own folder (`2014-01-07-slug/2014-01-07-slug.md`) together with
	// their assets (images, pdf). The assets are copied next to the generated page,
	// so relative links like `images/photo.jpg` keep working.
	eleventyConfig.on("eleventy.after", copyPageAssets);
	eleventyConfig.addWatchTarget("content/**/*.{jpg,jpeg,png,gif,pdf,doc}");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

	// Collections
	eleventyConfig.addCollection("posts", collectionApi => {
		return collectionApi.getFilteredByGlob(POSTS_GLOB);
	});

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).setLocale("ru").toFormat(format || "dd.LL.yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
	});

	// Comment dates are stored as strings in the site's local time, e.g. "2014-02-27 10:15:00"
	eleventyConfig.addFilter("commentDate", (value) => {
		return DateTime.fromSQL(value).setLocale("ru").toFormat("dd MMMM yyyy, HH:mm");
	});

	eleventyConfig.addFilter("postExcerpt", (content) => {
		const readmore = "<!-- READMORE -->";
		if (content.includes(readmore)) {
			return content.split(readmore)[0];
		}
		return content.split("\n")[0];
	});

	eleventyConfig.addFilter("tagLink", (value) => `/tag/${value}/`);
	eleventyConfig.addFilter("categoryLink", (value) => `/category/${value}/`);
	eleventyConfig.addFilter("i18n", (key) => i18n[key] || key);

	// Page numbers for WordPress-like pagination: 1 … 4 5 [6] 7 8 … 11
	// (same as WP `paginate_links` with end_size = 1, mid_size = 2)
	eleventyConfig.addFilter("paginationItems", (pageNumber, total) => {
		const current = pageNumber + 1;
		const items = [];
		let dots = false;
		for (let n = 1; n <= total; n++) {
			if (n === 1 || n === total || Math.abs(n - current) <= 2) {
				items.push(n);
				dots = false;
			} else if (!dots) {
				items.push("…");
				dots = true;
			}
		}
		return items;
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		// Control which files Eleventy will process
		templateFormats: [
			"md",
			"njk",
			"html",
		],

		// Posts are archived WordPress content: don't run a template engine over them
		markdownTemplateEngine: false,

		htmlTemplateEngine: "njk",

		dir: {
			input: "content",
			includes: "../_includes",
			data: "../_data",
			output: "_site"
		},

		pathPrefix: "/",
	};
};

function copyPageAssets({ dir, results }) {
	for (const { inputPath, outputPath } of results) {
		if (!inputPath.endsWith(".md") || !outputPath) continue;

		const srcDir = path.dirname(inputPath);
		if (path.basename(srcDir) !== path.basename(inputPath, ".md")) continue;

		const destDir = path.dirname(outputPath);
		for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
			if (entry.name.endsWith(".md") || entry.name.endsWith(".json")) continue;
			fs.cpSync(path.join(srcDir, entry.name), path.join(destDir, entry.name), { recursive: true });
		}
	}
}
