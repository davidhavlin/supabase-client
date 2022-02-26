export interface IMessagesState {
  chatMessages: IMessage[]
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
