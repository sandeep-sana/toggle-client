import { defineNuxtPlugin } from '#app'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 3000,
    position: toast.POSITION.TOP_RIGHT,
    theme: 'light',
    clearOnUrlChange: false 
  })

  nuxtApp.provide('toast', toast)
})
