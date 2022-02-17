import { defineStore, acceptHMRUpdate } from 'pinia'
import { IUser, IUserState } from './user.types'

export const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    user: null,
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
      this.user = user
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
