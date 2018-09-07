const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackMerge = require('webpack-merge');

const { pageList, enableProductionSourceMap, publicPath } = require('./config');

/**
 * output
 *
 * { app: './src/index.jsx' }
 *
 */
const commonEntry = (() => {
    let commonEntry = {};
    for (const page of pageList) {
        const name = page.name;
        const filename = page.filename;
        commonEntry[name] = './src/' + filename + '.jsx';
    }
    return commonEntry;
})();

/**
 *
 * output
 *
 *
 * development
 *
 * { app: [ '@babel/polyfill', './src/index.jsx' ] }
 *
 *
 * production
 *
 * {
 *   "app": [
 *     "react-hot-loader/patch",
 *     "webpack-dev-server/client?http://127.0.0.1:8080",
 *     "webpack/hot/only-dev-server",
 *     "@babel/polyfill",
 *     "./src/index.jsx"
 *   ]
 * }
 *
 */
const getEntry = env => {
    let entry = {};
    for (const key in commonEntry) {
        let value = commonEntry[key];
        value = ['@babel/polyfill'].concat(value);
        if (env === 'development') {
            value = [
                'react-hot-loader/patch',
                'webpack-dev-server/client?http://127.0.0.1:8080',
                'webpack/hot/only-dev-server'
            ].concat(value);
        }
        entry[key] = value;
    }
    return entry;
};

const HtmlWebpackPluginList = (() => {
    let list = [];
    for (const page of pageList) {
        const name = page.name;
        const filename = page.filename;
        const template = page.template;
        list.push(
            new HtmlWebpackPlugin({
                filename: filename + '.html',
                template: path.join(
                    __dirname,
                    '/src/templates/' + template + '.html'
                ),
                favicon: './favicon.ico',
                minify: {
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: true
                },
                chunks: ['vendor', name]
            })
        );
    }
    return list;
})();

const getModule = env => {
    let sourceMap = true;
    env === 'production' && (sourceMap = enableProductionSourceMap);
    const module = {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    /* {
                        loader: 'style-loader'
                    }, */
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: sourceMap
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: sourceMap
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: sourceMap,
                            sourceMapContents: sourceMap
                        }
                    }
                ]
            }
        ]
    };
    return module;
};

const commonConfig = {
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src', ':data-src'],
                            interpolate: true
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                use: [{ loader: 'babel-loader' }],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'images/[name].[hash].[ext]',
                        publicPath: './'
                    }
                }
            },
            {
                test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        publicPath: './'
                    }
                }
            }
        ]
    },
    plugins: HtmlWebpackPluginList.concat([
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ])
};

const developmentConfig = {
    mode: 'development',
    entry: getEntry('development'),
    output: {
        filename: '[name].[hash].js',
        publicPath: publicPath
    },
    module: getModule('development'),
    devtool: 'eval-source-map',
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: publicPath
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
};

const productionConfig = {
    mode: 'production',
    entry: getEntry('production'),
    output: {
        filename: '[name].[chunkhash].js'
    },
    module: getModule('production'),
    devtool: enableProductionSourceMap ? 'source-map' : false,
    plugins: [new CleanWebpackPlugin(['dist'])]
};

module.exports = env => {
    let config = null;
    process.env.NODE_ENV = env;
    if (env === 'development') {
        config = webpackMerge(commonConfig, developmentConfig);
    } else if (env === 'production') {
        config = webpackMerge(commonConfig, productionConfig);
    }
    return config;
};
