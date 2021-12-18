import Router from 'koa-router'
import { checkDelivery, notifyAuthorization, parseMessage } from './parse.js'

const router = new Router()

router.get('/sms/notifyPath', notifyAuthorization)

router.post('/sms/messageNotification/sip:20210401@botplatform.rcs.chinaunicom.cn/messages', parseMessage)

router.post('/sms/deliveryNotification/sip:20210401@botplatform.rcs.chinaunicom.cn/status', checkDelivery)

export default router.routes()
