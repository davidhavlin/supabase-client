import { MutationTree } from 'vuex'
import { IUser, IUserState } from './state'

export enum UserMutation {
  SET_USER = 'SET_USER',
  UPDATE_USER = 'UPDATE_USER',
}

export interface IUpdatePayload {
  field: keyof IUser
  data: string & string[]
}

export type Mutations<S = IUserState> = {
  [UserMutation.SET_USER](state: S, user: IUser): void
}

export const mutations: MutationTree<IUserState> & Mutations = {
  [UserMutation.SET_USER](state: IUserState, user: IUser) {
    state.user = user
  },
  [UserMutation.UPDATE_USER](state: IUserState, { field, data }: IUpdatePayload) {
    if (!state.user) return
    state.user[field] = data
  },
}
