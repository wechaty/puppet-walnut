import { post, uploadFile } from './request.js'
import { Api } from './api.js'
import { v4 as uuidV4 } from 'uuid'
import { contentEncoding, log } from '../config.js'
import PuppetWalnut from '../puppet-walnut.js'
import type { FileBoxInterface } from 'file-box'
import type { MessageItem } from './struct.js'
import type * as PUPPET from 'wechaty-puppet'

export function sendTextMessage (to: string, msg: string) {
  sendMessage(to, {
    contentEncoding: contentEncoding.utf8,
    contentText: msg,
    contentType: 'text/plain',
  })
}

export function sendLocationMessage (to: string, locationPayload: PUPPET.payloads.Location) {
  log.info(JSON.stringify(locationPayload))
  sendMessage(to, {
    contentEncoding: contentEncoding.utf8,
    contentText: 'geo:50.7311865,7.0914591;crs=gcj02;u=10;rcs-l=Qingfeng%20Steamed%20Dumpling%20Shop %20%F0%9F%8D%9A',
    contentType: 'text/plain',
  })
}

export async function sendFileMessage (to: string, file: FileBoxInterface) {
  const fileItem = await uploadFile(true, file)
  sendMessage(to, {
    contentEncoding: 'utf8',
    contentText: fileItem,
    contentType: 'application/vnd.gsma.rcs-ft-http',
  })
}

export function sendMessage (to: string, msg: MessageItem) {
  void post(Api.sendMessage, {
    contributionId: 'SFF$#REGFY7&^%THT',
    conversationId: 'XSFDSFDFSAFDSAS^%',
    destinationAddress: [`tel:+86${to}`],
    messageId: uuidV4(),
    messageList: [
      msg,
    ],
    senderAddress: PuppetWalnut.chatbotId,
    serviceCapabilit: [
      {
        capabilityId: 'ChatbotSA',
        version: '+g.gsma.rcs.botversion="#=1"',
      },
    ],
  })
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
