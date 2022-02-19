import { defineStore, acceptHMRUpdate } from 'pinia'
import { IUser, IUserState } from './user.types'

export const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    user: null,
  }),

  actions: {
    async setUser(user: IUser) {
      this.user = user
      return user
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
