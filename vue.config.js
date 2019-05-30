module.exports = {
  devServer: {
    proxy: {
      // netlify dev with functions
      '/.netlify/functions/': {
        target: 'http://localhost:8888'
      }
    }
  }
}
