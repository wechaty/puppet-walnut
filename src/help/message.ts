import { post } from './request.js'
import { API } from './Api.js'
import { v4 as uuidV4 } from 'uuid'
import { log } from 'wechaty-puppet'
import PuppetWalnut from '../puppet-walnut.js'

export function send (to: string, msg: string) {
  void post(API.sendMessage, {
    messageId: uuidV4(),
    messageList: [
      {
        contentEncoding: 'utf8',
        contentText: msg,
        contentType: 'text/plain',
      },
    ],
    destinationAddress: [`tel:+86${to}`],
    senderAddress: PuppetWalnut.chatbotId,
    serviceCapabilit: [
      {
        capabilityId: 'ChatbotSA',
        version: '+g.gsma.rcs.botversion="#=1"',
      },
    ],
    conversationId: 'XSFDSFDFSAFDSAS^%',
    contributionId: 'SFF$#REGFY7&^%THT',
  }).then(res => {
    log.verbose(res.data.messageId)
    return null
  },
  )
}

export function revoke () {
  void post(API.revokeMessage, {
    destinationAddress: ['tel:+8613911833788'],
    messageId: 'VqHUSH8qbWFQDlqAGns',
    status: 'RevokeRequested',
  }).then(res => {
    log.info(res.data)
    return null
  },
  )
}
