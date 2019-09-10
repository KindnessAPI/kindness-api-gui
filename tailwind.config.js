// npm i -D tailwindcss purgecss @fullhuman/postcss-purgecss

module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0102d4'
      },
      spacing: {
        '72': '18rem'
      },
      fontFamily: {
        'brand': [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ]
      }
    }
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active']
  },
  plugins: []
}
