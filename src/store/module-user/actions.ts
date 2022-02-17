import { ActionTree, ActionContext } from 'vuex'

import { IUserState } from './state'
import { Mutations } from './mutations'
import { StateInterface } from '../index'

export enum UserAction {
  listenForInserts = 'listenForInserts',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<IUserState, StateInterface>, 'commit'>

export interface Actions {
  // [Action.listenForInserts](ctx: AugmentedActionContext, cb: (msg: IMessage) => void): void
}

export const actions: ActionTree<IUserState, StateInterface> & Actions = {
  // async [Action.listenForInserts]({ state, commit, dispatch }, cb) {
  //   // todo
  // },
}
