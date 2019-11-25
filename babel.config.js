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
    ],
    // [
    //     'babel-plugin-import-less',
    //     {
    //         library: 'antd',
    //         module: 'lib/[dash]',
    //         // import style
    //         style: 'style'              // use less style
    //         // or
    //         // style: 'style/index.css'    // use css style
    //     }
    // ],
    // [
    //     'babel-plugin-import-less',
    //     {
    //         library: './',
    //         module: '[dash]',
    //         // import style
    //         // style: 'style'              // use less style
    //         // or
    //         // style: 'style/index.css'    // use css style
    //     }
    // ]
];

if (!process.env.WEBPACK_DEV_SERVER) {
    plugins.push([
        'import',
        {
            libraryName: 'antd',
            // libraryDirectory: 'es',
            style: true,
        
        }
    ]);
}

module.exports = {presets, plugins};
