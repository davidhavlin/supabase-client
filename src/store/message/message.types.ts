export type TChatMessage = Required<IMessage>

export interface Nieco extends IMessage {}

// export interface IWelcomeMessage extends IMessage {
export interface IWelcomeMessage extends TChatMessage {
  welcome: boolean
}

export interface IMessagesState {
  chatMessages: (TChatMessage | IWelcomeMessage)[]
  addedMessages: {
    [key: number]: boolean
  }
  afterMessageCounter: number
  counterTimeout: null | number
}

export interface IMessage {
  welcome?: boolean
  created_at?: Date
  id?: number
  user_id: string | null
  content: string
  username: string
  color: string
  icons: string[] | null
}
