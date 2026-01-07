export default defineNuxtConfig({
  // Web = SSR, Mobile build = Static
  ssr: process.env.NUXT_APP_PLATFORM === "mobile" ? false : true,

  // For capacitor static assets, baseURL should be relative
  app: {
    baseURL: process.env.NUXT_APP_PLATFORM === "mobile" ? "./" : "/",
  },

  nitro: {
    preset: process.env.NUXT_APP_PLATFORM === "mobile" ? "static" : "node-server",
  },
  // modules: [
  //   '@pinia/nuxt',
  // ],
  css: [
    '~/assets/css/index.css',
    //   'remixicon/fonts/remixicon.css'
  ],
  // plugins: [
  //   '~/plugins/toastify.client.js',
  // ],
  // runtimeConfig: {
  //   public: {
  //     SERVER: process.env.SERVER,
  //   },
  // },
});
