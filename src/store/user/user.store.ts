import { defineStore, acceptHMRUpdate } from 'pinia'
import { IOnlineUser, IUser, IUserState } from './user.types'
import { supabase } from '../../plugins/supabase'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'

export const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    user: null,
    onlineId: null,
  }),

  actions: {
    async setUser(user: IUser) {
      this.user = user
      this.listenUsers()
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
      try {
        const { data, error } = await supabase.from<IOnlineUser>('online_users').insert(onlineUser)
        console.log({ error })

        if (data) {
          this.onlineId = data[0].id
        }
      } catch (error) {
        console.log('SET ONLINE USER ERROR', error)
      }
    },

    async updateOnlineUser(user: IUser) {
      try {
        const { data, error } = await supabase
          .from('online_users')
          .update({ last_activity: new Date(), username: user.username })
          .match({ id: this.onlineId })
      } catch (error) {
        console.log('UPDATE ONLINE USER ERROR', error)
      }
    },

    async refreshActivity() {
      if (!this.onlineId) return
      try {
        const { data, error } = await supabase
          .from('online_users')
          .update({ last_activity: new Date() })
          .match({ id: this.onlineId })
      } catch (error) {
        console.log('REFRESH ACTIVITY ERROR', error)
      }
    },

    async listenUsers() {
      const userSubscription = supabase
        .from('online_users')
        .on('INSERT', ({ new: newOnlineUser }: SupabaseRealtimePayload<IOnlineUser>) => {
          console.log('USER JOINED CHAT', { newOnlineUser })
        })
        // .on('DELETE', ({ old }: SupabaseRealtimePayload<TChatMessage>) => {
        //   const index = this.chatMessages.findIndex((msg) => msg.id === old.id)
        //   this.chatMessages.splice(index, 1)
        // })
        .subscribe()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
