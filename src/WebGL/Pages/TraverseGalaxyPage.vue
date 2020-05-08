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

      <transition name="fade">
        <div class="simple-bg"
          v-if="this.mainArea === 'loading'"
          :style="{
            backgroundColor: '#251b69',
            backgroundImage: `url(${loadingBG})`,
            backgroundSize:'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat no-repeat'
          }"
          >
        </div>
      </transition>

      <transition name="fade">
        <div class="simple-bg"
          v-if="this.mainArea === 'traverse'"
          :style="{
            backgroundColor: '#251b69',
            backgroundImage: `url(${readyBG})`,
            backgroundSize:'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat no-repeat'
          }"
          >
        </div>
      </transition>

      <TraverseNodeEdgeUnit
      :btns="btns"
      @home="onGoHome"
      @view="onViewProfile"
      @node-click="onNodeClick"
      :graph="graph"
      ref="edge-node"
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
      bg: {
        stars: require('./AppUnits/hdri/sky-space-milky-way-stars-110854.jpg'),
        earth: require('./AppUnits/hdri/astronomy-atmosphere-earth-exploration-220201.jpg'),
        galaxy: require('./AppUnits/hdri/sky-space-dark-galaxy-2150.jpg')
      },
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
    loadingBG () {
      if (this.profile && this.profile.loadingImg) {
        return this.profile.loadingImg
      }
      return this.bg.galaxy
    },
    readyBG () {
      if (this.profile && this.profile.bgImg) {
        return this.profile.bgImg
      }
      return this.bg.stars
    },
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
      this.overlay = 'node-panel'

      // ----
      // if (this.isOnMyPage) {
      //   this.overlay = 'node-panel'
      // } else {
      //   if (node.type === 'traverse') {
      //     this.$router.push(`/profile/${node.value.username}/${node.value.userID}`)
      //   } else {
      //     this.overlay = 'node-panel'
      //   }
      // }
    },
    async onReload () {
      await this.initMyProfile()
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
    updateBadgeByUserID ({ userID, badge }) {
      let node = this.graph.nodes.find(n => n.type === 'traverse' && n.value.userID === userID)
      node.badge = badge
      this.updateBadgeByNode(node)
    },
    updateBadgeByNode (node) {
      node.badge = node.badge || 0
      this.$refs['edge-node'].$emit('badge', node)
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
    async initMyProfile () {
      try {
        let me = Auth.currentProfile.user
        let profile = await Profile.getProfileByUserID({ userID: me.userID })
        if (!profile) {
          profile = await Profile.createProfile({ userID: me.userID, username: me.username })
        }
        this.profile = profile
      } catch (e) {
        console.log(e)
      }
    },
    async initMyNode () {
      await Graph.provideMyNode()
    },
    async onInit () {
      this.mainArea = 'loading'
      this.onReset()
      await this.makeSocket()
      await this.initMyNode()
      await this.initMyProfile()
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
  top: 60px;
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
  transform: translateY(-30px);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
