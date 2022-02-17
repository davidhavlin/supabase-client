import { defineStore, acceptHMRUpdate } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: null,
    isAdmin: true,
  }),

  actions: {
    logout() {
      // this.$patch({
      //   name: '',
      //   isAdmin: false,
      // })
    },

    async setUser(user: IUser) {
      console.log('set user')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
