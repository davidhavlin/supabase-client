export interface IUserState {
  user: null | IRegisteredUser | IAnonymUser
  onlineId: null | number
  onlineUsers: null | IOnlineUser[]
  activityTimer: null | number
  hideAnonymMessages: boolean
  blockedUsers: null | Set<string>
}

export interface IUser {
  id: string | null
  anonym_id: number | null
  username: string
  color: string | null
  icons: string[] | null
  avatar_url: string | null
  session_id: string
  role: 'USER' | 'ADMIN' | 'MOD'
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
  // todo remove
  id: string // user_id
  anonym_id?: number
  username: string
  color: string
  icons: null | string[]
  avatar_url: string | null
  session_id: string
  role: 'USER' | 'ADMIN' | 'MOD'
}
export interface IAnonymUser {
  // todo remove
  id?: string
  anonym_id: number
  username: string
  color: string
  icons: null | string[]
  session_id: string
  avatar_url: null
  role: 'USER'
}

export enum ETab {
  ONLINE_USERS = 'online_users',
  USERS = 'users',
}
export enum EStorageKey {
  ANONYM_USER = 'anonym_user',
}
