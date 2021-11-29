import * as PUPPET  from 'wechaty-puppet';
import type {message} from "./struct";

export function messageParse(message: message): PUPPET.payload.Message {
    return {
        id: message.messageId,
        timestamp: Date.parse(new Date().toString()),
        type: PUPPET.type.Message.Text,
        text: message.messageList[0]!.contentText,
        fromId: message.senderAddress.replace("tel:+86", ""),
        toId: message.destinationAddress
    }
}
