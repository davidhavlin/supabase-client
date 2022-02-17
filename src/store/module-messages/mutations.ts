import { MutationTree } from 'vuex'
import { IMessage, IMessagesState } from './state'

export enum MessageMutation {
  SET_MESSAGES = 'SET_MESSAGES',
  ADD_MESSAGE = 'ADD_MESSAGE',
}

export type Mutations<S = IMessagesState> = {
  [MessageMutation.SET_MESSAGES](state: S, newMessages: IMessage[]): void
  [MessageMutation.ADD_MESSAGE](state: S, newMessage: IMessage): void
}

export const mutations: MutationTree<IMessagesState> & Mutations = {
  [MessageMutation.SET_MESSAGES](state: IMessagesState, newMessages: IMessage[]) {
    state.chatMessages = newMessages
  },
  [MessageMutation.ADD_MESSAGE](state: IMessagesState, newMessage: IMessage) {
    state.chatMessages.push(newMessage)
  },
}
