import { ActionTree, ActionContext } from 'vuex'

import { IMessage, State } from './state'
import { Mutations, Mutation } from './mutations'
import { supabase } from '../plugins/supabase'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'

export enum Action {
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
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
  [Action.initApp](ctx: AugmentedActionContext): void
  [Action.fetchMessages](ctx: AugmentedActionContext): void
  [Action.createMessage](ctx: AugmentedActionContext): void
  [Action.deleteMessage](ctx: AugmentedActionContext): void
  [Action.listenForInserts](ctx: AugmentedActionContext, cb: (msg: IMessage) => void): void
}

export const actions: ActionTree<State, State> & Actions = {
  [Action.initApp]({ state, commit, dispatch }) {
    // console.log('app inited!', supabase)
  },
  async [Action.fetchMessages]({ state, commit, dispatch }) {
    try {
      const { data: messages, error } = await supabase.from('messages').select()
      commit(Mutation.SET_MESSAGES, messages as IMessage[])
    } catch (error) {
      console.log(error)
    }
  },
  async [Action.createMessage]({ state, commit, dispatch }) {
    try {
      const { data, error } = await supabase.from('messages').select()
      console.log('fetched', data, error, { supabase })
    } catch (error) {
      console.log(error)
    }
  },
  async [Action.deleteMessage]({ state, commit, dispatch }) {
    try {
      const { data, error } = await supabase.from('messages').select()
      console.log('fetched', data, error, { supabase })
    } catch (error) {
      console.log(error)
    }
  },
  async [Action.listenForInserts]({ state, commit, dispatch }, cb) {
    supabase
      .from('messages')
      .on('INSERT', ({ new: msg }: SupabaseRealtimePayload<IMessage>) => {
        commit(Mutation.ADD_MESSAGE, msg)
        cb(msg)
      })
      .subscribe()
  },
}
