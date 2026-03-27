import { defineNuxtPlugin } from '#app'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import '~/assets/css/toastify-custom.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 2800,
    position: toast.POSITION.BOTTOM_RIGHT,
    theme: 'dark',
    clearOnUrlChange: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    toastClassName: 'toggle-toast',
    bodyClassName: 'toggle-toast__body',
    progressClassName: 'toggle-toast__progress',
    style: {
      borderRadius: '12px',
      border: '1px solid rgba(203, 213, 225, 0.25)',
    },
  })

  nuxtApp.provide('toast', toast)
})
