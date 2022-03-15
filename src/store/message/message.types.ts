export type TChatMessage = Required<IMessage>

export interface IWelcomeMessage extends TChatMessage {
  welcome: boolean
}

export interface IMessagesState {
  chatMessages: (TChatMessage | IWelcomeMessage)[]
  addedMessages: {
    [key: number]: boolean
  }
  countAllMessages: number
  afterMessageCounter: number
  counterTimeout: null | number
}

export interface IMessage {
  welcome?: boolean
  created_at?: Date
  id?: number
  user_id: string | null
  anonym_id: number | null
  content: string
  username: string
  color: string
  icons: string[] | null
}
