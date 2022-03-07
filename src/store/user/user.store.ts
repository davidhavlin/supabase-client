import { defineStore, acceptHMRUpdate } from 'pinia'
import { IOnlineUser, IRegisteredUser, IUser, IUserState } from './user.types'
import { supabase } from '../../plugins/supabase'
import { SupabaseRealtimePayload, User } from '@supabase/supabase-js'
import { handleError } from '../../utils/handle-error'
import { handleLoading } from '../../utils/handle-loading'
import { useMessagesStore } from '../message/message.store'
import { IWelcomeMessage } from '../message/message.types'
import { updateOnlineUser, updateUser } from '../../utils/user-utils'

const GITHUB_SIGN = 'sign-github'

export const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    user: null,
    onlineId: null,
    onlineUsers: null,
    activityTimer: null,
  }),

  actions: {
    async setUser(user: IRegisteredUser | null) {
      // this.user = user
      // if (this.onlineId) {
      //   this.updateOnlineUser(user)
      // } else {
      //   this.setOnlineUser(user)
      // }
      // return user
      this.user = user
      if (user) {
        this.setOnlineUser(user)
        this.startReloadInterval()
      }
    },
    async updateUser(user: Partial<IRegisteredUser>) {
      if (!this.user) return
      handleLoading()
      const updatedUser = await updateUser(user, this.user.id)
      if (updatedUser) {
        this.user = updatedUser
        updateOnlineUser({ username: updatedUser.username, user_id: this.user.id })
      }
      handleLoading(false)
    },
    async tryAgain(): Promise<User | null> {
      return new Promise((resolve) => {
        let counter = 0
        const fetchUser = () => {
          setTimeout(async () => {
            const loggedUser = await supabase.auth.user()

            if (!loggedUser && counter < 4) {
              counter++
              fetchUser()
            } else {
              resolve(loggedUser)
            }
          }, 200)
        }
        fetchUser()
      })
    },

    async checkIfUserIsLogged() {
      handleLoading(true)
      const isLogging = window.sessionStorage.getItem(GITHUB_SIGN)

      let loggedUser = await supabase.auth.user()
      if (!loggedUser && isLogging) {
        loggedUser = await this.tryAgain() // TODO REFACTOR
      }

      window.sessionStorage.removeItem(GITHUB_SIGN)

      if (!loggedUser) {
        handleLoading(false)

        return
      }
      handleLoading(true)
      const { id } = loggedUser
      const { data, error } = await supabase.from<IRegisteredUser>('users').select().match({ id })
      handleError(error)
      const user = data ? data[0] : null
      // const session = await supabase.auth.session()
      this.setUser(user)
      handleLoading(false)
    },

    async alreadyOnline(user: IRegisteredUser) {
      const { data, error } = await supabase
        .from<IOnlineUser>('online_users')
        .select()
        .match({ user_id: user.id })
      handleError(error)

      if (data && data[0]) {
        await this.refreshActivity()
        return true
      }
      return false
    },

    async setOnlineUser(user: IRegisteredUser) {
      if (!this.user) return
      const alreadyOnline = await this.alreadyOnline(user)
      if (alreadyOnline) return

      const onlineUser: Partial<IOnlineUser> = {
        last_activity: new Date(),
        user_id: user.id, // todo later
        username: user.username,
        registered: !!user.id,
        // session_id: sessionId,
      }

      const { data: users, error } = await supabase
        .from<IOnlineUser>('online_users')
        .insert(onlineUser)

      handleError(error)
      // if (users && users.length) {
      // const newUser = users[0]
      // const
      // sessionStorage.setItem('chat-session', newUser.session_id)
      // this.user = newUser.username
      // }
      // console.log('SET ONLINE USER', { users })

      // sessionStorage.setItem('chat-session', sessionId)

      // if (data) {
      //   this.onlineId = data[0].id
      // }
    },

    // async updateOnlineUser(user: IUser) {
    //   const { data, error } = await supabase
    //     .from('online_users')
    //     .update({ last_activity: new Date(), username: user.username })
    //     .match({ id: this.onlineId })

    //   handleError(error)
    // },

    async refreshActivity() {
      if (!this.user) return
      const { data, error } = await supabase
        .from('online_users')
        .update({ last_activity: new Date() })
        .match({ user_id: this.user.id })

      handleError(error)
    },

    async fetchOnlineUsers() {
      const { data: users, error } = await supabase.from<IOnlineUser>('online_users').select()
      console.log('FETCH ONLINE USERS', users)

      if (error) {
        console.log('[ERROR]: fetchOnlineUsers', error)
      } else {
        this.onlineUsers = users
      }
    },

    async signInWithGithub() {
      handleLoading(true)
      window.sessionStorage.setItem(GITHUB_SIGN, 'SUPABASE_CHAT_APP')
      const { user, session, error } = await supabase.auth.signIn({
        provider: 'github',
      })
      handleError(error)
    },

    async logoutUser() {
      const { error } = await supabase.auth.signOut()
      handleError(error)
      this.user = null
    },

    startReloadInterval() {
      this.activityTimer = window.setTimeout(() => {
        console.log('SETTING ACTIVITY')
        this.refreshActivity()
        this.startReloadInterval()
      }, 1000 * 60 * 4)
    },

    listenUsers() {
      const onlineUsers = supabase
        .from<IOnlineUser>('online_users')
        .on('INSERT', async ({ new: newOnlineUser }: SupabaseRealtimePayload<IOnlineUser>) => {
          const message = useMessagesStore()
          console.log('INSERT online user!', { newOnlineUser })
          const notifyMessage: IWelcomeMessage = {
            welcome: true,
            username: newOnlineUser.username,
            id: newOnlineUser.id,
            created_at: newOnlineUser.last_activity,
            user_id: newOnlineUser.user_id,
            content: '',
            color: '',
            icons: null,
          }
          message.chatMessages.push(notifyMessage)
          if (!this.onlineUsers) {
            await this.fetchOnlineUsers()
          } else {
            this.onlineUsers.push(newOnlineUser)
          }
        })
        .on(
          'DELETE',
          async ({ old: deletedOnlineUser }: SupabaseRealtimePayload<{ id: number }>) => {
            console.log('DELETE online user!', deletedOnlineUser)
            if (!this.onlineUsers) {
              await this.fetchOnlineUsers()
            } else {
              if (!deletedOnlineUser) return
              this.onlineUsers = this.onlineUsers.filter((user) => user.id !== deletedOnlineUser.id)
            }
          }
        )
        .on(
          'UPDATE',
          async ({ new: newUpdatedOnlineUser }: SupabaseRealtimePayload<IOnlineUser>) => {
            console.log('UPDATE online user!', { newUpdatedOnlineUser })
          }
        )
        .subscribe()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
