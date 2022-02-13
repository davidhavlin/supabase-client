import { MutationTree } from 'vuex'
import { IMessage, State } from './state'

export enum Mutation {
  INCREMENT = 'INCREMENT',
  ADD_MESSAGE = 'ADD_MESSAGE',
}

export type Mutations<S = State> = {
  [Mutation.INCREMENT](state: S, payload: number): void
  [Mutation.ADD_MESSAGE](state: S, newMessage: IMessage): void
}

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.INCREMENT](state: State, payload: number = 1) {
    state.count += payload
  },
  [Mutation.ADD_MESSAGE](state: State, newMessage: IMessage) {
    state.chatMessages.push(newMessage)
  },
}
