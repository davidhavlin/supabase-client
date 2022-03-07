import { supabase } from '../plugins/supabase'
import { IOnlineUser, IRegisteredUser } from '../store/user/user.types'
import { handleError } from './handle-error'

export const updateUser = async (user: Partial<IRegisteredUser>, userId: string) => {
  const { data, error } = await supabase
    .from<IRegisteredUser>('users')
    .update({ ...user })
    .match({ id: userId })
  handleError(error)

  if (data && data[0]) {
    return data[0]
  }
  return null
}

export const updateOnlineUser = async (updateUser: Partial<IOnlineUser>) => {
  const { data, error } = await supabase
    .from<IOnlineUser>('online_users')
    .update({ ...updateUser, last_activity: new Date() })
    .match({ user_id: updateUser.user_id })

  handleError(error)
  if (data && data[0]) {
    return data[0]
  }
  return null
}
