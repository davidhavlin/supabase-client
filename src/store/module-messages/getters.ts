import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { IMessage, IMessagesState } from './state'

export type Getters = {
  getMessages(state: IMessagesState): IMessage[]
}

export const getters: GetterTree<IMessagesState, StateInterface> & Getters = {
  getMessages(state) {
    return state.chatMessages
  },
}
