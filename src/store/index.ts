import { InjectionKey } from 'vue'
import { createStore } from 'vuex'

import { IUserState } from './module-user/state'
import user, { UserStore } from './module-user'
import { IMessagesState } from './module-messages/state'
import messages, { MessagesStore } from './module-messages'

// export const key: InjectionKey<VuexStore<StateInterface>> = Symbol()

export type StateInterface = {
  user: IUserState
  messages: IMessagesState
}

export type Store = UserStore<Pick<StateInterface, 'user'>> &
  MessagesStore<Pick<StateInterface, 'messages'>>

export const store = createStore<StateInterface>({
  modules: {
    user,
    messages,
  },
})

export function useStore(): Store {
  return store as Store
}
