import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { IUserState } from './state'

export type Getters = {
  getUser(state: IUserState): any
}

export const getters: GetterTree<IUserState, StateInterface> & Getters = {
  getUser(state) {
    return !state.user
  },
}
