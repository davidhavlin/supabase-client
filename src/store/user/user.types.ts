export interface IUserState {
  user: null | IUser
}

export interface IUser {
  username: string
  colorClass: string
  icons: string[]
}
