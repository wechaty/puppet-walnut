import Router from 'koa-router'
import { checkDelivery, notifyAuthorization, parseMessage } from './parse.js'
export default function initRouter (prefix: string): Router {

  const router = new Router()

  router.get(prefix + '/notifyPath', notifyAuthorization)

  router.post(prefix + '/messageNotification/sip:chatbotId@botplatform.rcs.chinaunicom.cn/messages', parseMessage)

  router.post(prefix + '/deliveryNotification/sip:chatbotId@botplatform.rcs.chinaunicom.cn/status', checkDelivery)

  return router
}
