/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.vue',
    './resources/**/*.svelte',
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
