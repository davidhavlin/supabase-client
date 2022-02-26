import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { supabase } from '../../plugins/supabase'
import { IMessage, IMessagesState } from './message.types'

export const useMessagesStore = defineStore({
  id: 'messages',
  state: (): IMessagesState => ({
    chatMessages: [],
    afterMessageCounter: 0,
    counterTimeout: null,
  }),

  actions: {
    async fetchMessages() {
      try {
        const { data: messages, error } = await supabase.from<IMessage>('messages').select()
        if (!messages) return
        console.log({ messages })

        this.chatMessages = messages
      } catch (error) {
        console.log(error)
      }
    },
    async listenForInserts(cb: (msg: IMessage) => void) {
      supabase
        .from('messages')
        .on('INSERT', ({ new: msg }: SupabaseRealtimePayload<IMessage>) => {
          this.chatMessages.push(msg)
          cb(msg)
        })
        .subscribe()
    },
    async createMessage(msg: IMessage) {
      this.counterTimeout && clearTimeout(this.counterTimeout)
      try {
        this.launchCounter()
        const { data, error } = await supabase.from('messages').insert([msg])
        console.log('createMessage', data, error)
      } catch (error) {
        console.log(error)
      }
    },
    launchCounter() {
      if (!this.afterMessageCounter) this.afterMessageCounter = 10
      this.counterTimeout = window.setTimeout(() => {
        this.afterMessageCounter--
        if (this.afterMessageCounter <= 0) return
        this.launchCounter()
      }, 1000)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessagesStore, import.meta.hot))
}
