/* eslint-disable func-names */
module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: 'last 2 versions, ie 11',
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ];

  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    [
      'import',
      {
        libraryName: 'antd',
        style: 'true'
      }
    ]
  ];

  const env = {
    e2e: {
      plugins: ['istanbul'],
    },
  };

  return {
    presets,
    plugins,
    env,
  };
};
