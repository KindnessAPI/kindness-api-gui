<template>
  <div id="app">
    <router-view class="full" />
  </div>
</template>

<script>

// import './css/cutegrids.css'
export default {

}
</script>
<style>
@import './tw.postcss';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app, body, html{
  width: 100%;
  height: 100%;
  margin: 0px;
}
.full{
  width: 100%;
  height: 100%;
}
.scroll-touch{
  -webkit-overflow-scrolling: touch;
}
</style>
