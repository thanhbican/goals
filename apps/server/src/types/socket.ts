interface CallbackResponse {
  status: 'OK' | 'ERROR'
  data?: {}
  error?: unknown
}

export interface CallBack {
  (response: CallbackResponse): void
}
