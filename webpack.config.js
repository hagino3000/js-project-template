var webpack = require("webpack");
var path = require('path')
var AssetsPlugin = require('assets-webpack-plugin')
var assetsPluginInstance = new AssetsPlugin()
var RevReplacePlugin = require('webpack-rev-replace-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    context: __dirname + '/src',
    entry: {
        app: ['./js/main.js', './js/fuga.js']
    },
    html: './index.html',
    output: {
        path: __dirname + '/dist',
        filename: "bundle-[hash].js",
        publicPath: './'
    },
    devServer: {
        contentBase: 'dist',
        inline: true,
        hot: true,
        port: 8082
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'html',
            query:  {
                minimize: false
            }
        }]
    },
    plugins: [
        assetsPluginInstance,
        new RevReplacePlugin({
            cwd: './src',
            files: '*.html',
            outputPageName: function (filename) {
                return filename;
            },
            modifyReved: function(filename) {
              return filename.replace(/(\/style\/|\/script\/)/, '')
            }
        }),
        new CopyWebpackPlugin([{
            from: 'vendor',
            to: 'vendor'
        }, {
            from: 'css',
            to: 'css'
        }]),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            minimize: false,
            compact: false,
            sourceMap: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}
