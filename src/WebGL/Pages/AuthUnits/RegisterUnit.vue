<template>
  <div class="py-32 lg:py-min20 relative" ref="formarea">
    <ScissorArea class="w-full h-full absolute top-0 left-0" style="z-index: -1;">
      <div slot="dom">
      </div>
      <MotherBoardScene slot="o3d"></MotherBoardScene>
    </ScissorArea>
    <div class="w-full max-w-xs mx-auto">
      <form class="shadow-lg rounded-lg px-8 pt-6 pb-6 mb-4 relative bgcolor" @submit.prevent="onSubmit">
        <div class="mb-4">
          <label class="block text-teal-800 text-sm font-bold mb-2" for="username">
            Username
          </label>
          <input v-model="auth.username" class="shadow appearance-none border rounded w-full py-2 px-3 text-teal-800 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
        </div>
        <div class="mb-4">
          <label class="block text-teal-800 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input v-model="auth.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-teal-800 leading-tight focus:outline-none focus:shadow-outline" :class="{ 'border-red-500': false }" id="password" type="password" placeholder="***********">
        </div>
        <div class="mb-8">
          <label class="block text-teal-800 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input v-model="auth.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-teal-800 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email">
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" @click="onSubmit">
            Register
          </button>
          <router-link class="inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800" to="/login">
            Switch to Login
          </router-link>
        </div>
        <p class="text-red-500 text-xs italic" :key="i" v-for="(err, i) in errs">{{ err }}</p>
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
      Store: Auth.Store,
      auth: {
        username: '',
        password: '',
        email: ''
      },
      msgs: [],
      errs: []
    }
  },
  watch: {
    msgs () {
      window.dispatchEvent(new Event('resize'))
    }
  },
  mounted () {
  },
  methods: {
    async onSubmit () {
      this.msgs = [
        'loading'
      ]
      this.errs = []
      let {
        username,
        password,
        email
      } = this.auth

      if (!username) {
        this.errs.push('Missing username')
      }
      if (!password) {
        this.errs.push('Missing password')
      }
      if (!email) {
        this.errs.push('Missing email')
      }

      if (!await Auth.checkUsername({ identity: email })) {
        this.errs.push('Email is taken')
      }

      if (!await Auth.checkUsername({ identity: username })) {
        this.errs.push('Username is taken')
      }

      // if (this.errs.some(e => e.indexOf('is taken') !== -1)) {
      //   this.msgs = ['Trying to login...']
      //   await Auth.login({
      //     identity: username,
      //     password
      //   }).then((profile) => {
      //     this.$router.push('/dashboard')
      //   }, () => {
      //     this.msgs = ['Trying to login...']
      //     return Auth.login({
      //       identity: email,
      //       password
      //     }).then((profile) => {
      //       this.$router.push('/dashboard')
      //     }, () => {
      //       this.msgs = []
      //     })
      //   })
      // }

      if (this.errs.length > 0) {
        this.msgs = []
        return
      }

      Auth.register({
        username,
        password,
        email
      }).then((profile) => {
        console.log(profile)
        this.$router.push('/dashboard')
      }, () => {
      })
    }
  }
}
</script>

<style scoped>
.bgcolor{
  background-color: rgba(255,255,255,0.8);
}
</style>
