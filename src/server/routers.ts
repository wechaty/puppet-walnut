import Router from 'koa-router'
import { checkDelivery, notifyAuthorization, parseMessage } from './parse.js'

const router = new Router()

router.get('/sms/notifyPath', notifyAuthorization)

router.post('/sms/messageNotification/sip:chatbotId@botplatform.rcs.chinaunicom.cn/messages', parseMessage)

router.post('/sms/deliveryNotification/sip:chatbotId@botplatform.rcs.chinaunicom.cn/status', checkDelivery)

export default router.routes()
