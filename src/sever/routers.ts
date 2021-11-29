import Router from "koa-router";
import type {message} from "../help/struct";
import * as PUPPET  from 'wechaty-puppet';
import PuppetWalnut from "../puppet-walnut";
const router = new Router();

router.get('/sms/notifyPath', async (ctx: any) => {
    console.log(ctx.header)
})

router.post(`/sms/messageNotification/sip:20210401@botplatform.rcs.chinaunicom.cn/messages`, async (ctx: any) => {
    const puppet: PuppetWalnut = ctx.puppet
    let message: message = ctx.request.body
    puppet.onMessage(message)
    ctx.response.body = {
        messageId: message.messageId,
        conversationId: message.conversationId,
        contributionId: message.contributionId,
        errorCode: 0,
        errorMessage: ""
    }
})

router.post(`/sms/deliveryNotification/sip:20210401@botplatform.rcs.chinaunicom.cn/status`, async (ctx: any) => {
    if(ctx.request.body.deliveryInfoList[0].errorCode != 0){
        PUPPET.log.warn("puppet-5g sever", "message send error")
    }
    ctx.response.body = {
        errorCode: 0,
        errorMessage: ""
    }
})

export default router.routes()
