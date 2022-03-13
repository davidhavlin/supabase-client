import { supabase } from '../plugins/supabase'
import {
  EStorageKey,
  ETab,
  IAnonymUser,
  IOnlineUser,
  IRegisteredUser,
} from '../store/user/user.types'
import { handleError } from './handle-error'

export const updateUser = async (user: Partial<IRegisteredUser>, userId: string) => {
  const { data, error } = await supabase
    .from<IRegisteredUser>(ETab.USERS)
    .update({ ...user })
    .match({ id: userId })
  handleError(error)

  if (data && data[0]) {
    return data[0]
  }
  return null
}

export const updateOnlineUser = async (updateUser: Partial<IOnlineUser>) => {
  const { data, error } = updateUser.user_id
    ? await supabase
        .from<IOnlineUser>(ETab.ONLINE_USERS)
        .update({ ...updateUser, last_activity: new Date() })
        .match({ user_id: updateUser.user_id })
    : await supabase
        .from<IOnlineUser>(ETab.ONLINE_USERS)
        .update({ ...updateUser, last_activity: new Date() })
        .match({ id: updateUser.id })

  handleError(error)
  if (data && data[0]) {
    return data[0]
  }
  return null
}

export const removeOnlineUser = async (user: IRegisteredUser | IAnonymUser | null) => {
  if (!user) return
  const { data, error } = user.id
    ? await supabase.from(ETab.ONLINE_USERS).delete().match({ user_id: user.id })
    : await supabase.from(ETab.ONLINE_USERS).delete().match({ id: user.anonym_id })

  console.log('REMOVE ONLINE USER, res', { data })

  handleError(error)
  if (data && data[0]) {
    return data[0]
  }
  return null
}

export const anonymUserToStorage = (user: IRegisteredUser | IAnonymUser | null) => {
  if (!user || !user.anonym_id) return
  const data = {
    username: user.username,
    anonym_id: user.anonym_id,
    color: user.color,
    icons: user.icons,
    // session_id: user.session_id,
  }
  localStorage.setItem(EStorageKey.ANONYM_USER, JSON.stringify(data))
}
