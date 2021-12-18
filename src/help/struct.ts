interface MessageList {
  contentEncoding: string,
  contentText: string,
  contentType: string
}

export interface WalnutMessagePayload {
  // refer to: https://github.com/fabian4/puppet-walnut/blob/main/docs/%E6%8E%A5%E5%8F%A3%E8%A7%84%E8%8C%83.md#30
  contributionId: string,
  conversationId: string,
  dateTime: string,
  destinationAddress: string,
  messageFileSize: number,
  messageId: string,
  messageItem: string,
  messageList: MessageList[],
  senderAddress: string
}

export interface WalnutContactPayload {
  phone: string
}
