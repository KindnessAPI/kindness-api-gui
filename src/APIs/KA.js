import axios from 'axios'
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

let socket = new LambdaClient({
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

export class LambdaClient extends EventEmitter {
  constructor ({ url, nickname, roomID, token }) {
    super()
    this.url = url
    this.nickname = nickname
    this.roomID = roomID
    this.autoReconnectInterval = 5 * 1000
    this.token = token
    this.open()
  }

  $on (event, handler) {
    this.on(event, handler)
  }

  $emit (event, data) {
    this.ensureSend({
      token: this.token,
      roomID: this.roomID,
      ...data,
      type: event
    })
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
        // console.log(detail)

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
      text,
      channelID: this.roomID,
      token: this.token
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

export class Profile {
  static async getProfilesByQuery ({ query }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-profile',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          $or: [
            {
              displayName: { $regex: query, $options: 'i' }
            },
            {
              username: { $regex: query, $options: 'i' }
            }
          ],
          limit: 50
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async getProfileByUserID ({ userID }) {
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

  static async searchProfileByDisplayName ({ displayName }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-profile',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          displayName,
          limit: 15
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async getProfileByUserIDList ({ list }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-profile',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          userID: { $in: list },
          skip: 0,
          limit: 500
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async provideProfile ({ userID }) {
    // photo = photo || `https://picsum.photos/id/${(Math.random() * 1200).toFixed(0)}/256/256`

    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-profile',
      headers: getHeader(),
      data: {
        method: 'provide',
        payload: {
          userID
          // get: {
          //   userID
          // },
          // create: {
          //   type: 'user',
          //   userID,
          //   username,

          //   displayName: username,
          //   bio: '',

          //   instagramURL: '',
          //   youtubeURL: '',
          //   twitterURL: '',

          //   displayShip: true,

          //   photoImg: photo,
          //   bgImg: '',
          //   loadingImg: '',

          //   tags: [{ text: 'first-profile' }]
          // }
        }
      }
    })
    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async createProfile ({ userID, username, photo }) {
    photo = photo || `https://picsum.photos/id/${(Math.random() * 1200).toFixed(0)}/256/256`

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
  static async createFriendTraverseNode ({ profileUsername, profileUserID, name = 'New User', photo }) {
    photo = photo || `https://picsum.photos/id/${(Math.random() * 1200).toFixed(0)}/200/200`
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

  static async linkFriendTraverseNode ({ fromID, toID, fromPerson, toPerson }) {
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
          value: {
            fromPerson,
            toPerson
          },
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

  // static async addUserNode ({ profileUsername, profileUserID, name = 'New User', photo }) {
  //   photo = photo || `https://picsum.photos/id/${(Math.random() * 1200).toFixed(0)}/200/200`

  //   let resp = axios({
  //     baseURL: getRESTURL(),
  //     method: 'POST',
  //     url: '/access-node',
  //     headers: getHeader(),
  //     data: {
  //       method: 'create',
  //       payload: {
  //         name: name,
  //         img: photo,
  //         type: 'user',
  //         value: {
  //           username: profileUsername,
  //           userID: profileUserID
  //         },
  //         tags: [
  //           {
  //             text: 'early-bird'
  //           }
  //         ]
  //       }
  //     }
  //   })
  //   return resp.then((r) => {
  //     return r.data
  //   }, (err) => {
  //     return Promise.reject(err)
  //   })
  // }

  // ----
  static async listUserNodes ({ userID }) {
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
  static async listUserEdges ({ userID }) {
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

  static async queryEdgesSourceNode ({ nodeID }) {
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

  static async removeEdgeByID ({ edgeID }) {
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

  static async removeEdgesByIDList ({ list }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-edge',
      headers: getHeader(),
      data: {
        method: 'remove-many',
        payload: {
          list
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

  static async provideUserNode ({ userID }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-node',
      headers: getHeader(),
      data: {
        method: 'provide',
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

  static async getMyNode () {
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

export class MyFiles {
  static getURLfromCloudinary ({ cloudinary }) {
    return {
      thumb: cloudinary.secure_url.replace('/upload/', '/upload/w_256,h_256,c_fill,g_auto:0,q_auto/'),
      banner: cloudinary.secure_url.replace('/upload/', '/upload/w_1024,q_auto/'),
      square: cloudinary.secure_url.replace('/upload/', '/upload/w_1024,h_1024,c_fill,g_auto:0,q_auto/'),
      img: cloudinary.secure_url.replace(`/upload/`, `/upload/q_auto/`),
      raw: cloudinary.secure_url
    }
  }

  static UPLOAD_URL = `https://api.cloudinary.com/v1_1/loklok-keystone/image/upload`
  /* eslint-disable */
  static snapshotResize (srcData, width, height) {
    var imageObj = new Image(),
        canvas   = document.createElement("canvas"),
        ctx      = canvas.getContext('2d'),
        xStart   = 0,
        yStart   = 0,
        aspectRadio,
        newWidth,
        newHeight;

    imageObj.src  = srcData;
    canvas.width  = width;
    canvas.height = height;

    aspectRadio = imageObj.height / imageObj.width;

    if(imageObj.height < imageObj.width) {
      //horizontal
      aspectRadio = imageObj.width / imageObj.height;
      newHeight   = height,
      newWidth    = aspectRadio * height;
      xStart      = -(newWidth - width) / 2;
    } else {
      //vertical
      newWidth  = width,
      newHeight = aspectRadio * width;
      yStart    = -(newHeight - height) / 2;
    }

    return new Promise((resolve) => {
      imageObj.onload = () => {
        ctx.drawImage(imageObj, xStart, yStart, newWidth, newHeight);

        let res = canvas.toDataURL("image/jpeg", 0.75);
        resolve(res)
      }
    })
  }
  /* eslint-enable */

  static dataURItoBlob (dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1])

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length)
    var ia = new Uint8Array(ab)
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    // Old Code
    // write the ArrayBuffer to a blob, and you're done
    // var bb = new BlobBuilder();
    // bb.append(ab);
    // return bb.getBlob(mimeString);

    // New Code
    return new Blob([ab], { type: mimeString })
  }
  static toBase64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  static imageToURI (image, isURI) {
    return new Promise((resolve) => {
      var canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth // or 'width' if you want a special/scaled size
      canvas.height = image.naturalHeight // or 'height' if you want a special/scaled size

      canvas.getContext('2d').drawImage(image, 0, 0)

      // Get raw image data
      if (isURI) {
        resolve(canvas.toDataURL('image/jpg'))
      } else {
        resolve(canvas.toDataURL('image/jpg').replace(/^data:image\/(png|jpg)base64,/, ''))
      }
    })
  }
  static async getMyFiles ({ userID = Auth.currentProfile.user.userID, pageAt = 0, perPage = 20 }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-file',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          userID,
          skip: pageAt * perPage,
          limit: perPage,
          sort: '-created_at'
        }
      }
    })

    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }
  static async createCloudinaryFile ({ cloudinary, filename, ext, mime, base64 }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-file',
      headers: getHeader(),
      data: {
        method: 'create',
        payload: {
          type: 'cloudinary',
          filename,
          ext,
          mime,
          cloudinary,
          tags: []
        }
      }
    })

    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async deleteCloudinaryFileByList ({ objs = [] }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-file',
      headers: getHeader(),
      data: {
        method: 'remove-objs',
        payload: {
          objs
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

export class Message {
  static async getMyRoomMessage ({ channelID, pageAt = 0, perPage = 50 }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-message',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          channelID: channelID,
          skip: pageAt * perPage,
          limit: perPage,
          sort: '-created_at'
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

export class Channel {
  static async updateChannelByMembers ({ edit }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-channel',
      headers: getHeader(),
      data: {
        method: 'update-by-members',
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

  static async getMyChannels ({ userID }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-channel',
      headers: getHeader(),
      data: {
        method: 'query',
        payload: {
          $or: [
            { userID },
            { 'members.profile.userID': userID }
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

  static async removeChannelAndMessages ({ channelID }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-channel',
      headers: getHeader(),
      data: {
        method: 'remove-channel-and-messages',
        payload: {
          channelID
        }
      }
    })

    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }

  static async createChannel ({ members, userID, username, title, img = '' }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-channel',
      headers: getHeader(),
      data: {
        method: 'create',
        payload: {
          userID,
          username,

          type: 'chat', // dm
          members,
          /*
          [{
            username: String,
            userID: String,
            isAdmin: Boolean
          }]
          */

          lastMessageSent: '',
          lastMessageDate: new Date(),

          title,
          img,
          tags: [{ text: 'chat-room' }]
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

export class Prayer {
  static async getMyReceivedPrayer ({ prayerID, pageAt = 0, perPage = 25 }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-prayer',
      headers: getHeader(),
      data: {
        method: 'my-received-prayers',
        payload: {
          prayerID,
          skip: pageAt * perPage,
          limit: perPage
        }
      }
    })

    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }
  static async getMySentPrayer ({ pageAt = 0, perPage = 25 }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-prayer',
      headers: getHeader(),
      data: {
        method: 'my-sent-prayers',
        payload: {
          skip: pageAt * perPage,
          limit: perPage
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

export class Notification {
  static async getMyNotifications ({ pageAt = 0, perPage = 50, fromUserID }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-notification',
      headers: getHeader(),
      data: {
        method: 'get-my-notifications',
        payload: {
          fromUserID,
          skip: pageAt * perPage,
          limit: perPage
        }
      }
    })

    return resp.then((r) => {
      return r.data
    }, (err) => {
      return Promise.reject(err)
    })
  }
  static async udpateNotificationStatus ({ isRead, list }) {
    let resp = axios({
      baseURL: getRESTURL(),
      method: 'POST',
      url: '/access-notification',
      headers: getHeader(),
      data: {
        method: 'update-notifications-read-status',
        payload: {
          list,
          isRead
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
