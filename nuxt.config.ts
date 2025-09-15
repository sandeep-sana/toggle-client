export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 4000,
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    'vue3-toastify/dist/index.css',
    '~/assets/css/common.css',
    'vue-multiselect/dist/vue-multiselect.css',
    '@vuepic/vue-datepicker/dist/main.css',
  ],
  plugins: [
    '~/plugins/toastify.client.js',
  ],
  runtimeConfig: {
    public: {
      API: process.env.API,
      AUTH: process.env.AUTH,
      DOMAIN: process.env.DOMAIN,
    },
  },
  modules: [
    '@pinia/nuxt',
  ],
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js',
          // defer: true,
        },
      ]
    }
  }
})
