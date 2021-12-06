interface MessageList {
  contentEncoding: string,
  contentText: string,
  contentType: string
}

export interface WalnutMessagePayload {
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
