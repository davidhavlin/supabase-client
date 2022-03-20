import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { supabase } from '../../plugins/supabase'
import { handleError } from '../../utils/handle-error'
import { handleLoading } from '../../utils/handle-loading'
import { IMessage, IMessagesState, TChatMessage } from './message.types'

export const useMessagesStore = defineStore({
  id: 'messages',
  state: (): IMessagesState => ({
    inputMessage: '',
    chatMessages: [],
    countAllMessages: 0,
    addedMessages: {},
    afterMessageCounter: 0,
    counterTimeout: null,
  }),

  actions: {
    async fetchMessages() {
      handleLoading()
      const {
        data: messages,
        error,
        count,
      } = await supabase
        .from<TChatMessage>('messages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(30)
      handleError(error)
      if (!messages) return
      this.countAllMessages = count || 0

      this.chatMessages = messages.reverse()
      handleLoading(false)
    },

    async fetchMoreMessages() {
      handleLoading()
      const [last] = this.chatMessages

      const { data: messages, error } = await supabase
        .from('messages')
        .select()
        .lt('id', last.id)
        .order('created_at', { ascending: false })
        .limit(30)

      handleError(error)

      if (!messages) return
      this.chatMessages = [...messages.reverse(), ...this.chatMessages]
      handleLoading(false)
    },

    listenMessages() {
      const msgSubscription = supabase
        .from('messages')
        .on('INSERT', ({ new: msg }: SupabaseRealtimePayload<TChatMessage>) => {
          console.log('supabase LISTEN INSERT')

          this.chatMessages.push(msg)
        })
        .on('DELETE', ({ old }: SupabaseRealtimePayload<TChatMessage>) => {
          const index = this.chatMessages.findIndex((msg) => msg.id === old.id)
          this.chatMessages.splice(index, 1)
        })
        .subscribe()
    },

    async createMessage(msg: IMessage) {
      this.counterTimeout && clearTimeout(this.counterTimeout)
      const { data, error } = await supabase.from<IMessage>('messages').insert([msg])
      handleError(error)
      if (data && data.length > 0 && data[0].id) {
        this.addedMessages[data[0].id] = true
        this.launchCounter(data[0].id)
      }
    },

    async removeMessage(id: number) {
      try {
        const { data, error } = await supabase.from('messages').delete().match({ id })
        return true
      } catch (error) {
        console.log('REMOVE MESSAGE ERROR', error)
        return false
      }
    },

    launchCounter(msgId: number) {
      if (!this.afterMessageCounter) this.afterMessageCounter = 10
      this.counterTimeout = window.setTimeout(() => {
        this.afterMessageCounter--
        if (this.afterMessageCounter <= 0) {
          this.addedMessages[msgId] = false
          return
        }
        this.launchCounter(msgId)
      }, 1000)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessagesStore, import.meta.hot))
}
