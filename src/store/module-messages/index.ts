import { Store as VuexStore, DispatchOptions, CommitOptions, Module } from 'vuex'
import { StateInterface } from '../index'
import { IMessagesState } from './state'
import { state } from './state'
import { Actions, actions } from './actions'
import { Mutations, mutations } from './mutations'
import { Getters, getters } from './getters'

export type MessagesStore<S = IMessagesState> = Omit<
  VuexStore<S>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
}

const messagesModule: Module<IMessagesState, StateInterface> = {
  // namespaced: true,
  actions,
  mutations,
  getters,
  state,
}

export default messagesModule
