export interface IUserState {
  user: null | IRegisteredUser
  onlineId: null | number
  onlineUsers: null | IOnlineUser[]
  activityTimer: null | number
  hideAnonymMessages: boolean
}

export interface IUser {
  username: string
  color: string
  icons: string[]
}

export interface IOnlineUser {
  username: string
  id: number
  user_id: string | null
  last_activity: Date
  session_id: string
  registered: boolean
}

export interface IRegisteredUser {
  id: string
  username: string
  color: string
  icons: null | string[]
  avatar_url: string | null
  role: 'USER' | 'ADMIN' | 'MOD'
}
