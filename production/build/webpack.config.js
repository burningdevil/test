/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const webpack = require('webpack');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const project = require('../project.config');
const serverConfig = require('./server.config');

const inProject = path.resolve.bind(path, project.basePath);
const inProjectSrc = (file) => inProject(project.srcDir, file);

const __DEV__ = project.env === 'development';
const __TEST__ = project.env === 'test';
const __PROD__ = project.env === 'production';
const __IS_WS__ = project.container === 'WS';
const __MOCK__ = project.httpProxy === 'mock';

const cfgFilePath = inProject('build/.serverrc.json');
let connectionInfo = serverConfig;
if (fs.existsSync(cfgFilePath)) {
  const json = fs.readJSONSync(cfgFilePath);
  connectionInfo = _.merge(connectionInfo, json);
}
const __USERNAME__ = __DEV__ ? `'${connectionInfo.username}'` : `''`;
const __PASSWORD__ = __DEV__ ? `'${connectionInfo.password}'` : `''`;
const __LOGINMODE__ = connectionInfo.loginMode || 1;

const config = {
  mode: __PROD__ ? 'production' : 'development',
  entry: {
    main: [inProjectSrc(project.main)],
  },
  stats: {
    children: false,
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
  devtool: project.sourcemaps ? 'source-map' : false,
  output: {
    path: inProject(project.outDir),
    filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
    publicPath: project.publicPath,
  },
  performance: {
    maxEntrypointSize: 6291456, // 6 MB
    maxAssetSize: 6291456, // 6 MB
  },
  resolve: {
    modules: [inProject(project.srcDir), 'node_modules'],
    extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      'src': inProject('src'),
    },
  },
  externals: project.externals,
  module: {
    rules: [],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(project.env) },
      __DEV__,
      __TEST__,
      __PROD__,
      __IS_WS__,
      __MOCK__,
      __USERNAME__,
      __PASSWORD__,
      __LOGINMODE__,
      ...project.globals,
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    hot: true,
    historyApiFallback: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*', // NOSONAR
    },
    client: {
      overlay: true,
    },
    devMiddleware: {
      stats: 'errors-only',
    },
    server: 'http',
    proxy: {
      context: '/api',
      target: connectionInfo.host + connectionInfo.path,
      changeOrigin: true,
      logLevel: 'warn',
      cookiePathRewrite: '/',
    },
  },
};

// JavaScript & Typescript
// ------------------------------------
config.module.rules.push({
  test: /\.(ts|js)x?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
    },
  ],
});

// Styles
// ------------------------------------
config.plugins.push(
  new MiniCssExtractPlugin({
    filename: `[name].[chunkhash].css`,
  })
);

config.module.rules.push({
  test: /\.(css|sass|scss)/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            cssnano({
              discardComments: {
                removeAll: true,
              },
              discardUnused: false,
              mergeIdents: false,
              reduceIdents: false,
              safe: true,
              sourcemap: false,
            }),
          ],
        },
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sassOptions: { includePaths: [inProject('styles')] },
        sourceMap: false,
      },
    },
  ],
});

// Images
// ------------------------------------
config.module.rules.push({
  test: /\.(png|jpg|gif|svg)$/,
  type: 'asset',
});

// Fonts
// ------------------------------------
[['woff'], ['woff2'], ['otf'], ['ttf'], ['eot'], ['svg']].forEach((font) => {
  const extension = font[0];

  config.module.rules.push({
    test: new RegExp(`fonts/.*\\.${extension}$`),
    type: 'asset',
  });
});

// HTML Template
// ------------------------------------
config.plugins.push(
  new HtmlWebpackPlugin({
    template: inProjectSrc('index.html'),
    inject: true,
    minify: {
      collapseWhitespace: true,
    },
  })
);

// Bundle Splitting
// ------------------------------------
config.optimization = {
  minimize: __PROD__,
  ...config.optimization,
};
if (!__TEST__) {
  if (project.vendors && project.vendors.length) {
    config.entry.vendor = project.vendors;
  }
}

// Production Optimizations
// ------------------------------------
if (__PROD__) {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    })
  );
}

module.exports = config;
