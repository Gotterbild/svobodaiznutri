const fs = require('fs')
const htmlmin = require('html-minifier')
const pageAssetsPlugin = require('eleventy-plugin-page-assets')

module.exports = function(eleventyConfig) {

  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform('htmlmin', htmlminTransform)
  } else {
    eleventyConfig.setBrowserSyncConfig({ callbacks: { ready: browserSyncReady }})
  }

  // Passthrough
  eleventyConfig.addPassthroughCopy({ 'src/static': '.' })
  // eleventyConfig.addPassthroughCopy({ 'src/*': (data) => {
  //   console.log('!!!!!!!!! data !!!!!!!!!!!!!', data)
  //   return data
  // }})
  // eleventyConfig.addPassthroughCopy({ '**/images': 'images' })
  // eleventyConfig.setTemplateFormats([
  //   'md',
  //   'jpg', 'jpeg', 'png', 'svg',
  //   'doc', 'pdf',
  //   'css',
  // ])
  eleventyConfig.addPlugin(pageAssetsPlugin, {
    mode: 'directory',
    postsMatching: '*.md',
    assetsMatching: '*.pdf|*.doc|*.png|*.jpeg|*.jpg|*.gif',
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

  eleventyConfig.addFilter('tagLink', function(value) {
    return value
  })

  eleventyConfig.addFilter('tag', function(key) {
    const translations = {
      strojka: 'стройка',
      filosofiya: 'философия',
    }
    return translations[key] || key
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
