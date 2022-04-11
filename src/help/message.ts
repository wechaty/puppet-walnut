import { post, uploadFile } from './request.js'
import { Api } from './api.js'
import { v4 as uuidV4 } from 'uuid'
import { contentEncoding, contentType, log } from '../config.js'
import PuppetWalnut from '../puppet-walnut.js'
import type { FileBoxInterface } from 'file-box'
import type { MessageItem } from './struct.js'
import type * as PUPPET from 'wechaty-puppet'

export function sendTextMessage (to: string, msg: string) {
  sendMessage(to, {
    contentEncoding: contentEncoding.utf8,
    contentText: msg,
    contentType: contentType.text,
  })
}

export function sendLocationMessage (to: string, locationPayload: PUPPET.payloads.Location) {
  log.info(JSON.stringify(locationPayload))
  sendMessage(to, {
    contentEncoding: contentEncoding.utf8,
    contentText: 'geo:50.7311865,7.0914591;crs=gcj02;u=10;rcs-l=Qingfeng%20Steamed%20Dumpling%20Shop %20%F0%9F%8D%9A',
    contentType: contentType.text,
  })
}

export async function sendFileMessage (to: string, file: FileBoxInterface) {
  const fileItem = await uploadFile(true, file)
  sendMessage(to, {
    contentEncoding: contentEncoding.utf8,
    contentText: [fileItem],
    contentType: contentType.application,
  })
}

export async function sendPostMessage (to: string, postPayload: PUPPET.payloads.Post) {
  const list = postPayload.sayableList
  if (list[0]!.type !== 'Text' || list[1]!.type !== 'Text' || list[2]!.type !== 'Attachment') {
    throw new Error('Wrong Post!!!')
  }

  const fileItem = await uploadFile(true, list[2].payload.filebox)

  sendMessage(to, {
    contentEncoding: contentEncoding.utf8,
    contentText: {
      message: {
        generalPurposeCard: {
          content: {
            description: list[1].payload,
            media: {
              height: 'MEDIUM_HEIGHT',
              mediaContentType: fileItem.contentType,
              mediaFileSize: fileItem.fileSize,
              mediaUrl: fileItem.url,
            },
            title: list[0].payload,
          },
          layout: {
            cardOrientation: 'HORIZONTAL',
            descriptionFontStyle: ['calibri'],
            imageAlignment: 'LEFT',
            titleFontStyle: ['underline', 'bold'],
          },
        },
      },
    },
    contentType: 'application/vnd.gsma.botmessage.v1.0+json',
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
