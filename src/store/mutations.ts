import { MutationTree } from 'vuex'
import { IMessage, IUser, State } from './state'

export enum Mutation {
  INCREMENT = 'INCREMENT',
  SET_MESSAGES = 'SET_MESSAGES',
  ADD_MESSAGE = 'ADD_MESSAGE',
  SET_USER = 'SET_USER',
  UPDATE_USER = 'UPDATE_USER',
}

export interface IUpdatePayload {
  field: keyof IUser
  data: string & string[]
}

export type Mutations<S = State> = {
  [Mutation.INCREMENT](state: S, payload: number): void
  [Mutation.SET_MESSAGES](state: S, newMessages: IMessage[]): void
  [Mutation.ADD_MESSAGE](state: S, newMessage: IMessage): void
  [Mutation.SET_USER](state: S, user: IUser): void
  [Mutation.UPDATE_USER](state: S, payload: IUpdatePayload): void
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
  [Mutation.SET_USER](state: State, user: IUser) {
    state.user = user
  },
  [Mutation.UPDATE_USER](state: State, { field, data }: IUpdatePayload) {
    if (!state.user) return
    state.user[field] = data
  },
}
