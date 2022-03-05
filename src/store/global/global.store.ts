import { defineStore, acceptHMRUpdate } from 'pinia'
// import { } from './global.types'

export const useGlobalStore = defineStore({
  id: 'global',
  state: () => ({}),

  actions: {},
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
}
