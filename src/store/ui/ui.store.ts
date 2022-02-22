import { defineStore, acceptHMRUpdate } from 'pinia'
import { INotifyData, IUiState } from './ui.types'

export const useUiStore = defineStore({
  id: 'ui',
  state: (): IUiState => ({
    settingsDrawer: false,
    notify: {
      visible: false,
      data: null,
    },
  }),

  actions: {
    showNotify(data: INotifyData) {
      this.notify.visible = true
      this.notify.data = data
    },
    hideNotify() {
      this.notify.visible = false
      this.notify.data = null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
