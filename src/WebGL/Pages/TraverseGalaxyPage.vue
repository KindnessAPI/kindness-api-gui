<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" :style="{
      zIndex: -1,
    }" ref="mounter"></div>

    <div v-show="!openMenu" class="full relative">
      <TopNavBar @menu="openMenu = !openMenu"></TopNavBar>

      <ScissorArea
      class="webgl-bg"
      :key="'webgloading'"
      :render="this.mainArea === 'loading'"
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
      </ScissorArea>

      <TraverseNodeEdgeUnit
      :style="{
        __visibility: this.mainArea === 'traverse' ? 'visible' : 'hidden',
        backgroundColor: this.mainArea === 'traverse' ? `#251b69` : 'transparent',
        backgroundImage: this.mainArea === 'traverse' ? `url(${require('./AppUnits/hdri/sky-space-milky-way-stars-110854.jpg')})` : '',
        backgroundSize: 'cover',
        backgroundPosition: `center center`
      }"
      :btns="btns"
      @home="onGoHome"
      @view="onViewProfile"
      @node-click="onNodeClick"
      :graph="graph"
      >
        <Spaceship></Spaceship>
      </TraverseNodeEdgeUnit>

      <div v-if="overlay" @click="overlay = false" class="overlay-close"></div>

      <NodePanelUnit
        @close="overlay = false"
        @reload="onReload"
        :editable="isOnMyPage"
        :currentNode="currentNode"
        :graph="graph"

        :userID="queryUserID"
        :username="queryUsername"
        v-if="currentNode && graph && overlay === 'node-panel'"
      ></NodePanelUnit>

      <!--
      <NodeViewerUnit
        @close="overlay = false"
        @reload="onReload"

        :currentNode="currentNode"
        :graph="graph"

        :userID="queryUserID"
        :username="queryUsername"
        v-if="currentNode && graph && overlay === 'node-viewer'"
      ></NodeViewerUnit> -->

      <!-- <AddFriendUnit
        v-if="overlay === 'add-friend'"
        @close="overlay = false"
        @reload="onReload"
      ></AddFriendUnit>

      <WritePostUnit
        v-if="overlay === 'write-post'"
        @close="overlay = false"
        @reload="onReload"
      ></WritePostUnit> -->

      <!-- <DebugUnit
        @close="overlay = false"
        :userID="userID"
        :username="username"
        @reload="onReload"
        v-if="overlay === 'debug'"
      ></DebugUnit> -->

      <div v-if="overlay" @click="overlay = false" class="overlay-close-btn">
      </div>

    </div>
    <FullMenuBar v-show="openMenu" @close="openMenu = false"></FullMenuBar>
  </div>
</template>

<script>
import { PipeScissor, makeScrollBox } from '../Reusable'
import { Auth, Graph, LamdaClient, getWS, getID } from '../../APIs/KA'

// import axios from 'axios'
export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
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
.webgl-bg{
  position: absolute;
  top: 60px;
  left: 0px;
  width: 100%;
  height: calc(100% - 60px);
}
.overlay-close {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 10;
  background-color: rgba(125,125,125,0.75);
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
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  z-index: 11;
  background-color: white;
}
@screen lg {
  .overlay {
    position: absolute;
    top: 50px;
    left: 50px;
    right: 50px;
    bottom: 50px;
  }
}
</style>
