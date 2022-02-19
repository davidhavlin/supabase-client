export interface IMessagesState {
  chatMessages: IMessage[]
}

export interface IMessage {
  id?: number
  content: string
  username: string
  color: string
}
