<template>
  <div>
    <div class="mb-5 border-gray-400 border shadow-lg rounded-lg bg-white" v-for="quote in scan(paper)" :key="quote.idx">
      <div class="p-3">{{ quote.sentence }}</div>
      <div class="py-2 px-3 text-right border-t border-gray-400 text-xs text-gray-600" v-if="paper.author || quote.overrideAutor">
        {{ quote.overrideAutor || quote.author }}
      </div>
    </div>
  </div>
</template>

<script>
import { Quotes } from '../../../../APIs/KA'

export default {
  props: {
    paper: {}
  },
  methods: {
    scan (paper) {
      let res = Quotes.scan(this.paper)
      console.log(res)
      return res
    }
  }
}
</script>

<style>

</style>
