export interface State {
  debug: boolean
  version: string | boolean | undefined
  isInitialized: boolean
  user: IUser | null
  count: number
  chatMessages: IMessage[]
}

export interface IUser {
  username: string
  colorClass: string
  icons: string[]
}

export interface IMessage {
  id: number
  content: string
  username: string
}

const versionString =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_VERSION + '-dev'
    : import.meta.env.VITE_APP_VERSION

export const state: State = {
  debug: import.meta.env.MODE === 'development',
  version: versionString,
  isInitialized: false,
  user: null,
  count: 0,
  chatMessages: [],
}
