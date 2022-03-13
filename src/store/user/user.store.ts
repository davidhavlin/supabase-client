import { defineStore, acceptHMRUpdate } from 'pinia'
import { IAnonymUser, IOnlineUser, IRegisteredUser, IUser, IUserState } from './user.types'
import { supabase } from '../../plugins/supabase'
import { PostgrestError, SupabaseRealtimePayload, User } from '@supabase/supabase-js'
import { handleError } from '../../utils/handle-error'
import { handleLoading } from '../../utils/handle-loading'
import { useMessagesStore } from '../message/message.store'
import { IWelcomeMessage } from '../message/message.types'
import { updateOnlineUser, updateUser } from '../../utils/user-utils'

const GITHUB_SIGN = 'sign-github'
const SUPABASE_AUTH = 'supabase.auth.token'

export const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    user: null,
    onlineId: null,
    onlineUsers: null,
    activityTimer: null,
    hideAnonymMessages: false,
    blockedUsers: null,
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

    async setAnonymUser(user: Partial<IAnonymUser>) {
      const anonymUser = await this.setOnlineUser(user)
      if (!anonymUser) return
      console.log({ anonymUser })
      const { id, username, session_id } = anonymUser
      const data = {
        username,
        anonym_id: id,
        color: user.color || 'red-500',
        icons: user.icons || [],
        session_id,
      }
      const anonym: IAnonymUser = {
        ...data,
        avatar_url: null,
        role: 'USER',
      }
      localStorage.setItem('anonym_user', JSON.stringify(data))
      this.user = anonym
      this.startReloadInterval()

      // if (anonymUser)
    },

    async updateUser(user: Partial<IRegisteredUser>) {
      if (!this.user) return
      handleLoading()
      if (this.user.id) {
        const updatedUser = await updateUser(user, this.user.id)
        if (updatedUser) {
          this.user = updatedUser
          updateOnlineUser({ username: updatedUser.username, user_id: this.user.id })
        }
      } else if (this.user.anonym_id) {
        // TODO
        // updateOnlineUser({ username: user.username, anonym_id: this.user.id })
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
      const isLogging = sessionStorage.getItem(GITHUB_SIGN) || localStorage.getItem(SUPABASE_AUTH)

      let loggedUser = await supabase.auth.user()

      if (!loggedUser && isLogging) {
        loggedUser = await this.tryAgain() // TODO REFACTOR
      }

      sessionStorage.removeItem(GITHUB_SIGN)

      if (!loggedUser) {
        handleLoading(false)

        return
      }
      const { id } = loggedUser
      const { data, error } = await supabase.from<IRegisteredUser>('users').select().match({ id })
      handleError(error)
      const user = data ? data[0] : null
      this.setUser(user)
      handleLoading(false)
    },

    async alreadyOnline(user: Partial<IRegisteredUser | IAnonymUser>) {
      let res: { data: IOnlineUser[] | null; error: PostgrestError | null } | null = null

      if (user.id) {
        res = await supabase.from<IOnlineUser>('online_users').select().match({ user_id: user.id })
      } else if (user.anonym_id) {
        res = await supabase
          .from<IOnlineUser>('online_users')
          .select()
          .match({ id: user.anonym_id })
      }
      if (!res) return

      const { data, error } = res
      handleError(error)

      console.log('alreadyOnline', { user, data, error })

      if (data && data[0]) {
        await this.refreshActivity()
        return data[0]
      }
      return null
    },

    async setOnlineUser(user: Partial<IRegisteredUser | IAnonymUser>) {
      const alreadyOnline = await this.alreadyOnline(user)
      if (alreadyOnline) {
        if (!alreadyOnline.registered) {
          return alreadyOnline
        }
        return
      }

      const onlineUser: Partial<IOnlineUser> = {
        last_activity: new Date(),
        user_id: user.id || null,
        username: user.username,
        registered: !!user.id,
        // session_id: sessionId,
      }

      const { data: users, error } = await supabase
        .from<IOnlineUser>('online_users')
        .insert(onlineUser)

      handleError(error)
      if (users && users[0]) {
        return users[0]
      }
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
      const { data, error } = this.user.id
        ? await supabase
            .from('online_users')
            .update({ last_activity: new Date() })
            .match({ user_id: this.user.id })
        : await supabase
            .from('online_users')
            .update({ last_activity: new Date() })
            .match({ id: this.user.anonym_id })

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
      if (this.user && this.user.id) {
        const { error } = await supabase.auth.signOut()
        handleError(error)
      }
      // todo delete anonym from ls
      localStorage.removeItem('anonym_user')
      this.user = null
    },

    startReloadInterval() {
      this.activityTimer = window.setTimeout(() => {
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
