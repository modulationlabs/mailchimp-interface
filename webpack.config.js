const path = require('path');

module.exports = {
	mode: 'production', // 'production' | 'development' | 'none'  // Chosen mode tells webpack to use its built-in optimizations accordingly.
	entry: ['babel-polyfill', './app/index.js'], // string | object | array  // Here the application starts executing
	output: {
		path: path.resolve(__dirname, 'build'), // string
		filename: 'bundle.js', // string    // the filename template for entry chunks
		libraryTarget: 'umd', // universal module definition    // the type of the exported library
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				include: [
					path.resolve(__dirname, 'app')
				],
				exclude: [
					path.resolve(__dirname, 'node_modules')
				],
				loader: 'babel-loader',
			},
		]
		
	},
	resolve: {
		modules: [
			'node_modules',
			path.resolve(__dirname, 'app')
		],
		extensions: ['.js', '.json'],
		alias: {
			'module': 'new-module',
			'only-module$': 'new-module',
			'module': path.resolve(__dirname, 'app/third/module.js'),
		},
	},
	performance: {
		hints: 'warning', // enum    maxAssetSize: 200000, // int (in bytes),
		maxEntrypointSize: 400000, // int (in bytes)
		assetFilter: function (assetFilename) {
			return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
		}
	},
	devtool: 'source-map', // enum  // enhance debugging by adding meta info for the browser devtools
	context: __dirname, // string (absolute path!)
	target: 'node', // enum  // the environment in which the bundle should run
	serve: { //object
		port: 3001,
		content: './build',
	},
	stats: 'errors-only',  // lets you precisely control what bundle information gets displayed
	devServer: {
		proxy: { // proxy URLs to backend development server
			'/api': 'http://localhost:3001/api'
		},
		contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
		compress: true, // enable gzip compression
		historyApiFallback: true, // true for index.html upon 404, object for multiple paths
		hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
		https: false, // true for self-signed, object for cert authority
		noInfo: true, // only errors & warns on hot reload
	},
}