/*eslint-env node*/
'use strict';

const path                  = require('path');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const CommonsChunkPlugin    = require('webpack/lib/optimize/CommonsChunkPlugin');
const NoErrorsPlugin        = require('webpack/lib/NoErrorsPlugin');

const ASSET_PATH = 'assets';

module.exports = {
    devtool: 'source-map',
    devServer: {
        port: 8000
    },
    recordsPath: path.join(__dirname, '.records'),
    entry: {
        app: './src/app.ts',
        vendor: ['phaser', 'phaser-tiled', 'phaser-debug']
    },
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: `${ASSET_PATH}/[chunkhash].js`,
        chunkFilename: `${ASSET_PATH}/[id].[chunkhash].js`
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.(png|jpe?g|svg|gif|ttf|woff2?|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                loaders: [
                    `file?name=${ASSET_PATH}/[hash].[ext]`,
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    // activate source maps via loader query
                    'css?sourceMap!less?sourceMap',
                    { allChunks: true }
                )
            }
        ]
    },
    plugins: [
        // don't emit output when there are errors
        new NoErrorsPlugin(),

        // extract inline css into separate 'styles.css'
        new ExtractTextPlugin(`${ASSET_PATH}/[hash].css`),

        // extract shared dependencies to a central bundle
        new CommonsChunkPlugin({
            name: 'vendor',

            // (with more entries, this ensures that no other module
            //  goes into the vendor chunk)
            minChunks: Infinity
        }),

        // create app html
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './assets/index.ejs',
            title: 'LTTP',
            chunks: ['vendor', 'app'],
            cache: true
        })
    ]
};