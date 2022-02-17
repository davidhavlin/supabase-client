export interface IUserState {
  user: IUser | null
}

export interface IUser {
  username: string
  colorClass: string
  icons: string[]
}

export const state: IUserState = {
  user: null,
}
