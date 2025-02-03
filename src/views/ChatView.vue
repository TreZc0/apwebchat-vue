<script setup lang="ts">
  import { ref } from 'vue'
  import { Client } from 'archipelago.js'
  import { MessageNode, TextualMessageNode, PlayerMessageNode, ItemMessageNode, LocationMessageNode,
  ColorMessageNode, Item} from 'archipelago.js'

  const MAX_LENGTH = 1000

  interface ChatMessage {
    id: string,
    timestamp: number,
    parts: ChatMessagePart[],
  }

  interface ChatMessagePart {
    id: string,
    class: string,
    text: string,
  }

  const client = new Client()
  const connecting = ref(false)
  const connected = ref(false)
  const url = ref('')
  const slot = ref('')
  const message = ref('')
  const chatLog = ref<ChatMessage[]>([])

  function getLocationType(item: Item) {
    if (item.filler) {
      return "filler"
    } else if (item.useful) {
      return "useful"
    } else if (item.progression) {
      return "progression"
    } else if (item.trap) {
      return "trap"
    } else {
      return "default"
    }
  }

  function receiveMessage(text: string, nodes: MessageNode[]) {
    // parse over the list of nodes and standardize them for display
    // (the archipelago client relies heavily on state vue cannot easily track)
    const timestamp = Date.now()
    const messageId = timestamp.toString(16)
    const parts: ChatMessagePart[] = nodes.map((node, idx) => {
      // each message part should be static and consistently in order, so their index should be safe
      // to use as a key along w/ the message ID
      const nodeId = messageId + "_" + idx.toString()
      switch (node.type) {
        case "color":
          const colorNode = node as ColorMessageNode
          return {
            id: nodeId,
            class: "chat-message-part-color-" + colorNode.color,
            text: colorNode.text,
          }
        case "location":
          const locationNode = node as LocationMessageNode
          return {
            id: nodeId,
            class: "chat-message-part-location",
            text: locationNode.text,
          }
        case "item":
          const itemNode = node as ItemMessageNode
          return {
            id: nodeId,
            // item classification has different colors - we use getLocationType above to determine
            // which one
            class: "chat-message-part-item-" + getLocationType(itemNode.item),
            text: itemNode.item.name,
          }
        case "player":
          const playerNode = node as PlayerMessageNode
          return {
            id: nodeId,
            class: "chat-message-part-player",
            text: playerNode.player.alias,
          }
        case "text":
          const textNode = node as TextualMessageNode
          return {
            id: nodeId,
            class: "chat-message-part-text",
            text: textNode.text,
          }
        default:
          throw Error("Unknown node type: " + node.type)
      }
    })
    chatLog.value.push({
      id: messageId,
      timestamp: timestamp,
      parts,
    })
    // ensure the chatlog doesn't exceed 1000 messages
    if (chatLog.value.length > MAX_LENGTH) {
      chatLog.value.shift()
    }
  }
  async function sendMessage(e: Event) {
    e.preventDefault()
    await client.messages.say(message.value)
    message.value = ''
  }

  async function connect(e: Event) {
    e.preventDefault()
    if (connecting.value) {
      return
    }
    client.messages.on("message", receiveMessage)
    connecting.value = true
    await client.login(url.value, slot.value)
    connecting.value = false
    connected.value = true
  }

</script>

<template>
  <div class="chat-log">
    <div class="chat-item" v-for="message in chatLog" :key="message.id">
      <p class="chat-message">
        <span v-for="part in message.parts" :key="part.id" :class="part.class">
          {{ part.text }}
        </span>
      </p>
    </div>
  </div>
  <form class="chat-input" v-if="connected" @submit="sendMessage">
    <input name="message" v-model="message" />
    <button name="message" type="submit">Say</button>
  </form>
  <form class="chat-input" @submit="connect" v-else>
    <div class="chat-input-field">
      <label for="url">URL</label>
      <input name="url" v-model="url" />
    </div>
    <div class="chat-input-field">
      <label for="slot">Slot</label>
      <input name="slot" v-model="slot" />
    </div>
    <span v-if="connecting">Connecting...</span>
    <button name="connect" type="submit" v-else>Connect</button>
  </form>
</template>

<style scoped>
.chat-log {
  background-color: #1d1f21;
  min-height: 100px;
  padding: 8px 8px 4px 8px;
  border-radius: 3px;
}
.chat-item {
  padding: 4px;
  margin-bottom: 8px;
  background-color: #2d2f31;
  border-radius: 3px;
}
.chat-message {
  padding: 4px;
  margin: 4px;
  white-space: pre-wrap;
}
.chat-input {
  display: flex;
  align-items: center;
  margin: 8px 0;
}
.chat-input-field {
  display: flex;
  align-items: center;
  flex-grow: 1;
}
input {
  flex-grow: 1;
  padding: 4px 4px 4px 0;
  margin: 4px 4px 4px 0;
  background-color: #1d1f21;
  color: #efefef;
  border: 2px solid #1d1f21;
  border-radius: 3px;
}
label {
  margin: 8px 4px 8px 0;
}
button {
  flex-shrink: 1;
  margin: 0;
  padding: 4px;
  background-color: #1d1f21;
  color: #efefef;
  border: 2px solid #1d1f21;
  border-radius: 3px;
}
button:hover {
  background-color: #2d2f31;
}
/* text node classes */
.chat-message-part-item-default {
  color: #5f6dd7;
}
.chat-message-part-item-filler {
  color: #5ed6d4;
}
.chat-message-part-item-useful {
  color: #5f6dd7;
}
.chat-message-part-item-progression {
  color: #875fd7;
}
.chat-message-part-item-trap {
  color: #d65e80;
}

.chat-message-part-player {
  color: #5f6dd7;
}
.chat-message-part-location {
  color: #875fd7;
}
/* see ValidJSONColorType for details on these */
.chat-message-part-color-bold {
  font-weight: bold;
}
.chat-message-part-color-underline {
  text-decoration: underline;
}
.chat-message-part-color-black {
  color: black;
}
.chat-message-part-color-red {
  color: red;
}
.chat-message-part-color-green {
  color: green;
}
.chat-message-part-color-yellow {
  color: yellow;
}
.chat-message-part-color-blue {
  color: blue;
}
.chat-message-part-color-magenta {
  color: magenta;
}
.chat-message-part-color-cyan {
  color: cyan;
}
.chat-message-part-color-white {
  color: white;
}
.chat-message-part-color-red_bg {
  background-color: red;
}
.chat-message-part-color-green_bg {
  background-color: green;
}
.chat-message-part-color-yellow_bg {
  background-color: yellow;
}
.chat-message-part-color-blue_bg {
  background-color: blue;
}
.chat-message-part-color-magenta_bg {
  background-color: magenta;
}
.chat-message-part-color-cyan_bg {
  background-color: cyan;
}
.chat-message-part-color-white_bg {
  background-color: white;
}

@media only screen and (max-width: 768px) {
  .chat-input {
    flex-direction: column;
  }
}
</style>
