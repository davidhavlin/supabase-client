import { ApiError, PostgrestError } from '@supabase/supabase-js'
import { useUiStore } from '../store/ui/ui.store'
import { handleLoading } from './handle-loading'

export const handleError = (error: PostgrestError | ApiError | null) => {
  if (error) {
    handleLoading(false)
    const ui = useUiStore()

    let label = error.message
    if (label.includes('duplicate key value violates unique constraint')) {
      label = 'Uživateľ s takým menom už existuje.'
    }

    ui.showNotify({ type: 'error', label })
    return
  }
}
