<template>
  <div class="full">
    <button class="full-btn" @click="reset()">Reset</button>
    <div ref="code-editor" class="full-no-btn">
    </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'

export default {
  props: {
    ns: {
      required: true,
      default: 'onGLSLPosSim-OMG'
    },
    initValue: {
      required: true
    }
  },
  data () {
    return {
      reset () {}
    }
  },
  mounted () {
    let editor = monaco.editor.create(this.$refs['code-editor'], {
      value: this.initValue,
      theme: 'vs-dark',
      language: 'cpp'
    })
    // hydrate
    let val = window.localStorage.getItem(this.ns)
    if (val) {
      editor.setValue(val)
    }

    this.reset = () => {
      window.localStorage.removeItem(this.ns)
      editor.setValue(this.initValue)
    }
    editor.onDidChangeModelContent((event) => {
      let text = editor.getValue()
      window.localStorage.setItem(this.ns, text)
      this.$emit('text', text)
    })

    editor.onKeyDown((e) => {
      if (e.code === 'KeyS' && e.browserEvent.metaKey) {
        e.preventDefault()
      }
    })
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
.full-btn{
  height: 30px;
}
.full-no-btn{
  height: calc(100% - 30px);
}
</style>
