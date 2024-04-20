interface ChatCallbackResponse {
  status: 'OK' | 'ERROR'
  data?: {}
  error?: unknown
}

export interface CallBack {
  (response: ChatCallbackResponse): void
}
