/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import path from 'path'
import * as PUPPET from 'wechaty-puppet'
import { log } from 'wechaty-puppet'
import {
  FileBox,
  type FileBoxInterface,
}                           from 'file-box'
import koaBody from 'koa-body'

import {
  VERSION,
}             from './config.js'
// import { getAccessToken, startSyncingAccessToken } from './utils/get-access-token'
import Koa  from 'koa'
import Router from 'koa-router'
import rp from 'request-promise'
import { v4 as uuidv4 } from 'uuid'
export type PuppetWalnutOptions = PUPPET.PuppetOptions & {
  sms?: string
}
export interface AccessTokenPayload {
  timestamp : number,
  token     : string,
}
type StopperFn = () => void
const app = new Koa()
const router = new Router()
const url = 'maap.5g-msg.com:30001'
class PuppetWalnut extends PUPPET.Puppet {

  static override readonly VERSION = VERSION

  sms: string
  smsid:string
  server:any
  appId: string = process.env['WECHATY_PUPPET_WALNUT_APPID'] !
  appKey = process.env['WECHATY_PUPPET_WALNUT_APPKEY'] !
  sipId = process.env['WECHATY_PUPPET_WALNUT_SIPID'] !
  conversationId: string
  phone: string
  contributionId: string
  protected stopperFnList : StopperFn[]
  private messageStore : { [id:string]:any}
  protected accessTokenPayload? : AccessTokenPayload
  constructor (
    public override options: PuppetWalnutOptions = {},
  ) {
    super(options)
    log.verbose('PuppetWalnut', 'constructor("%s")', JSON.stringify(options))
    if (options.sms) {
      this.sms = options.sms
    } else {
      log.verbose('PuppetWalnut', 'constructor() creating the default PuppetWalnut')
      const sms = '+861234'
      this.sms = sms
    }
    this.smsid = uuidv4()
    this.conversationId = ''
    this.phone = ''
    this.contributionId = ''
    this.stopperFnList = []
    this.messageStore = {}
  }

  override async onStart (): Promise<void> {
    log.verbose('PuppetWalnut', 'onStart()')

    app.use(koaBody({
      multipart: true,
    }))

    app.use(async (ctx: any, next: any) => {
      const start = Date.now()
      const ms = Date.now() - start
      log.verbose(`${ctx.method} ${ctx.url} - ${ms}ms`)
      await next()
    })

    this.login(this.conversationId)

    router.get('/sms/notifyPath', async (ctx: any) => {
      const echostr = ctx.request.header.echostr
      ctx.body = {
        appId: this.appId,
        echoStr: echostr,
        msg: 'notifyPath',
      }
      ctx.set('appId', this.appId)
      ctx.set('echoStr', echostr)
    })
      .post(`/sms/messageNotification/sip:${this.sipId}@botplatform.rcs.chinaunicom.cn/messages`, async (ctx: any) => {
        const payload = ctx.request.body
        this.smsid = payload.messageId
        this.contributionId = payload.contributionId
        this.conversationId = payload.conversationId
        this.phone = payload.senderAddress
        this.messageStore[payload.messageId] = payload

        this.emit('message', { messageId: payload.messageId })

      })

    app.use(router.routes())
    app.use(router.allowedMethods())
    this.server = app.listen(5000, () => {
      log.verbose('服务开启在5000端口')
    })

    const succeed = await this.updateAccessToken()
    if (!succeed) {
      log.error('PuppetWalnut', 'onStart() updateAccessToken() failed.')
    }

    const stopper = await this.startSyncingAccessToken()
    this.stopperFnList.push(stopper)
  }

  override async onStop (): Promise<void> {
    log.verbose('PuppetWalnut', 'onStop()')

    if (this.isLoggedIn) {
      await this.logout()
    }

    this.stopperFnList.forEach(setImmediate)
    this.stopperFnList.length = 0

    // await some tasks...
    this.server.close()
  }

