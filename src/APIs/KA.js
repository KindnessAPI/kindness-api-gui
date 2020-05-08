export const getWS = () => {
  let testing = 'ws://' + location.hostname + ':3333'
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

export const getRESTURL = () => {
  let testing = 'http://' + location.hostname + ':3333'
  let staging = 'https://api-staging.kindnessapi.com'
  let production = 'https://api.kindnessapi.com'
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

export const getHeader = () => {
  return {
    'X-Token': Auth.currentProfile.jwt
  }
}

export const getID = () => {
  return '_' + Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9)
}

/*

let socket = new LamdaClient({
  url: getWS(),
  roomID: 'room-test',
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
  constructor ({ url, nickname, roomID }) {
    super()
    this.url = url
    this.nickname = nickname
    this.roomID = roomID
    this.autoReconnectInterval = 5 * 1000
    this.open()
  }

  get ready () {
    return this.ws.readyState === WebSocket.OPEN
  }
  close () {
    try {
      this.ws.__disposed = true
      this.ws.close()
      console.log('WebSocket: closed')
    } catch (e) {
      console.log(e)
    }
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
      roomID: this.roomID
    })
  }

  joinRoom () {
    this.ensureSend({
      type: 'ws-join-room',
      nickname: this.nickname,
      roomID: this.roomID
    })
  }

  sendText ({ text }) {
    this.ensureSend({
      type: 'ws-msg-room',
      roomID: this.roomID,
      text
    })
  }

  notifyGraphChange () {
    this.ensureSend({
      type: 'ws-graph-change',
      roomID: this.roomID
    })
  }
}

export var Store = {
  NS: getRESTURL() + '@STORE-Profiles',
  Profiles: []
}

export class Auth {
  static Store = Store
  static get profiles () {
    return Store.Profiles
  }
  static async loadProfiles () {
    let str = localStorage.getItem(Store.NS)
    if (str) {
      let profiles = []
      try {
        profiles = JSON.parse(str)
        Store.Profiles = profiles
      } catch (e) {
        Store.Profiles = []
        localStorage.removeItem(Store.NS)
        // console.log(e)
      }
    }
  }
  static async saveProfiles () {
    localStorage.setItem(Store.NS, JSON.stringify(Store.Profiles))
  }
  static async addProfle ({ profile }) {
    try {
      if (!Store.Profiles.some(e => {
        if (profile && e) {
          // console.log('profile', profile, e)
          return e.user.userID === profile.user.userID
        } else {
          return false
        }
      })) {
        Store.Profiles.map(e => {
          e.active = false
          return e
        })
        profile.active = true
        Store.Profiles.push(profile)
        Auth.saveProfiles()
      }
    } catch (e) {
      Store.Profiles = []
      localStorage.removeItem(Store.NS)
    }
  }
  static async removeProfileByUserID (userID) {
    let index = Store.Profiles.findIndex(e => e.user.userID === userID)
    Store.Profiles.splice(index, 1)
    if (Store.Profiles.length > 0) {
      Auth.setActiveProfileByUserID(Store.Profiles[0].user.userID)
    }
    Auth.saveProfiles()
  }

  static get currentProfile () {
    return Store.Profiles.find(e => e.active) || false
  }
  static setActiveProfileByUserID (userID) {
    Store.Profiles.map(e => {
      e.active = false
      return e
    })
    let user = Store.Profiles.find(e => e.user.userID === userID)
    if (user) {
      user.active = true
    }
  }
  static get isLoggedIn () {
    return Store.Profiles.length > 0
  }
  static async checkUsername (auth) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/checkUsername',
      data: {
        identity: auth.identity
      }
    })
    return resp.then((r) => {
      return true
    }, () => {
      return false
    })
  }

  static async register (auth) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/register',
      data: {
        username: auth.username,
        password: auth.password,
        email: auth.email
      }
    })
    return resp.then((r) => {
      let profile = r.data
      Auth.addProfle({ profile })
      Auth.saveProfiles()
      return profile
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async login (auth) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/login',
      data: {
        identity: auth.identity,
        password: auth.password
      }
    })
    return resp.then((r) => {
      let profile = r.data
      Auth.addProfle({ profile })
      Auth.saveProfiles()
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }
}

Auth.loadProfiles()

export class Content {
  static async getContentByNodeID ({ nodeID }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-content',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          nodeID
        }
      }
    })
    return resp.then((r) => {
      return r.data[0]
    }, (err) => {
      return Promise.reject(err)
    })
  }
  static async createContent ({ userID, username, nodeID, title = 'Please enter title', photo }) {
    if (!nodeID) {
      throw new Error('missing ndoe id')
    }
    photo = photo || `https://picsum.photos/id/${(Math.random() * 1200).toFixed(0)}/500/500`

    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-content',
      headers: getHeader(),
      data: {
        method: 'create',
        payload: {
          type: 'memo',
          userID,
          username,
          nodeID,
          title,
          content: '',
          coverImg: photo,
          tags: [{ text: 'memo' }]
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }
  static async removeContentByID ({ contentID }) {
    if (!contentID) {
      throw new Error('missing content id')
    }
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-content',
      headers: getHeader(),
      data: {
        method: 'remove-one',
        payload: {
          _id: contentID
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }
  static async updateContent ({ edit }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-content',
      headers: getHeader(),
      data: {
        method: 'update',
        payload: {
          _id: edit._id,
          edit
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }
}

export class Profile {
  static async getProfileByUserID ({ userID }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-profile',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          userID
        }
      }
    })
    return resp.then((r) => {
      return r.data[0]
    }, (err) => {
      return Promise.reject(err)
    })
  }
  static async createProfile ({ userID, username, photo }) {
    photo = photo || `https://picsum.photos/id/${(Math.random() * 1200).toFixed(0)}/200/200`

    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-profile',
      headers: getHeader(),
      data: {
        method: 'create',
        payload: {
          type: 'user',
          userID,
          username,

          displayName: username,
          bio: '',

          instagramURL: '',
          youtubeURL: '',
          twitterURL: '',

          displayShip: true,

          photoImg: photo,
          bgImg: '',
          loadingImg: '',

          tags: [{ text: 'first-profile' }]
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }
  static async updateProfile ({ edit }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-profile',
      headers: getHeader(),
      data: {
        method: 'update',
        payload: {
          _id: edit._id,
          edit
        }
      }
    })
    return resp.then((r) => {
      return r.data[0]
    }, (err) => {
      return Promise.reject(err)
    })
  }
}

export class Graph {
  static async createContentNode ({ name = 'New Content', photo }) {
    photo = photo || `https://picsum.photos/id/${(Math.random() * 1200).toFixed(0)}/200/200`
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'create',
        payload: {
          name: name,
          img: photo,
          value: {},
          type: 'content',
          tags: [
            // {
            //   'text': 'my-content'
            // }
          ]
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }
  static async linkContentNode ({ fromID, toID }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-edge',
      headers: getHeader(),
      data: {
        method: 'create',
        payload: {
          source: fromID,
          target: toID,
          name: 'make memo',
          type: 'memo',
          value: {},
          tags: [
            {
              'text': 'early-bird'
            }
          ]
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async createFriendTraverseNode ({ profileUsername, profileUserID, name = 'New User', photo }) {
    photo = photo || `https://picsum.photos/id/${(Math.random() * 1200).toFixed(0)}/200/200`
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'create',
        payload: {
          name: name,
          value: {
            username: profileUsername,
            userID: profileUserID
          },
          img: photo,
          type: 'traverse',
          tags: [
            {
              'text': 'early-bird'
            }
          ]
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }
  static async linkFriendTraverseNode ({ fromID, toID }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-edge',
      headers: getHeader(),
      data: {
        method: 'create',
        payload: {
          source: fromID,
          target: toID,
          name: 'make friend',
          type: 'friend',
          value: {},
          tags: [
            {
              'text': 'early-bird'
            }
          ]
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async addUserNode ({ profileUsername, profileUserID, name = 'New User', photo }) {
    photo = photo || `https://picsum.photos/id/${(Math.random() * 1200).toFixed(0)}/200/200`

    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'create',
        payload: {
          name: name,
          img: photo,
          type: 'user',
          value: {
            username: profileUsername,
            userID: profileUserID
          },
          tags: [
            {
              text: 'early-bird'
            }
          ]
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  // ----
  static async listUserNodes ({ userID }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          userID
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async queryEdgesSourceNode ({ nodeID }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-edge',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          source: nodeID
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async queryEdgesTargetNode ({ nodeID }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-edge',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          target: nodeID
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async queryNodesByList ({ list }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          list: list
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async removeNodeByID ({ nodeID }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'remove-one',
        payload: {
          _id: nodeID
        }
      }
    })
    return resp.then((r) => {
      return r.data[0]
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async removeEdgeByList ({ list }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'remove-many',
        payload: {
          list: list
        }
      }
    })
    return resp.then((r) => {
      return r.data[0]
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async listUserEdges ({ userID }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-edge',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          userID
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async removeEdgeByID ({ edgeID }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-edge',
      headers: getHeader(),
      data: {
        method: 'remove-one',
        payload: {
          _id: edgeID
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  /*
  {
    "method": "update",
    "payload": {
      "_id": "5eaf63f970b250ff6065a001",
      "edit": {
        "_id": "5eaf63f970b250ff6065a001",
        "userID": "5eade068c6207b1008c9eb23",
        "username": "wonglok831",
        "name": "Lok17",
        "img": "https://picsum.photos/200",
        "type": "user",
        "created_at": "2020-05-04T00:38:17.684Z",
        "updated_at": "2020-05-04T00:38:17.684Z",
        "__v": 0
      }
    }
  }
  */
  static async updateMyNode ({ edit }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'update',
        payload: {
          _id: edit._id,
          edit
        }
      }
    })
    return resp.then((r) => {
      return r.data[0]
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async getMyNode () {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          userID: Auth.currentProfile.user.userID
        }
      }
    })
    return resp.then((r) => {
      return r.data[0]
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async searchNodeByName ({ name }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          type: 'user',
          name: name
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async getMyEdges () {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-edge',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          userID: Auth.currentProfile.user.userID
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async removeMyEdge ({ edge }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-edge',
      headers: getHeader(),
      data: {
        method: 'remove-one',
        payload: {
          _id: edge._id
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async getUserByIDList ({ idList }) {
    let axios = (await import('axios')).default
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-user',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          'sort': '-created_at',
          'list': idList
        }
      }
    })

    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async getUserGraph ({ userID }) {
    let [
      nodes,
      links
    ] = await Promise.all([
      Graph.listUserNodes({ userID }),
      Graph.listUserEdges({ userID })
    ])

    return {
      nodes, links
    }
  }
}
