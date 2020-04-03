
export const getWS = () => {
  let env = process.env.NODE_ENV
  let testing = 'ws://localhost:3333'
  let staging = 'wss://ws-staging.kindnessapi.com'
  let production = 'wss://ws.kindnessapi.com'
  if (env === 'development') {
    return testing
  }
  if (env === 'staging') {
    return staging
  }
  if (env === 'production') {
    return production
  }
  return testing
}
