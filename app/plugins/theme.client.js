export default defineNuxtPlugin((nuxtApp) => {
  const camelToKebab = (str) =>
    str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

  const applyTheme = (theme) => {
    const root = document.documentElement
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value, 'important')
    })
  }

  // make available in app
  nuxtApp.provide('applyTheme', applyTheme)
})
