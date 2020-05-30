<template>
  <main class="w-full max-w-6xl">
      <div class="lg:flex">
          <div class="w-full lg:w-1/2 my-6 pr-0 lg:pr-6 sticky-quotes-top">
              <p class="text-2xl pb-6 items-center inline-block cursor-pointer" @click="$emit('back')">
                  ← Back
              </p>
              <div class="leading-loose">
                  <form class="p-10 bg-white rounded shadow-xl" @submit.prevent="onSubmit()">
                      <div class="mb-2">
                        <label class="block text-sm text-gray-600" for="name">Title</label>
                        <input v-model="paper.title" class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" id="name" name="name" type="text" required="" placeholder="Title" aria-label="">
                      </div>
                      <div class="mb-2">
                        <label class="block text-sm text-gray-600" for="name">Auto Add Author</label>
                        <input v-model="paper.author" class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" id="name" name="name" type="text" required="" placeholder="Author" aria-label="">
                      </div>
                      <div class="mb-2">
                        <label class=" block text-sm text-gray-600" for="message">Quotes</label>
                        <textarea v-model="paper.text" class="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded quote-textarea" rows="5" id="message" name="message" required="" placeholder="Your Quotes.." aria-label=""></textarea>
                      </div>
                      <div class="mb-2">
                        <button class="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="submit">Submit</button>
                      </div>
                  </form>
              </div>
          </div>
          <div class="w-full ml-auto generated-quotes my-6">
            <div class="px-6">
              <p class="text-2xl pb-6 flex items-center">
                Generated Quote Cards
              </p>
              <CTQuoteDisplay :paper="paper"></CTQuoteDisplay>
            </div>
          </div>
      </div>
  </main>
</template>

<script>
import { Quotes } from '../../../../APIs/KA'
export default {
  props: {
    init: {}
  },
  components: {
    CTQuoteDisplay: require('./CTQuoteDisplay.vue').default
  },
  mounted () {
    if (this.init) {
      this.paper = this.init
    }
  },
  data () {
    return {
      // paper: {
      //   generated: [],
      //   title: `Lok Lok Life Stories`,
      //   author: Auth.currentProfile.user.username,
      //   // eslint-disable-next-line
      //   text: require('raw-loader!./lok-writings.md').default
      // }
      paper: this.getTemplate()
    }
  },
  methods: {
    getTemplate () {
      return Quotes.getTemplate()
    },
    scan (paper) {
      let res = Quotes.scan(this.paper)
      return res
    },
    onSubmit () {
      this.paper.generated = Quotes.scan(this.paper)
      this.$emit('submitform', {
        paper: this.paper
      })
      this.$emit('back')
    }
  }
}
</script>

<style lang="postcss">
@screen lg {
  .sticky-quotes-top{
    position: fixed;
    top: 60px;
    width: 550px;
    max-height: calc(100vh - 100px);
    overflow-y: scroll;
  }
  .generated-quotes{
    width: calc(100% - 550px);
  }
  .quote-textarea{
    height: calc(100vh - 500px);
  }
}
</style>
