// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css:[
    '~/assets/css/index.css',
    'remixicon/fonts/remixicon.css'
  ],
  runtimeConfig: {
    public: {
      API: process.env.API,
      AUTH: process.env.AUTH,
      DOMAIN: process.env.DOMAIN,
    },
  },
})
