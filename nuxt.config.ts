export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer:{
    port: 4000,
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    'vue3-toastify/dist/index.css',
  ],
  plugins:[
    '~/plugins/toastify.client.js',
  ],
  runtimeConfig: {
    public: {
      API: process.env.API,
      AUTH: process.env.AUTH,
      DOMAIN: process.env.DOMAIN,
    },
  },
})
