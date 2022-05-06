import PuppetWalnut from '../puppet-walnut.js'
import type { WalnutMessagePayload } from '../help/struct.js'
import { log } from '../config.js'

function notifyAuthorization (ctx: any) {
  log.silly('notifyAuthorization', JSON.stringify(ctx.request))
  const echoStr : string = ctx.request.get('echoStr')
  ctx.set({
    appId: PuppetWalnut.appId,
    echoStr: echoStr,
  })
  ctx.response.body = {}
}

function parseMessage (ctx: any) {
  log.silly('parseMessage', JSON.stringify(ctx.request.body))
  const message: WalnutMessagePayload = ctx.request.body
  void PuppetWalnut.getCacheManager().setMessage(message.messageId, message)
  const phone = message.senderAddress.replace('tel:+86', '')
  void PuppetWalnut.getCacheManager().setContact(phone, {
    name: phone,
    phone: phone,
  })
  PuppetWalnut.instance.emit('message', { messageId: message.messageId })
  ctx.response.body = {
    contributionId: message.contributionId,
    conversationId: message.conversationId,
    errorCode: 0,
    errorMessage: '',
    messageId: message.messageId,
  }
}

function checkDelivery (ctx: any) {
  log.silly('checkDelivery', JSON.stringify(ctx.request.body))
  if (ctx.request.body.deliveryInfoList[0].errorCode !== 0) {
    log.warn('puppet-5g sever', 'message send error')
  }
  ctx.response.body = {
    errorCode: 0,
    errorMessage: '',
  }
}

export { notifyAuthorization, parseMessage, checkDelivery }
