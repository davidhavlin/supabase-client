import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { supabase } from '../../plugins/supabase'
import { IMessage, IMessagesState, TChatMessage } from './message.types'

export const useMessagesStore = defineStore({
  id: 'messages',
  state: (): IMessagesState => ({
    chatMessages: [],
    addedMessages: {},
    afterMessageCounter: 0,
    counterTimeout: null,
  }),

  actions: {
    async fetchMessages() {
      try {
        const { data: messages, error } = await supabase
          .from<TChatMessage>('messages')
          .select()
          .order('created_at', { ascending: false })
          .limit(30)
        if (!messages) return

        this.chatMessages = messages.reverse()
      } catch (error) {
        console.log(error)
      }
    },
    async listenSupabase(cb: (msg: TChatMessage) => void) {
      const msgSubscription = supabase
        .from('*')
        .on('INSERT', ({ new: msg }: SupabaseRealtimePayload<TChatMessage>) => {
          console.log('supabase LISTEN INSERT')

          this.chatMessages.push(msg)
          cb(msg)
        })
        .on('DELETE', ({ old }: SupabaseRealtimePayload<TChatMessage>) => {
          const index = this.chatMessages.findIndex((msg) => msg.id === old.id)
          this.chatMessages.splice(index, 1)
        })
        .subscribe()
    },

    async createMessage(msg: IMessage) {
      this.counterTimeout && clearTimeout(this.counterTimeout)
      try {
        const { data, error } = await supabase.from<IMessage>('messages').insert([msg])
        if (data && data.length > 0 && data[0].id) {
          this.addedMessages[data[0].id] = true
          this.launchCounter(data[0].id)
        }
      } catch (error) {
        console.log('CREATE MESSAGE ERROR', error)
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
