<template>
  <div class="app">
    <Header class="app__header" />
    <nuxt class="app__content" />
  </div>
</template>

<script>
import Header from '~/components/Header'

export default {
  components: {
    Header
  }
}
</script>

<style>
html,
body,
#__nuxt,
#__layout {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background: #373737;
  color: white;
  height: 100vh;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

a {
  text-decoration: none;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background: #373737;
}

::-webkit-scrollbar-thumb {
  background: white;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.app {
  display: grid;
  grid-template-rows: 4.5rem calc(100% - 70px);
  height: 100%;
  overflow-x: hidden;
}

.app__content {
  padding: 1.5rem;
  overflow: visible;
}

.app__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'logo . profile';
  background: white;
  color: #373737;
}
</style>
