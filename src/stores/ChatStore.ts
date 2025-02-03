import { defineStore } from 'pinia'
import { Client } from 'archipelago.js'

const client = new Client()

export const useChatStore = defineStore('chat', {
  state: () => ({
    connected: false,
    error: '',
    history: [],
  }),
  actions: {
    async connect(url: string, slot: string, password: string) {
      const options = {
        password: password || undefined
      }
      await client.login(url, slot, undefined, options)
    }
  }
})
