<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" :style="{ zIndex: -1 }" ref="mounter"></div>

    <div v-show="!openMenu" class="full relative">
      <TopNavBar @menu="openMenu = !openMenu"></TopNavBar>

      <TraverseGalaxyUnit
      @debug="overlay = 'debug'"
      @node-click="onNodeClick"
      :graph="graph"
      >
      </TraverseGalaxyUnit>

      <div v-if="overlay" @click="overlay = false" class="overlay-close"></div>

      <UserProfileUnit
        @close="overlay = false"
        :userID="userID"
        :username="username"
        :graph="graph"
        @reload="onRealod"
        v-if="overlay === 'user-profile'"
      ></UserProfileUnit>

      <DebugUnit
        @close="overlay = false"
        :userID="userID"
        :username="username"
        @reload="onRealod"
        v-if="overlay === 'debug'"
      ></DebugUnit>

    </div>
    <FullMenuBar v-show="openMenu" @close="openMenu = false"></FullMenuBar>
  </div>
</template>

<script>
import { PipeScissor, makeScrollBox } from '../Reusable'
import { Auth, Graph } from '../../APIs/KA'

// import axios from 'axios'
export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
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
  methods: {
    onNodeClick (node) {
      if (node.type === 'user') {
        this.userID = node.userID
        this.username = node.username
        this.overlay = 'user-profile'
      }
    },
    async onRealod () {
      this.graph = await Graph.getBasicGraph()
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
      let mynode = await Graph.addUserNode({ name: Auth.currentProfile.user.username })
        .then(r => r, () => false)
      return mynode
    },
    async onInit () {
      let mynode = await this.getMyNode()
      if (!mynode) {
        await this.createMyNode()
      }
      this.graph = await Graph.getBasicGraph()
      this.graph.nodes.forEach((node) => {
        if (node.userID === Auth.currentProfile.user.userID) {
          node.name += ` (me)`
          node.isMySelf = true
        } else {
          node.isMySelf = false
        }
      })
    }
  },
  async mounted () {
    this.$watch('openMenu', () => {
      window.dispatchEvent(new Event('resize'))
    })
    this.scrollBox = makeScrollBox({ dom: window, base: this.base })
    await this.onInit()

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
    document.body.style.backgroundColor = this.origColor
  }
}
</script>

<style scoped>
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
  top: 40px;
  left: 40px;
  right: 40px;
  bottom: 40px;
  z-index: 11;
  background-color: white;
}
</style>
