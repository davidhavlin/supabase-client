import { defineStore, acceptHMRUpdate } from 'pinia'
import { IOnlineUser, IUser, IUserState } from './user.types'
import { supabase } from '../../plugins/supabase'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { handleError } from '../../utils/error-handling'
import { v4 as uuidv4 } from 'uuid'

export const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    user: null,
    onlineId: null,
    onlineUsers: null,
  }),

  actions: {
    async setUser(user: IUser) {
      this.user = user
      if (this.onlineId) {
        this.updateOnlineUser(user)
      } else {
        this.setOnlineUser(user)
      }
      return user
    },

    async setOnlineUser(user: IUser) {
      const sessionId = uuidv4()
      sessionStorage.setItem('chat-session', sessionId)

      const onlineUser: Partial<IOnlineUser> = {
        last_activity: new Date(),
        user_id: null, // todo later
        username: user.username,
        session: sessionId,
      }

      // const { data, error } = await supabase.from<IOnlineUser>('online_users').insert(onlineUser)
      // handleError(error)

      // if (data) {
      //   this.onlineId = data[0].id
      // }
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

    async fetchOnlineUsers() {
      const { data: users, error } = await supabase.from<IOnlineUser>('online_users').select()
      if (error) {
        console.log('[ERROR]: fetchOnlineUsers', error)
      } else {
        this.onlineUsers = users
      }
    },

    listenUsers() {
      const onlineUsers = supabase
        .from('online_users')
        .on('*', (payload) => {
          console.log('Change received!', payload)
        })
        .subscribe()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
