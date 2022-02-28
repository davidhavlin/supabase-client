export type TChatMessage = Required<IMessage>

export interface IMessagesState {
  chatMessages: TChatMessage[]
  addedMessages: {
    [key: number]: boolean
  }
  afterMessageCounter: number
  counterTimeout: null | number
}

export interface IMessage {
  created_at?: Date
  id?: number
  content: string
  username: string
  color: string
  icons: string[]
}
