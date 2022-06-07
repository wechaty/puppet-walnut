export interface FileItem {
  contentType: string,
  fileName: string,
  fileSize: string,
  type: string,
  until: string,
  url: string,
}

export interface MessageItem {
  contentEncoding: string,
  contentText: string | FileItem[] | {},
  contentType: string
}

export enum MessageRawType {
  image = 'image',
  text = 'text',
  location = 'location',
  audio = 'audio',
  video = 'video',
  other = 'other'
}

export interface WalnutMessagePayload {
  // refer to: https://github.com/fabian4/puppet-walnut/blob/main/docs/%E6%8E%A5%E5%8F%A3%E8%A7%84%E8%8C%83.md#30
  contributionId: string,
  conversationId: string,
  dateTime: string,
  destinationAddress: string,
  messageFileSize: number,
  messageId: string,
  messageItem: MessageRawType,
  messageList: MessageItem[],
  senderAddress: string
}

export interface WalnutContactPayload {
  name: string
  phone: string
}
