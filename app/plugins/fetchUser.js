import STATUS from '~~/status';
import api from '../api.config';
import { useRuntimeConfig } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Adding fetchUser function to the Nuxt app context
  nuxtApp.provide('fetchUser', async () => {
    try {
      const response = await api.get(`${config.public.API}/user/fetch`);
      if (response.status === STATUS.OK) {
        return response.data.user;
      }
      return;
    } catch (error) {
      console.log(error);
    }
  });
});
