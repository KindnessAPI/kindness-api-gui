<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div :key="q.uri" v-for="q in quotes">
      {{ quotes }}
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import * as API from '../ka/api.js'
export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data () {
    return {
      quotes: []
    }
  },
  async mounted () {
    let quotes = await API.load({ pageAt: 0, perPage: 10 })
    let bucket = []
    for (let kn in quotes.data) {
      bucket.push(quotes.data[kn])
    }
    quotes.data = bucket
    this.quotes = JSON.parse(JSON.stringify(quotes))
  }
}
</script>
