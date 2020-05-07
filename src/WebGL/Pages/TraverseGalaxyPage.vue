<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" :style="{
      zIndex: -1,
    }" ref="mounter"></div>

    <div v-show="!openMenu" class="full relative">
      <TopNavBar @menu="openMenu = !openMenu"></TopNavBar>

      <!--  -->

      <!-- <ScissorArea
      class="webgl-bg"
      :key="'webgloading'"
      v-if="this.mainArea === 'loading'"
      >
        <div
          slot="dom"
          class="full flex justify-center items-center text-3xl text-white"
        >
          <div>
            Traversing Galaxy
            <br/>
            Please wait... ⏱
          </div>
        </div>
        <StarFlowScene slot="o3d">
        </StarFlowScene>
      </ScissorArea> -->

      <div class="simple-bg"
        :style="{
          backgroundColor: this.mainArea === 'loading' ? `#251b69` : '#251b69',
          backgroundImage: this.mainArea === 'loading' ? `url(${require('./AppUnits/hdri/sky-space-milky-way-stars-110854.jpg')})` : `url(${require('./AppUnits/hdri/astronomy-atmosphere-earth-exploration-220201.jpg')})`,
          backgroundSize: this.mainArea === 'loading' ? 'cover' : 'cover',
          backgroundPosition: this.mainArea === 'loading' ? `center center` : 'center center',
          backgroundRepeat: this.mainArea === 'loading' ? `no-repeat no-repeat` : 'no-repeat no-repeat'
        }"
        >

      </div>

      <TraverseNodeEdgeUnit
      :style="{
        __visibility: this.mainArea === 'traverse' ? 'visible' : 'hidden',
        __backgroundColor: this.mainArea === 'traverse' ? `#251b69` : '',
        __backgroundImage: this.mainArea === 'traverse' ? `url(${require('./AppUnits/hdri/sky-space-milky-way-stars-110854.jpg')})` : '',
        backgroundSize: 'cover',
        backgroundPosition: `center center`
      }"
      :btns="btns"
      @home="onGoHome"
      @view="onViewProfile"
      @node-click="onNodeClick"
      :graph="graph"
      >
        <O3D ref="o3d">
          <Spaceship></Spaceship>
        </O3D>
      </TraverseNodeEdgeUnit>

      <div v-if="this.mainArea === 'loading'" class="overlay-loading">
        <div
          class="full flex justify-center items-center text-3xl text-white"
        >
          <div class="p-6 rounded-lg text-white bg-translucent">
            Traversing Galaxy <br/>
            Please wait...✨
          </div>
        </div>
      </div>

      <div v-if="this.mainArea === 'not-ready'" class="overlay-loading">
        <div
          class="full flex justify-center items-center text-3xl text-white"
        >
          <div class="p-6 rounded-lg text-white bg-translucent">
            Profile Not Ready
          </div>
        </div>
      </div>

      <!-- <div v-if="overlay" @click="overlay = false" class="overlay-bg"></div> -->
      <div v-if="overlay" @click="overlay = false" class="overlay-close"></div>

      <NodePanelUnit
        @close="overlay = false"
        @reload="onReload"
        :editable="isOnMyPage"
        :node="currentNode"
        :graph="graph"

        :userID="queryUserID"
        :username="queryUsername"
        v-if="currentNode && graph && overlay === 'node-panel'"
      ></NodePanelUnit>

      <div v-if="overlay" @click="overlay = false" class="overlay-close-btn">
      </div>

    </div>
    <FullMenuBar v-show="openMenu" @close="openMenu = false"></FullMenuBar>
  </div>
</template>

<script>
import { PipeScissor, makeScrollBox } from '../Reusable'
import { Auth, Graph, LamdaClient, getWS, getID, Profile } from '../../APIs/KA'

