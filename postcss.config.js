/* eslint-disable global-require */
module.exports = {
  plugins: [
    'autoprefixer',
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('postcss-preset-env'),
  ],
};
