import { defineNuxtPlugin } from '#app'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Register VueTippy globally
  nuxtApp.vueApp.use(VueTippy)
})
