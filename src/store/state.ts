export interface State {
  debug: boolean
  version: string | boolean | undefined
  isInitialized: boolean
  count: number
  chatMessages: IMessage[]
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
  count: 0,
  chatMessages: [
    {
      id: 0,
      username: 'skuska',
      content: 'helloo world',
    },
    {
      id: 1,
      username: 'skuska2',
      content: 'helloo world a blalblal blalba',
    },
  ],
}
