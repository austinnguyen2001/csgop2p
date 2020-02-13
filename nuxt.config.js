export default {
  mode: 'spa',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  loading: { color: '#fff' },
  css: [],
  plugins: ['~/plugins/vue-fragment'],
  buildModules: ['@nuxtjs/eslint-module'],
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa'],
  axios: {
    proxy: true
  },
  proxy: {
    '/graphql': 'http://localhost:4000'
  },
  router: {
    middleware: 'auth'
  },
  build: {
    extend(config, ctx) {}
  }
}
