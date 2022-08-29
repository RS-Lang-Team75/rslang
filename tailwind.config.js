/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: { max: '480px' },
        sm: { max: '576px' },
        md: { max: '768px' },
        lg: { max: '992px' },
        xl: { max: '1200px' },
        '2xl': { max: '1336px' },
        '3xl': { max: '1576px' },
      },
      width: {
        100: '25rem',
      },
    },
  },
  plugins: [
    'flowbite/plugin',
  ],
};
