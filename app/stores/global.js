import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    isSideHeader: false, 
  }),
  actions: {
    setIsSideHeader(status) {
      this.isSideHeader = status;  
    },
  },
});
