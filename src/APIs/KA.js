export const getWS = () => {
  let testing = 'ws://localhost:3333'
  let staging = 'wss://ws-staging.kindnessapi.com'
  let production = 'wss://ws.kindnessapi.com'
  if (process.env.NODE_ENV === 'development') {
    return testing
  }
  if (process.env.NODE_ENV === 'staging') {
    return staging
  }
  if (process.env.NODE_ENV === 'production') {
    return production
  }
  return testing
}

/*
let getID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}
let socket = new LamdaClient({
  url: getWS(),
  roomId: 'room-test',
  nickname: 'kindness-api-client-' + getID()
})

socket.addEventListener('text', ({ detail }) => {
  let html = `<pre>${detail.type} - ${JSON.stringify(detail)}</pre>`
  console.log(html)
})

socket.send({ text })

socket.addEventListener('online', ({ detail }) => {
  let html = `<pre>me: ${socket.nickname} - ${JSON.stringify(detail)}</pre>`
  console.log(html)
})
*/

export class LamdaClient extends EventTarget {
  constructor ({ url, nickname, roomId }) {
    super()
    this.url = url
    this.nickname = nickname
    this.roomId = roomId
    this.autoReconnectInterval = 5 * 1000

    this.open()
  }

  open () {
    this.ws = new WebSocket(this.url)
    this.ws.__disposed = false

    this.ws.addEventListener('open', (e) => {
      if (this.ws.__disposed) { return }
      console.log('WebSocket: opened')
      this.joinRoom()
    })

    this.ws.addEventListener('message', (evt) => {
      if (this.ws.__disposed) { return }

      try {
        let detail = JSON.parse(evt.data)
        this.dispatchEvent(new CustomEvent(detail.type, { detail }))
      } catch (e) {
        console.log(e)
      }
    })

    this.ws.addEventListener('close', (e) => {
      if (this.ws.__disposed) { return }

      switch (e.code) {
        case 1000: // CLOSE_NORMAL
          console.log('WebSocket: closed')
          break
        default: // Abnormal closure
          this.reconnect(e)
          break
      }
      this.onClose(e)
    })

    this.ws.addEventListener('error', (e) => {
      if (this.ws.__disposed) { return }

      switch (e.code) {
        case 'ECONNREFUSED':
          this.reconnect(e)
          break
        default:
          this.onError(e)
          break
      }
    })
  }

  onClose (e) {
    console.log(e)
  }
  onError (e) {
    console.log(e)
  }

  reconnect (e) {
    if (this.ws) {
      this.ws.__disposed = true
    }
    console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e)

    setTimeout(() => {
      console.log('WebSocketClient: reconnecting...')
      this.open()
    }, this.autoReconnectInterval)
  }

  ensureWS (fnc) {
    let tt = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        clearInterval(tt)
        fnc()
      }
    }, 25)
  }

  ensureSend (data) {
    this.ensureWS(() => {
      this.ws.send(JSON.stringify(data))
    })
  }

  getOnlineList () {
    this.ensureSend({
      type: 'ws-online-list',
      roomId: this.roomId
    })
  }

  joinRoom () {
    this.ensureSend({
      type: 'ws-join-room',
      nickname: this.nickname,
      roomId: this.roomId
    })
  }

  sendText ({ text }) {
    this.ensureSend({
      type: 'ws-msg-room',
      roomId: this.roomId,
      text
    })
  }
}
