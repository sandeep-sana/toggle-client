import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    isSideHeader: false, 
    isMaster: false,
  }),
  actions: {
    setIsSideHeader(status) {
      this.isSideHeader = status;  
    },
    setIsMaster(status){
      this.isMaster = status;
    }
  },
});
