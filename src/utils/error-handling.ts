import { PostgrestError } from '@supabase/supabase-js'
import { useUiStore } from '../store/ui/ui.store'

export const handleError = (error: PostgrestError | null) => {
  console.log('HANDLE ERROR', error)
  if (error) {
    const ui = useUiStore()

    ui.showNotify({ type: 'error', label: error.message })
    return
  }
}
