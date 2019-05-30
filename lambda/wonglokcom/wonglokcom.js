const querystring = require('querystring')
var fetch = require('node-fetch')

// const headers = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
//   'Content-Type': 'application/json',
//   'Access-Control-Allow-Methods': '*',
//   'Access-Control-Max-Age': '2592000',
//   'Access-Control-Allow-Credentials': 'true'
// }

function preflight (callback) {
  callback(null, {
    statusCode: 204,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET'
    },
    body: ''
  })
}

exports.handler = (event, context, callback) => {
  let { httpMethod, path, queryStringParameters } = event
  if (httpMethod === 'OPTIONS') {
    preflight(callback)
  } else if (httpMethod === 'GET') {
    path = path.replace('/.netlify/functions/wonglokcom', '')
    console.log(path)
    console.log(queryStringParameters)
    console.log(querystring.encode(queryStringParameters))
    let fetchRoute = `https://www.wonglok.com/${path}?${querystring.encode(queryStringParameters)}`
    console.log(fetchRoute)
    fetch(fetchRoute)
      .then(response => response.text())
      .then((body) => {
        callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET'
          },
          body
        })
      })
  }

  // let result =

  // callback(null, {
  //   statusCode: 200,
  //   headers,
  //   body: 'Hello, World'
  // })
}
