module.exports = {
  devServer: {
    proxy: {
      '/.netlify/functions/': {
        target: 'http://localhost:8888' // ,
        // pathRewrite: { '^/wonglokcom': '' }
      }
    }
  }
}
