import * as PUPPET  from 'wechaty-puppet'
import type { Message } from './struct'

export function messageParse (message: Message): PUPPET.payloads.Message {
  return {
    id: message.messageId,
    timestamp: Date.parse(new Date().toString()),
    type: PUPPET.types.Message.Text,
    text: message.messageList[0]!.contentText,
    fromId: message.senderAddress.replace('tel:+86', ''),
    toId: message.destinationAddress,
  }
}
