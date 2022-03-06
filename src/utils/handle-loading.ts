import { PostgrestError } from '@supabase/supabase-js'
import { useUiStore } from '../store/ui/ui.store'

export const handleLoading = (bool = true) => {
  const ui = useUiStore()

  ui.loading = bool
}
