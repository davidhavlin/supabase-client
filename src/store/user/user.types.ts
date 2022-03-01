export interface IUserState {
  user: null | IUser
  onlineId: null | number
}

export interface IUser {
  username: string
  color: string
  icons: string[]
}

export interface IOnlineUser {
  username: string
  id: number
  user_id: number | null
  last_activity: Date
}
