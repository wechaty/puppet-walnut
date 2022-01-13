import {post, uploadFile} from './request.js'
import { Api } from './api.js'
import { v4 as uuidV4 } from 'uuid'
import { log } from '../config.js'
import PuppetWalnut from '../puppet-walnut.js'
import {FileBoxInterface} from "file-box";

export function send (to: string, msg: string) {
  void post(Api.sendMessage, {
    contributionId: 'SFF$#REGFY7&^%THT',
    conversationId: 'XSFDSFDFSAFDSAS^%',
    destinationAddress: [`tel:+86${to}`],
    messageId: uuidV4(),
    messageList: [
      {
        contentEncoding: 'utf8',
        contentText: msg,
        contentType: 'text/plain',
      },
    ],
    senderAddress: PuppetWalnut.chatbotId,
    serviceCapabilit: [
      {
        capabilityId: 'ChatbotSA',
        version: '+g.gsma.rcs.botversion="#=1"',
      },
    ],
  }).then(res => {
    log.info('PuppetWalnut-Request-send', `messageId: ${res.data.messageId}`)
    return null
  },
  )
}

export function sendFile (to: string, file: FileBoxInterface) {
  void uploadFile(true, file)
  // void post(Api.sendMessage, {
  //   contributionId: 'SFF$#REGFY7&^%THT',
  //   conversationId: 'XSFDSFDFSAFDSAS^%',
  //   destinationAddress: [`tel:+86${to}`],
  //   messageId: uuidV4(),
  //   messageList: [
  //     {
  //       contentEncoding: 'utf8',
  //       contentText: msg,
  //       contentType: 'text/plain',
  //     },
  //   ],
  //   senderAddress: PuppetWalnut.chatbotId,
  //   serviceCapabilit: [
  //     {
  //       capabilityId: 'ChatbotSA',
  //       version: '+g.gsma.rcs.botversion="#=1"',
  //     },
  //   ],
  // }).then(res => {
  //   log.info('PuppetWalnut-Request-send', `messageId: ${res.data.messageId}`)
  //   return null
  // },
  // )
}

export function revoke () {
  void post(Api.revokeMessage, {
    destinationAddress: ['tel:+8613911833788'],
    messageId: 'VqHUSH8qbWFQDlqAGns',
    status: 'RevokeRequested',
  }).then(res => {
    log.info(res.data)
    return null
  },
  )
}