// import axios from 'axios'
export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
      profile: false,
      layouts: {},
      currentNode: false,
      mainArea: 'traverse',
      btns: [],
      socket: false,
      escFncs: [],
      username: false,
      userID: false,
      overlay: false,
      graph: false,
      Auth,
      openMenu: false,
      origColor: '',
      bgColor: '#fafafa'
    }
  },
  watch: {
    'overlay' () {
      if (this.overlay) {
        this.escFncs.push(() => {
          this.overlay = false
        })
      }
    },
    'queryUserID' () {
      this.onReset()
      this.onInit()
    }
  },
  computed: {
    queryUserID () {
      return this.$route.params.userID
    },
    queryUsername () {
      return this.$route.params.username
    },
    isOnMyPage () {
      return Auth.currentProfile.user.userID === this.queryUserID
    }
  },
  methods: {
    onViewProfile () {
      let node = this.graph.nodes.find(e => e.userID === this.queryUserID && e.type === 'user')
      this.onNodeClick(node)
    },
    onGoHome () {
      this.$router.push(`/profile/${Auth.currentProfile.user.username}/${Auth.currentProfile.user.userID}`)
    },
    onSetupBtns () {
      this.btns = []
      if (!this.isOnMyPage) {
        this.btns.push({
          text: `🏠`,
          event: 'home'
        })
      }
      this.btns.push({
        text: `@${this.queryUsername}`,
        event: 'view'
      })
    },
    onReset () {
      this.btns = []
      this.graph = {
        nodes: [],
        links: []
      }
      if (this.socket) {
        this.socket.close()
      }
    },
    // onMeClick () {
    //   this.userID = Auth.currentProfile.user.userID
    //   this.username = Auth.currentProfile.user.username
    //   this.overlay = 'node-panel'
    // },
    onNodeClick (node) {
      this.currentNode = node

      if (this.isOnMyPage) {
        this.overlay = 'node-panel'
      } else {
        if (node.type === 'traverse') {
          this.$router.push(`/profile/${node.value.username}/${node.value.userID}`)
        } else {
          this.overlay = 'node-panel'
        }
      }
    },
    async onReload () {
      this.mainArea = 'loading'
      this.socket.notifyGraphChange()
      // let graph = this.graph
      // this.graph = {
      //   nodes: [],
      //   links: []
      // }
      // setTimeout(() => {
      //   this.graph = graph
      // }, 10)
      // await this.downloadGraph()
    },
    async downloadGraph () {
      this.mainArea = 'loading'
      let graphData = await Graph.getUserGraph({ userID: this.queryUserID })
      let needToReload = false
      for (let link of graphData.links) {
        if ((!graphData.nodes.some(n => n._id === link.source) || !graphData.nodes.some(n => n._id === link.target))) {
          await Graph.removeEdgeByID({ edgeID: link._id })
          console.log('broken edge found')
          needToReload = true
        }
      }
      if (needToReload) {
        graphData = await Graph.getUserGraph({ userID: this.queryUserID })
      }
      this.graph = graphData
      this.mainArea = 'traverse'
    },
    async getMyNode () {
      let mynode = await Graph.getMyNode()
        .then(r => r, () => false)
      return mynode
    },
    async createMyNode () {
      if (!(Auth.currentProfile && Auth.currentProfile.user.username)) {
        return
      }
      // if (Auth.currentProfile.user.userID !== this.queryUserID) {
      //   this.mainArea = 'not-ready'
      //   this.$router.go(-1)
      //   throw new Error('cannot create other people\'s profile')
      // }
      let mynode = await Graph.addUserNode({
        name: Auth.currentProfile.user.username,
        profileUsername: Auth.currentProfile.user.username,
        profileUserID: Auth.currentProfile.user.userID
      })
        .then(r => r, () => false)
      return mynode
    },
    async makeSocket () {
      let socket = this.socket = new LamdaClient({
        url: getWS(),
        roomID: 'room-' + this.queryUserID,
        nickname: Auth.currentProfile.user.username + '@' + getID()
      })

      socket.on('text', (data) => {
        let html = `<pre>${data.type} - ${JSON.stringify(data)}</pre>`
        console.log(html)
      })

      // socket.sendText({ text: '1231232' })

      socket.on('online', (data) => {
        let html = `<pre>me: ${socket.nickname} - ${JSON.stringify(data)}</pre>`
        console.log(html)
      })

      socket.on('ws-graph-change', async (data) => {
        console.log('reload received')
        await this.downloadGraph()
      })
    },
    async initProfile () {
      try {
        let me = Auth.currentProfile.user
        let profile = await Profile.getProfileByUserID({ userID: me.userID })
        if (!profile) {
          // if (Auth.currentProfile.user.userID !== this.queryUserID) {
          //   this.mainArea = 'not-ready'
          //   this.$router.go(-1)
          //   throw new Error('cannot create other people\'s profile')
          // }
          profile = await Profile.createProfile({ userID: me.userID, username: me.username })
        }
        this.profile = profile
      } catch (e) {
        console.log(e)
      }
    },
    async onInit () {
      this.mainArea = 'loading'
      this.onReset()
      await this.makeSocket()
      let mynode = await this.getMyNode()
      // patch mynode without value
      if (mynode && !mynode.value) {
        mynode = {
          ...mynode,
          value: {
            username: Auth.currentProfile.user.username,
            userID: Auth.currentProfile.user.userID
          }
        }
        await Graph.updateMyNode({ edit: mynode })
      }
      if (!mynode) {
        await this.createMyNode()
        this.socket.notifyGraphChange()
      }
      await this.initProfile()
      await this.downloadGraph()
      this.onSetupBtns()
      this.mainArea = 'traverse'
    }
  },
  async mounted () {
    this.$watch('openMenu', () => {
      window.dispatchEvent(new Event('resize'))
    })
    this.scrollBox = makeScrollBox({ dom: window, base: this.base })

    await this.onInit()

    window.addEventListener('keydown', (evt) => {
      if (evt.keyCode === 27) {
        this.$emit('esc')
      }
    })

    window.addEventListener('reload-graph', () => {
      this.onReload()
    })

    this.$on('esc', () => {
      let popped = this.escFncs.pop()
      if (popped) {
        popped()
      }
    })

    // this.base.onLoop(() => {
    //   let time = window.performance.now() * 0.001
    //   this.$refs['o3d'].o3d.rotation.z = time
    // })

    // let axios = require('axios').default
    // axios.post('http://localhost:3333/login', {
    //   username: 'lok',
    //   email: 'lok@lok.com',
    //   password: 'loklok-test'
    // })
    //   .then(r => r.data)
    //   .then(console.log)

    this.origColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = this.bgColor
  },
  beforeDestroy () {
    this.onReset()
    document.body.style.backgroundColor = this.origColor
  }
}
</script>

<style lang="postcss" scoped>
.simple-bg{
  position: absolute;
  top: 60px;
  left: 0px;
  width: 100%;
  height: calc(100% - 60px);
}

.overlay-bg{
  position: absolute;
  top: 60px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 10;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat no-repeat;
  background-image: url('./AppOverlay/img/mb-lines-svg-2.svg');
  background-color: rgba(0, 0, 0, 0.61);
  opacity: 0.6;
}
.overlay-close {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 11;
  background-color: rgba(0, 0, 0, 0.589);
}
.overlay-loading{
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 12;
}
.overlay-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  /* background-color: rgba(0,0,0,0.75); */
  z-index: 12;
}
.overlay {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 12;
  background-color: rgba(255, 255, 255, 0.904);
}
@screen lg {
  .overlay {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }
}
.bg-translucent{
  background-color: rgba(0, 0, 0, 0.418);
  box-shadow: 0px 0px 30px 0px rgb(30, 30, 30);
}
</style>
