module.exports = {
  theme: {
    extend: {
      spacing: {
        min10: '10vmin',
        min20: '20vmin',
        min30: '30vmin',
        min40: '40vmin',
        min50: '50vmin',
        min60: '60vmin',
        min70: '70vmin',
        min80: '80vmin',
        min90: '90vmin',
        min100: '100vmin',

        t1: `calc(30px + 22 * (100vw - 400px) / 1040)`,

        px: '1px',
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem'
      },
      fontFamily: {
        sans: [
          'Inter',
          'Avenir',
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
          '"Noto Color Emoji"'
        ],
        serif: [
          'Inter',
          'Inter',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'Times',
          'serif'
        ],
        mono: [
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ]
      }
    }
  },
  variants: {
  },
  plugins: []
}
