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

socket.on('text', ({ detail }) => {
  let html = `<pre>${detail.type} - ${JSON.stringify(detail)}</pre>`
  console.log(html)
})

socket.send({ text })

socket.on('online', ({ detail }) => {
  let html = `<pre>me: ${socket.nickname} - ${JSON.stringify(detail)}</pre>`
  console.log(html)
})
*/

let isFunction = function (obj) {
  return typeof obj === 'function' || false
}

class EventEmitter {
  constructor () {
    this.listeners = new Map()
  }
  on (label, callback) {
    this.listeners.has(label) || this.listeners.set(label, [])
    this.listeners.get(label).push(callback)
  }

  off (label, callback) {
    let listeners = this.listeners.get(label)
    let index = 0

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        let a = () => {
          i = index
          return i
        }
        return (isFunction(listener) && listener === callback) ? a() : i
      }, -1)

      if (index > -1) {
        listeners.splice(index, 1)
        this.listeners.set(label, listeners)
        return true
      }
    }
    return false
  }
  emit (label, ...args) {
    let listeners = this.listeners.get(label)

    if (listeners && listeners.length) {
      listeners.forEach((listener) => {
        listener(...args)
      })
      return true
    }
    return false
  }
}

export class LamdaClient extends EventEmitter {
  constructor ({ url, nickname, roomId }) {
    super()
    this.url = url
    this.nickname = nickname
    this.roomId = roomId
    this.autoReconnectInterval = 5 * 1000
    this.open()
  }

  get ready () {
    return this.ws.readyState === WebSocket.OPEN
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
        this.emit(detail.type, detail)
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
    }, 0)
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
