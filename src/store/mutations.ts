import { MutationTree } from 'vuex'
import { IMessage, State } from './state'

export enum Mutation {
  INCREMENT = 'INCREMENT',
  SET_MESSAGES = 'SET_MESSAGES',
  ADD_MESSAGE = 'ADD_MESSAGE',
}

export type Mutations<S = State> = {
  [Mutation.INCREMENT](state: S, payload: number): void
  [Mutation.SET_MESSAGES](state: S, newMessages: IMessage[]): void
  [Mutation.ADD_MESSAGE](state: S, newMessage: IMessage): void
}

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.INCREMENT](state: State, payload: number = 1) {
    state.count += payload
  },
  [Mutation.SET_MESSAGES](state: State, newMessages: IMessage[]) {
    state.chatMessages = newMessages
  },
  [Mutation.ADD_MESSAGE](state: State, newMessage: IMessage) {
    state.chatMessages.push(newMessage)
  },
}
