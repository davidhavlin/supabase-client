import { ApiError, PostgrestError } from '@supabase/supabase-js'
import { useUiStore } from '../store/ui/ui.store'
import { handleLoading } from './handle-loading'

export const handleError = (error: PostgrestError | ApiError | null) => {
  if (error) {
    handleLoading(false)
    const ui = useUiStore()

    ui.showNotify({ type: 'error', label: error.message })
    return
  }
}
