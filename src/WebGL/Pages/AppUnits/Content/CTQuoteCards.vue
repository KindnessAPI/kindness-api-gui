<template>
  <div class="w-full mt-6 relative">
    <!-- <ScissorArea class="main-area-webgl" style="z-index: -1;">
      <div slot="dom" class="full">
      </div>
      <DashboardScene slot="o3d"></DashboardScene>
    </ScissorArea> -->
    <CTQuotePaperList v-if="mode === 'list' && list" :list="list" @nextPage="onNextPage" @prevPage="onPrevPage" @togglePublished="onTooglePublished"  @edit="onEdit" @remove="onRemove" @create="onCreate"></CTQuotePaperList>
    <CTQuotePaperEdit v-if="mode === 'create'" :init="initPaper" @back="mode = 'list'" @submitform="saveCreate($event)"></CTQuotePaperEdit>
    <CTQuotePaperEdit v-if="mode === 'edit' && toBeEdited" :init="toBeEdited" @back="mode = 'list'" @submitform="saveEdit($event)"></CTQuotePaperEdit>
    <span v-if="loading" class="inline-block text-4xl absolute top-0 right-0 p-6 bg-white shadow-lg border rounded-lg">Loading...</span>
  </div>
</template>

<script>
import { Quotes, Auth } from '../../../../APIs/KA.js'

export default {
  components: {
    ...require('../../../webgl').default
  },
  data () {
    return {
      pageAt: 0,
      toBeEdited: false,
      loading: false,
      list: [],
      mode: '',
      initPaper: this.getTemplate()
    }
  },
  watch: {
    routerMode () {
      if (this.$route.query.mode) {
        this.mode = this.$route.query.mode
      } else {
        this.mode = 'list'
      }
    },
    mode () {
      try {
        this.$router.push({
          path: this.$route.path,
          query: {
            mode: this.mode,
            enigma: (Math.random() * 100000).toFixed(0)
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  computed: {
    routerMode () {
      return JSON.stringify(this.$route.query)
    }
  },
  async mounted () {
    await this.onInit()
  },
  methods: {
    onNextPage () {
      this.pageAt++
      this.onLoad()
    },
    onPrevPage () {
      this.pageAt--
      if (this.pageAt < 0) {
        this.pageAt = 0
      }
      this.onLoad()
    },
    async onLoad () {
      this.loading = true
      this.list = await Quotes.listQuoteDocByUserID({ userID: Auth.currentProfile.user.userID, pageAt: this.pageAt, perPage: 25 })
      this.loading = false
      console.log(this.list)
    },
    async onInit () {
      await this.onLoad()

      if (this.list.length === 0) {
        this.mode = 'create'
      } else {
        this.mode = 'list'
      }
    },
    async saveCreate ({ paper }) {
      console.log(paper)
      await Quotes.createQuoteDoc({
        generated: paper.generated,
        title: paper.title,
        author: paper.author,
        published: paper.published,
        text: paper.text
      })
      await this.onLoad()
    },
    async onRemove ({ paper }) {
      if (window.prompt(`Remove ${paper.title} and ${paper.generated.length} Quotes within? Type "delete${paper.generated.length}" to confirm.`) === `delete${paper.generated.length}`) {
        await Quotes.removeQuoteDoc({ remove: paper })
        await this.onLoad()
      }
    },
    async saveEdit ({ paper }) {
      console.log(paper)
      this.loading = true
      await Quotes.editQuoteDoc({
        edit: paper
      })
      this.loading = false
      await this.onLoad()
    },
    async onTooglePublished ({ paper }) {
      paper.published = !paper.published
      this.loading = true
      await Quotes.editQuoteDoc({
        edit: paper
      })
      this.loading = false
      await this.onLoad()
    },
    async onEdit ($event) {
      this.toBeEdited = $event
      this.mode = 'edit'
    },
    async onCreate () {
      this.mode = 'create'
      this.toBeEdited = this.getTemplate()
    },
    getTemplate () {
      return Quotes.getTemplate()
    }
  }
}
</script>

<style lang="postcss" scoped>
.main-area-webgl{
  position: fixed;
  top: 60px;
  height: calc(100% - 60px);
  width: calc(100% - 200px);
  left: 200px;
}
</style>
