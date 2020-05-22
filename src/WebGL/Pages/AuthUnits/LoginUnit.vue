<template>
  <div class="py-32 lg:py-min20 relative">
    <ScissorArea class="w-full h-full absolute top-0 left-0" style="z-index: -1">
      <div slot="dom">
      </div>
      <DashboardScene slot="o3d"></DashboardScene>
      <!-- <MotherBoardScene slot="o3d"></MotherBoardScene> -->
    </ScissorArea>
    <div class="w-full max-w-xs mx-auto">
      <form class="shadow-lg rounded-lg px-8 pt-6 pb-6 mb-4 relative bgcolor" @submit.prevent="onSubmit">
        <div class="mb-4">
          <label class="block text-blue-800 text-sm font-bold mb-2" for="username">
            Username or Email
          </label>
          <input v-model="auth.identity" class="shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username or Email">
        </div>
        <div class="mb-4">
          <label class="block text-blue-800 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input v-model="auth.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 mb-2 leading-tight focus:outline-none focus:shadow-outline" :class="{ 'border-red-500': err.badPW }" id="password" type="password" placeholder="***********">
          <p v-if="err.badPW" class="text-red-500 text-xs italic">Bad credentials.</p>
        </div>

        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" @click="onSubmit">
            Login
          </button>
          <router-link class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/register">
            Switch to Registration
          </router-link>
        </div>

        <p class="text-green-500 text-xs italic" :key="'m' + ii" v-for="(msg, ii) in msgs">{{ msg }}</p>

        <p class="text-center text-gray-800 text-xs pt-6">
          Made with love by @wonglok831
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { Auth } from '../../../APIs/KA'

export default {
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      msgs: [],
      err: {
        badPW: false
      },
      auth: {
        identity: '',
        password: ''
      }
    }
  },
  watch: {
    msgs () {
      window.dispatchEvent(new Event('resize'))
    }
  },
  methods: {
    async onSubmit () {
      this.msgs = ['loading']
      this.err.badPW = false
      let { identity, password } = this.auth
      Auth.login({ identity, password })
        .then(profile => {
          this.msgs = []
          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect)
          } else {
            this.$router.push('/galaxy')
          }
          // console.log(profile)
        }, (e) => {
          this.msgs = []
          this.err.badPW = true
          console.log(e)
        })
    }
  }
}
</script>

<style scoped>
.bgcolor{
  background-color: rgba(255,255,255,0.8);
}
.overlaybg{
  background-color: rgba(0, 0, 0, 0.589);
}
</style>
