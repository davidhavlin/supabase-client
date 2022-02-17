import { defineStore, acceptHMRUpdate } from 'pinia'
import { IMessagesState } from './message.types'

export const useMessagesStore = defineStore({
  id: 'messages',
  state: (): IMessagesState => ({
    chatMessages: [],
  }),

  actions: {
    logout() {
      // this.$patch({
      //   name: '',
      //   isAdmin: false,
      // })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessagesStore, import.meta.hot))
}
