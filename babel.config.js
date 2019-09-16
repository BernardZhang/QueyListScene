/**
 * @file babel 配置文件
 * @author zhangyou
 */

const presets = [
    '@babel/env',
    '@babel/preset-react'
];

const plugins = [
    [
        '@babel/plugin-proposal-decorators',
        {
            legacy: true
        }
    ],
    [
        '@babel/plugin-proposal-class-properties',
        {
            loose: true
        }
    ]
];

if (!process.env.WEBPACK_DEV_SERVER) {
    plugins.push([
        'import',
        {
            libraryName: 'antd',
            style: true,
            libraryDirectory: 'es'
        }
    ]);
}

module.exports = {presets, plugins};
