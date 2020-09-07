module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'react-hot-loader/babel',
    'babel-plugin-styled-components',
    'lodash',
  ],
  env: {
    production: {
      plugins: ['transform-react-remove-prop-types'],
    },
  },
};
