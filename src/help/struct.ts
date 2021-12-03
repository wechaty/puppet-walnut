interface MessageList {
  contentEncoding: string,
  contentText: string,
  contentType: string
}

export interface Message {
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
