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
    [
        'import', 
        {
            libraryName: 'antd',
            style: true,
            libraryDirectory: 'es'
        }
    ]
];
  
module.exports = { presets, plugins };
