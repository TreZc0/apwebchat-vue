import { defineStore } from 'pinia'
import { Client } from 'archipelago.js'
import type { MessageNode } from 'archipelago.js'
import type { ChatStoreState } from '@/types/chat.d.ts'
import { ChatClientStatus } from '@/enums/chat.ts'
import { convertMessageNodes } from '@/util/archipelagoUtils.ts'

// Maximum length of the chat log.
const MAX_LENGTH = 1000

const client = new Client()

export const useChatStore = defineStore('chat', {
  state: () =>
    ({
      status: ChatClientStatus.NOT_CONNECTED,
      chatLog: [],
    }) as ChatStoreState,
  actions: {
    receiveMessage(_text: string, nodes: MessageNode[]) {
      this.chatLog.push(convertMessageNodes(nodes))
      // ensure the chatlog doesn't exceed 1000 messages
      if (this.chatLog.length > MAX_LENGTH) {
        this.chatLog.shift()
      }
    },
    async connect(url: string, slot: string) {
      client.messages.on('message', this.receiveMessage)
      this.status = ChatClientStatus.CONNECTING
      try {
        await client.login(url, slot)
        this.status = ChatClientStatus.CONNECTED
      } catch (e) {
        console.error(e)
        this.status = ChatClientStatus.ERRORED
      }
    },
    async sendMessage(message: string) {
      await client.messages.say(message)
    },
  },
})
