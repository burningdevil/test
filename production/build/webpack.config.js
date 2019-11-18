const path = require('path')
const webpack = require('webpack')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const project = require('../project.config')

const inProject = path.resolve.bind(path, project.basePath)
const inProjectSrc = file => inProject(project.srcDir, file)

/* eslint-disable no-underscore-dangle */
const __DEV__ = project.env === 'development'
const __TEST__ = project.env === 'test'
const __PROD__ = project.env === 'production'
const __IS_WS__ = project.container === 'WS'
/* eslint-enable */

const config = {
  entry: { main: [inProjectSrc(project.main)] },
  devtool: project.sourcemaps ? 'source-map' : false,
  output: {
    path: inProject(project.outDir),
    filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
    publicPath: project.publicPath
  },
  resolve: {
    modules: [inProject(project.srcDir), 'node_modules'],
    extensions: ['*', '.js', '.jsx', '.json', '.tsx']
  },
  externals: project.externals,
  module: { rules: [] },
  plugins: [
    new webpack.DefinePlugin(
      {
        'process.env': { NODE_ENV: JSON.stringify(project.env) },
        __DEV__,
        __TEST__,
        __PROD__,
        __IS_WS__,
        ...project.globals
      }
    )
  ]
}

// JavaScript
// ------------------------------------
config.module.rules.push({
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        plugins: [
          [
            '@mstr/babel-plugin-extract-descriptors',
            {
              outputDir: './public',
              outputFilename: 'descriptorIDs.json',
              quiet: true,
              token: { functionNames: 'desc' }
            }
          ],
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-transform-runtime',
          '@babel/plugin-proposal-object-rest-spread',
          [
            'import',
            {
              libraryName: 'antd',
              style: 'css'
            }
          ]
        ],
        presets: [
          '@babel/preset-react',
          '@babel/preset-env',
          '@babel/preset-typescript'
        ]
      }
    }
  ]
})

// Styles
// ------------------------------------
config.plugins.push(
  new MiniCssExtractPlugin({ filename: `[name].[chunkhash].css` })
)

config.module.rules.push({
  test: /\.(css|sass|scss)/,
  use: [
    MiniCssExtractPlugin.loader,
    { loader: 'css-loader' },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          cssnano({
            discardComments: { removeAll: true },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: false
          })
        ]
      }
    },
    {
      loader: 'sass-loader',
      options: {
        includePaths: [inProject('styles')],
        sourceMap: false
      }
    }
  ]
})

// Images
// ------------------------------------
config.module.rules.push({
  test: /\.(png|jpg|gif|svg)$/,
  loader: 'url-loader',
  options: { limit: 8192 }
});

// Fonts
// ------------------------------------
[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml']
].forEach(font => {
  const extension = font[0]
  const mimetype = font[1]

  config.module.rules.push({
    test: new RegExp(`fonts/.*\\.${extension}$`),
    loader: 'url-loader',
    options: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype
    }
  })
})

// HTML Template
// ------------------------------------
config.plugins.push(
  new HtmlWebpackPlugin({
    template: inProjectSrc('index.html'),
    inject: true,
    minify: { collapseWhitespace: true }
  })
)

// Generate Workstation plugin app template
config.plugins.push(new CopyPlugin([{ from: 'static' }]))

// Development Tools
// ------------------------------------
if (__DEV__) {
  config.entry.main.push(
    `webpack-hot-middleware/client.js?path=${
      config.output.publicPath
    }__webpack_hmr`
  )
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

// Bundle Splitting
// ------------------------------------
config.optimization = {
  minimize: true,
  ...config.optimization
}
if (!__TEST__) {
  const bundles = ['normalize', 'manifest']

  if (project.vendors && project.vendors.length) {
    bundles.unshift('vendor')
    config.entry.vendor = project.vendors
  }
  config.optimization.splitChunks = {
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    name: true,
    cacheGroups: {
      default: false,
      app: {
        name: 'app',
        chunks: 'initial',
        minChunks: 2,
        reuseExistingChunk: true
      },
      vendor: {
        name: 'vendor',
        test: /[\\/]node_modules[\\/]/,
        chunks: 'initial'
      }
      // styles: {
      //   name: 'style',
      //   test: /\.(scss|css)$/,
      //   chunks: 'all',
      // }
    }
  }
}

// Production Optimizations
// ------------------------------------
if (__PROD__) {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  )
}

module.exports = config
