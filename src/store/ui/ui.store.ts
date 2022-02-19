import { defineStore, acceptHMRUpdate } from 'pinia'
import { IUiState } from './ui.types'

export const useUiStore = defineStore({
  id: 'user',
  state: (): IUiState => ({
    settingsDrawer: false,
  }),

  actions: {},
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
