const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const pkg = require('./package.json');
const scopedPkgRegex = new RegExp(`^@[a-z0-9][\\w-.]+/[a-z0-9][\\w-.]*`, 'i');
const pkgName = scopedPkgRegex.test(pkg.name) ? pkg.name.split('/')[1] : pkg.name;

const config = {
    devtool: 'source-map',
    output: {
        filename: '[name].js',
        library: pkgName,
        libraryExport: 'default',
        libraryTarget: 'umd',
        path: path.join(__dirname, 'umd')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                autoprefixer({
                                    browsers: [
                                        'last 2 chrome versions',
                                        'last 2 safari versions',
                                        'last 2 firefox versions',
                                        'last 2 edge versions',
                                        'ie 11'
                                    ]
                                }),
                            ]
                        }
                    },
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    performance: {
        hints: false
    },
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    }
};

const devConfig = webpackMerge(config, {
    mode: 'development',
    entry: {
        [pkgName]: './src/index.js'
    }
})

const prodConfig = webpackMerge(config, {
    mode: 'production',
    entry: {
        [`${pkgName}.min`]: './src/index.js'
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    warnings: false,
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
})

module.exports = [devConfig, prodConfig]
