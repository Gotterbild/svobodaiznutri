module.exports = ({ env }) => ({
  plugins: {
		'postcss-nested': {},
		autoprefixer: {},
		cssnano: env === 'production' ? { 
			preset: [ 'default', { discardComments: { removeAll: true } } ]
		} : false
  }
})
