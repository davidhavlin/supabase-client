export interface INotifyData {
  type: 'success' | 'error' | 'warning' | 'info'
  label: string
}
export interface INotify {
  visible: boolean
  data: INotifyData | null
}

export interface IUiState {
  settingsDrawer: boolean
  notify: INotify
}
