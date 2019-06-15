<template>
  <div id="app">
    <router-view class="full" />
  </div>
</template>

<style>
@import url(./css/normalize.css);
@import url(./css/cutegrids.css);
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #171f27;
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
</style>
