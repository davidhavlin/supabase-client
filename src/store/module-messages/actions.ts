import { ActionTree, ActionContext } from 'vuex'

import { IMessage, IMessagesState } from './state'
import { Mutations, MessageMutation } from './mutations'
import { supabase } from '../../plugins/supabase'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { StateInterface } from '../index'

export enum MessageAction {
  initApp = 'initApp',
  fetchMessages = 'fetchMessages',
  createMessage = 'createMessage',
  deleteMessage = 'deleteMessage',
  listenForInserts = 'listenForInserts',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<IMessagesState, StateInterface>, 'commit'>

export interface Actions {
  [MessageAction.fetchMessages](ctx: AugmentedActionContext): void
  [MessageAction.createMessage](ctx: AugmentedActionContext): void
  [MessageAction.deleteMessage](ctx: AugmentedActionContext): void
  [MessageAction.listenForInserts](ctx: AugmentedActionContext, cb: (msg: IMessage) => void): void
}

export const actions: ActionTree<IMessagesState, StateInterface> & Actions = {
  async [MessageAction.fetchMessages]({ state, commit, dispatch }) {
    try {
      const { data: messages, error } = await supabase.from('messages').select()
      commit(MessageMutation.SET_MESSAGES, messages as IMessage[])
    } catch (error) {
      console.log(error)
    }
  },
  async [MessageAction.createMessage]({ state, commit, dispatch }) {
    try {
      const { data, error } = await supabase.from('messages').select()
      console.log('fetched', data, error, { supabase })
    } catch (error) {
      console.log(error)
    }
  },
  async [MessageAction.deleteMessage]({ state, commit, dispatch }) {
    try {
      const { data, error } = await supabase.from('messages').select()
      console.log('fetched', data, error, { supabase })
    } catch (error) {
      console.log(error)
    }
  },
  async [MessageAction.listenForInserts]({ state, commit, dispatch }, cb) {
    supabase
      .from('messages')
      .on('INSERT', ({ new: msg }: SupabaseRealtimePayload<IMessage>) => {
        commit(MessageMutation.ADD_MESSAGE, msg)
        cb(msg)
      })
      .subscribe()
  },
}
