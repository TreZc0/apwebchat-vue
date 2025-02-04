/* Utilities for dealing with the Archipelago client. */
import type {
  MessageNode,
  TextualMessageNode,
  PlayerMessageNode,
  ItemMessageNode,
  LocationMessageNode,
  ColorMessageNode,
  Item,
} from 'archipelago.js'
import type { ChatMessage, ChatMessagePart } from '@/types/chat.d.ts'

export function getLocationType(item: Item) {
  if (item.filler) {
    return 'filler'
  } else if (item.useful) {
    return 'useful'
  } else if (item.progression) {
    return 'progression'
  } else if (item.trap) {
    return 'trap'
  } else {
    return 'default'
  }
}

/**
 * Convert a list of MessageNodes into a single ChatMessage.
 *
 * MessageNode objects have state issues when using within Vue, so it's best to convert them to a
 * format the framework can better understand the state for.
 */
export function convertMessageNodes(nodes: MessageNode[]): ChatMessage {
  // each message part should be static and consistently in order, so their index should be safe
  // to use as a key along w/ the message ID
  const timestamp = Date.now()
  const messageId = timestamp.toString(16)
  const parts: ChatMessagePart[] = nodes.map((node, idx) => {
    const nodeId = messageId + '_' + idx.toString()
    switch (node.type) {
      case 'color':
        const colorNode = node as ColorMessageNode
        return {
          id: nodeId,
          class: 'chat-message-part-color-' + colorNode.color,
          text: colorNode.text,
        }
      case 'location':
        const locationNode = node as LocationMessageNode
        return {
          id: nodeId,
          class: 'chat-message-part-location',
          text: locationNode.text,
        }
      case 'item':
        const itemNode = node as ItemMessageNode
        return {
          id: nodeId,
          // item classification has different colors - we use getLocationType above to determine
          // which one
          class: 'chat-message-part-item-' + getLocationType(itemNode.item),
          text: itemNode.item.name,
        }
      case 'player':
        const playerNode = node as PlayerMessageNode
        return {
          id: nodeId,
          class: 'chat-message-part-player',
          text: playerNode.player.alias,
        }
      case 'text':
        const textNode = node as TextualMessageNode
        return {
          id: nodeId,
          class: 'chat-message-part-text',
          text: textNode.text,
        }
      default:
        throw Error('Unknown node type: ' + node.type)
    }
  })
  return {
    id: messageId,
    timestamp: timestamp,
    parts,
  }
}
