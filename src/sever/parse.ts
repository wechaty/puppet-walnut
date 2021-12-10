import { log } from 'wechaty-puppet'
import PuppetWalnut from '../puppet-walnut.js'
import type { WalnutMessagePayload } from '../help/struct.js'

function notifyAuthorization (ctx: any) {
  log.info(ctx.header)
}

function parseMessage (ctx: any) {
  const message: WalnutMessagePayload = ctx.request.body
  void PuppetWalnut.cacheManager?.setMessage(message.messageId, message)
  void PuppetWalnut.cacheManager?.setContact(message.senderAddress.replace('tel:+86', ''), { phone: message.senderAddress.replace('tel:+86', '') })
  PuppetWalnut.instance.emit('message', { messageId: message.messageId })
  ctx.response.body = {
    messageId: message.messageId,
    conversationId: message.conversationId,
    contributionId: message.contributionId,
    errorCode: 0,
    errorMessage: '',
  }
}

function checkDelivery (ctx: any) {
  if (ctx.request.body.deliveryInfoList[0].errorCode !== 0) {
    log.warn('puppet-5g sever', 'message send error')
  }
  ctx.response.body = {
    errorCode: 0,
    errorMessage: '',
  }
}

export { notifyAuthorization, parseMessage, checkDelivery }
