import { post, uploadFile } from './request.js'
import { Api } from './api.js'
import { v4 as uuidV4 } from 'uuid'
import { contentEncoding, contentType, log } from '../config.js'
import PuppetWalnut from '../puppet-walnut.js'
import type { FileBoxInterface } from 'file-box'
import type { MessageItem } from './struct.js'
import type * as PUPPET from 'wechaty-puppet'
export function sendTextMessage (contactId: string, msg: string) {
  sendMessage(contactId, {
    contentEncoding: contentEncoding.utf8,
    contentText: msg,
    contentType: contentType.text,
  })
}

export function sendLocationMessage (contactId: string, locationPayload: PUPPET.payloads.Location) {
  log.info(JSON.stringify(locationPayload))
  sendMessage(contactId, {
    contentEncoding: contentEncoding.utf8,
    contentText: 'geo:50.7311865,7.0914591;crs=gcj02;u=10;rcs-l=Qingfeng%20Steamed%20Dumpling%20Shop %20%F0%9F%8D%9A',
    contentType: contentType.text,
  })
}

export async function sendFileMessage (contactId: string, file: FileBoxInterface) {
  const fileItem = await uploadFile(true, file)
  fileItem.contentType = 'image/png'

  sendMessage(contactId, {
    contentEncoding: contentEncoding.utf8,
    contentText: [fileItem],
    contentType: contentType.application,
  })
}

export async function sendPostMessage (contactId: string, postPayload: PUPPET.payloads.Post) {
  const title = postPayload.sayableList[0] as PUPPET.payloads.Sayable
  const description = postPayload.sayableList[1] as PUPPET.payloads.Sayable
  const img = postPayload.sayableList[2] as PUPPET.payloads.Sayable
  if (title.type !== 'Text' || description.type !== 'Text' || img.type !== 'Attachment') {
    throw new Error('Wrong Post!!! please check your Post payload to make sure it right')
  }
  const fileItem = await uploadFile(true, (<FileBoxInterface>img.payload.filebox))

  const msg = {
    contentEncoding: contentEncoding.utf8,
    contentText: {
      message: {
        generalPurposeCard: {
          content: {
            description: description.payload.text,
            media: {
              height: 'MEDIUM_HEIGHT',
              mediaContentType: fileItem.contentType,
              mediaFileSize: fileItem.fileSize,
              mediaUrl: fileItem.url,
            },
            title: title.payload.text,
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
  }

  sendMessage(contactId, msg)
}

export function sendMessage (contactId: string, msg: MessageItem) {
  void post(Api.sendMessage, {
    contributionId: 'SFF$#REGFY7&^%THT',
    conversationId: 'XSFDSFDFSAFDSAS^%',
    destinationAddress: [`tel:+86${contactId}`],
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
