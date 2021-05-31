const fs = require('fs')
const htmlmin = require('html-minifier')
// const pageAssetsPlugin = require('eleventy-plugin-page-assets')
// Using custom version of plugin due to bug that is not fixed in original lib (PRs with fix not accepted)
const pageAssetsPlugin = require('./src/_11ty/eleventy-plugin-page-assets')
const i18n = require('./src/_11ty/i18n.js')

module.exports = function(eleventyConfig) {
  eleventyConfig.setQuietMode(true)

  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform('htmlmin', htmlminTransform)
  } else {
    eleventyConfig.setBrowserSyncConfig({ callbacks: { ready: browserSyncReady }})
  }

  // Passthrough
  eleventyConfig.addPassthroughCopy({ 'src/static': '.' })
  eleventyConfig.addPlugin(pageAssetsPlugin, {
    mode: 'directory',
    postsMatching: '*.md',
    assetsMatching: '*.pdf|*.doc|*.png|*.jpeg|*.jpg|*.gif',
    recursive: true,
    // hashAssets: false,
  })

  // Watch targets
  eleventyConfig.addWatchTarget('./src/styles/')

  eleventyConfig.addFilter('date', function(value) {
    const date = new Date(value)
    return date.toLocaleDateString('ru', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  })

  // TODO
  eleventyConfig.addFilter('tagLink', function(value) {
    return `/tag/${value}`
  })

  eleventyConfig.addFilter('i18n', function(key) {
    return i18n[key] || key
  })

  var pathPrefix = ''
  if (process.env.GITHUB_REPOSITORY) {
    pathPrefix = process.env.GITHUB_REPOSITORY.split('/')[1]
  }

  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
    pathPrefix,
  }
}

function browserSyncReady(err, bs) {
  bs.addMiddleware('*', (req, res) => {
    const content_404 = fs.readFileSync('_site/404.html')
    // Provides the 404 content without redirect.
    res.write(content_404)
    // Add 404 http status code in request header.
    // res.writeHead(404, { 'Content-Type': 'text/html' })
    res.writeHead(404)
    res.end()
  })
}

function htmlminTransform(content, outputPath) {
  if( outputPath.endsWith('.html') ) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    })
    return minified
  }
  return content
}
