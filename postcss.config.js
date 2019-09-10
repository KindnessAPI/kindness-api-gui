// npm i -D tailwindcss purgecss @fullhuman/postcss-purgecss

const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
// const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    tailwindcss('./tailwind.config.js'),
    autoprefixer({
      add: true,
      grid: true
    })// ,
    // process.env.NODE_ENV === 'production' ? purgecss({
    //   content: [
    //     './public/**/*.html',
    //     './src/**/*.html',
    //     './src/**/*.vue'
    //   ]
    // }) : ''
  ]
}