  override ding (data?: string): void {
    log.silly('PuppetWalnut', 'ding(%s)', data || '')
    setTimeout(() => this.emit('dong', { data: data || '' }), 1000)
  }

  async updateAccessToken (): Promise<boolean> {
    log.verbose('puppetWalnut', 'updateAccessToken()')
    const options = {
      method: 'POST',
      uri: `http://maap.5g-msg.com:30001/bot/v1/sip:${this.sipId}@botplatform.rcs.chinaunicom.cn/accessToken`,
      // eslint-disable-next-line sort-keys
      body: {
        appId:this.appId,
        appKey:this.appKey,
      },
      headers: {
        'content-type': 'application/json',
      },
      json: true,
    }
    await rp(options)
      .then((body: any) => {
        // eslint-disable-next-line promise/always-return
        if (body.accessToken) {
          this.accessTokenPayload = {
            timestamp : Date.now(),
            token: body.accessToken,
          }
        } else {
          void this.updateAccessToken()
        }
      })
      .catch((err:any) => {
        log.verbose(err)
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.updateAccessToken()
      })
    if (this.accessTokenPayload) {
      const expireTimestamp = this.accessTokenPayload.timestamp + 7200 * 1000

      if (expireTimestamp < Date.now()) {
        // expired.
        log.warn('puppetWalnut', 'updateAccessToken() token expired!')
        this.accessTokenPayload = undefined
      }
      return true
    }
    return false

  }

  protected async startSyncingAccessToken (): Promise<StopperFn> {
    log.verbose('puppetWalnut', 'startSyncingAccessToken()')

    const marginSeconds = 5 * 60  // 5 minutes
    const tryAgainSeconds = 60    // 1 minute

    /**
     * Huan(202102): Why we lost `NodeJS` ?
     *
     *  https://stackoverflow.com/a/56239226/1123955
     */
    let timer: undefined | ReturnType<typeof setTimeout>

    const update: () => void = () => this.updateAccessToken()
      .then(succeed => succeed
        ? 7200 - marginSeconds
        : tryAgainSeconds,
      )
      .then(seconds => setTimeout(update, seconds * 1000))
      // eslint-disable-next-line no-return-assign
      .then(newTimer => timer = newTimer)
      .catch(e => log.error('puppetWalnut', 'startSyncingAccessToken() update() rejection: %s', e))

    if (!this.accessTokenPayload) {
      await update()
    } else {
      /* token的有效期为7200秒 */
      const seconds = 7200 - marginSeconds
      timer = setTimeout(update, seconds * 1000)
    }

    return () => timer && clearTimeout(timer)
  }

