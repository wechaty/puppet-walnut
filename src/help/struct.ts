export interface message {
    contributionId: string,
    conversationId: string,
    dateTime: string,
    destinationAddress: string,
    messageFileSize: number,
    messageId: string,
    messageItem: string,
    messageList: messageList[],
    senderAddress: string
}

interface messageList {
    contentEncoding: string,
    contentText: string,
    contentType: string
}


