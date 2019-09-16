/**
 * @file webpack config
 * @author zhangyou
 */

const path = require('path');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|bower_components|lib)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|bower_components|lib)/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            modules: false,
                            javascriptEnabled: true
                        }
                    }
                ]
            }
        ]
    },
    externals: {
        'react': 'commonjs react',
        'react-dom': 'react-dom'
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
            generateStatsFile: true, // 是否生成stats.json文件
            reportFilename: 'report.html'
        })
    ]
};