  /**
   *
   * Contact
   *
   */
  override contactSelfName (_name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override contactSelfQRCode (): Promise<string> {
    throw new Error('Method not implemented.')
  }

  override contactSelfSignature (_signature: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override contactAlias(contactId: string): Promise<string>
  override contactAlias(contactId: string, alias: string | null): Promise<void>

  override async contactAlias (contactId: string, alias?: string | null): Promise<void | string> {
    log.verbose('PuppetWalnut', 'contactAlias(%s, %s)', contactId, alias)

    if (typeof alias === 'undefined') {
      return 'mock alias'
    }
  }

  override async contactPhone(contactId: string): Promise<string[]>
  override async contactPhone(contactId: string, phoneList: string[]): Promise<void>

  override async contactPhone (contactId: string, phoneList?: string[]): Promise<string[] | void> {
    log.verbose('PuppetWalnut', 'contactPhone(%s, %s)', contactId, phoneList)
    if (typeof phoneList === 'undefined') {
      return []
    }
  }

  override async contactCorporationRemark (contactId: string, corporationRemark: string) {
    log.verbose('PuppetWalnut', 'contactCorporationRemark(%s, %s)', contactId, corporationRemark)
  }

  override async contactDescription (contactId: string, description: string) {
    log.verbose('PuppetWalnut', 'contactDescription(%s, %s)', contactId, description)
  }

  override async contactList (): Promise<string[]> {
    log.verbose('PuppetWalnut', 'contactList()')
    // return [...this.mocker.cacheContactPayload.keys()]
    throw new Error('Method not implemented.')
  }

  override async contactAvatar(contactId: string): Promise<FileBoxInterface>
  override async contactAvatar(contactId: string, file: FileBoxInterface): Promise<void>

  override async contactAvatar (contactId: string, file?: FileBoxInterface): Promise<void | FileBoxInterface> {
    log.verbose('PuppetWalnut', 'contactAvatar(%s)', contactId)

    /**
     * 1. set
     */
    if (file) {
      return
    }

    /**
     * 2. get
     */
    const WECHATY_ICON_PNG = path.resolve('../../docs/images/wechaty-icon.png')
    return FileBox.fromFile(WECHATY_ICON_PNG)
  }

  override async contactRawPayloadParser (payload: PUPPET.payloads.Contact) { return payload }
  override async contactRawPayload (rawid: string): Promise<PUPPET.payloads.Contact> {
    log.verbose('PuppetWalnut', 'contactRawPayload(%s)', rawid)
    throw new Error('Method not implemented.')
  }

  /**
   *
   * Conversation
   *
   */
  override async messageRawPayloadParser (smsPayload: any): Promise<PUPPET.payloads.Message> {
    const payload: PUPPET.payloads.Message = {
      fromId: smsPayload.senderAddress,
      id: smsPayload.messageId,
      text: smsPayload.messageList[0].contentText,
      timestamp: Date.now(),
      toId: smsPayload.destinationAddress[0],
      type: PUPPET.types.Message.Text,
    }
    return payload
  }

  override async messageRawPayload (id: string): Promise<any> {
    log.verbose('PuppetWalnut', 'messageRawPayload(%s)', id)
    return this.messageStore[id]
  }

  async #messageSend (
    conversationId: string,
    something: string | FileBoxInterface, // | Attachment
  ): Promise<void> {
    log.verbose('PuppetWalnut', 'messageSend(%s, %s)', conversationId, something)
    if (typeof something !== 'string') {
      return
    }
    const accessToken = 'accessToken ' + this.accessTokenPayload?.token
    const URL = `http://${url}/bot/v1/sip:${this.sipId}@botplatform.rcs.chinaunicom.cn/messages`
    const options = {
      method: 'POST',
      uri: URL,
      // eslint-disable-next-line sort-keys
      headers: {
        'content-type': 'application/json',
        // eslint-disable-next-line sort-keys
        Authorization: accessToken,
      },
      // eslint-disable-next-line sort-keys
      body: {
        contributionId: this.contributionId,
        conversationId: this.conversationId,
        messageId: this.smsid,
        // eslint-disable-next-line sort-keys
        messageList: [
          {
            contentEncoding: 'UTF-8',
            contentText: something,
            contentType: 'text/plain',
          },
        ],
        // eslint-disable-next-line sort-keys
        destinationAddress: [
          this.phone,
        ],
        senderAddress: 'sip:20210401@botplatform.rcs.chinaunicom.cn',
        serviceCapability: [
          {
            capabilityId: 'ChatbotSA',
            version: '+g.gsma.rcs.botversion="#=1"',
          },
        ],
      },
      json: true,
    }
    await rp(options)
      // eslint-disable-next-line promise/always-return
      .then((res: any) => {
        log.verbose(res)
        return res
      })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        log.verbose(err)
      })
  }

  override async messageSendText (
    conversationId: string,
    text: string,
  ): Promise<void> {
    return this.#messageSend(conversationId, text)
  }

  override async messageSendContact (_conversationId: string, _contactId: string): Promise<string | void> {
    throw new Error('Method not implemented.')
  }

  override async messageSendFile (_conversationId: string, _file: FileBoxInterface): Promise<string | void> {
    throw new Error('Method not implemented.')
  }

  override async messageSendMiniProgram (_conversationId: string, _miniProgramPayload: PUPPET.payloads.MiniProgram): Promise<string | void> {
    throw new Error('Method not implemented.')
  }

  override async messageSendUrl (_conversationId: string, _urlLinkPayload: PUPPET.payloads.UrlLink): Promise<string | void> {
    throw new Error('Method not implemented.')
  }

  override tagContactAdd (_tagId: string, _contactId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override tagContactDelete (_tagId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override tagContactList(contactId: string): Promise<string[]>
  override tagContactList(): Promise<string[]>
  override tagContactList (_contactId?: any): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  override tagContactRemove (_tagId: string, _contactId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override friendshipAccept (_friendshipId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override friendshipAdd (_contactId: string, _option?: PUPPET.types.FriendshipAddOptions): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override friendshipSearchPhone (_phone: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  override friendshipSearchWeixin (_weixin: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  override friendshipRawPayload (_friendshipId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  override friendshipRawPayloadParser (_rawPayload: any): Promise<PUPPET.payloads.Friendship> {
    throw new Error('Method not implemented.')
  }

  override conversationReadMark (_conversationId: string, _hasRead?: boolean): Promise<boolean | void> {
    throw new Error('Method not implemented.')
  }

  override messageContact (_messageId: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  override messageFile (_messageId: string): Promise<FileBoxInterface> {
    throw new Error('Method not implemented.')
  }

  override messageImage (_messageId: string, _imageType: PUPPET.types.Image): Promise<FileBoxInterface> {
    throw new Error('Method not implemented.')
  }

  override messageMiniProgram (_messageId: string): Promise<PUPPET.payloads.MiniProgram> {
    throw new Error('Method not implemented.')
  }

  override messageUrl (_messageId: string): Promise<PUPPET.payloads.UrlLink> {
    throw new Error('Method not implemented.')
  }

  override messageForward (_conversationId: string, _messageId: string): Promise<string | void> {
    throw new Error('Method not implemented.')
  }

  override messageRecall (_messageId: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  override roomInvitationAccept (_roomInvitationId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override roomInvitationRawPayload (_roomInvitationId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  override roomInvitationRawPayloadParser (_rawPayload: any): Promise<PUPPET.payloads.RoomInvitation> {
    throw new Error('Method not implemented.')
  }

  override roomAdd (_roomId: string, _contactId: string, _inviteOnly?: boolean): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override roomAvatar (_roomId: string): Promise<FileBoxInterface> {
    throw new Error('Method not implemented.')
  }

  override roomCreate (_contactIdList: string[], _topic?: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  override roomDel (_roomId: string, _contactId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override roomList (): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  override roomQRCode (_roomId: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  override roomQuit (_roomId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override roomTopic(roomId: string): Promise<string>
  override roomTopic(roomId: string, topic: string): Promise<void>
  override roomTopic (_roomId: any, _topic?: any): Promise<void> | Promise<string> {
    throw new Error('Method not implemented.')
  }

  override roomRawPayload (_roomId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  override roomRawPayloadParser (_rawPayload: any): Promise<PUPPET.payloads.Room> {
    throw new Error('Method not implemented.')
  }

  override roomAnnounce(roomId: string): Promise<string>
  override roomAnnounce(roomId: string, text: string): Promise<void>
  override roomAnnounce (_roomId: any, _text?: any): Promise<void> | Promise<string> {
    throw new Error('Method not implemented.')
  }

  override roomMemberList (_roomId: string): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  override roomMemberRawPayload (_roomId: string, _contactId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  override roomMemberRawPayloadParser (_rawPayload: any): Promise<PUPPET.payloads.RoomMember> {
    throw new Error('Method not implemented.')
  }

}

export { PuppetWalnut }
export default PuppetWalnut
