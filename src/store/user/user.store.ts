import { defineStore, acceptHMRUpdate } from 'pinia'
import { IOnlineUser, IUser, IUserState } from './user.types'
import { supabase } from '../../plugins/supabase'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { handleError } from '../../utils/error-handling'

export const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    user: null,
    onlineId: null,
  }),

  actions: {
    async setUser(user: IUser) {
      this.user = user
      // this.listenUsers()
      if (this.onlineId) {
        this.updateOnlineUser(user)
      } else {
        this.setOnlineUser(user)
      }
      return user
    },

    async setOnlineUser(user: IUser) {
      const onlineUser: Partial<IOnlineUser> = {
        last_activity: new Date(),
        user_id: null, // todo later
        username: user.username,
      }
      const { data, error } = await supabase.from<IOnlineUser>('online_users').insert(onlineUser)
      handleError(error)

      if (data) {
        this.onlineId = data[0].id
      }
    },

    async updateOnlineUser(user: IUser) {
      const { data, error } = await supabase
        .from('online_users')
        .update({ last_activity: new Date(), username: user.username })
        .match({ id: this.onlineId })

      handleError(error)
    },

    async refreshActivity() {
      if (!this.onlineId) return
      const { data, error } = await supabase
        .from('online_users')
        .update({ last_activity: new Date() })
        .match({ id: this.onlineId })
      handleError(error)
    },

    // async listenUsers() {
    //   const userSubscription = supabase
    //     .from('online_users')
    //     .on('INSERT', ({ new: newOnlineUser }: SupabaseRealtimePayload<IOnlineUser>) => {
    //       console.log('USER JOINED CHAT', { newOnlineUser })
    //     })
    //     // .on('DELETE', ({ old }: SupabaseRealtimePayload<TChatMessage>) => {
    //     //   const index = this.chatMessages.findIndex((msg) => msg.id === old.id)
    //     //   this.chatMessages.splice(index, 1)
    //     // })
    //     .subscribe()
    // },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
