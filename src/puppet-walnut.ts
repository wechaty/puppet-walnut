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
import {
  ContactPayload,

  FileBox,

  FriendshipPayload,

  ImageType,

  MessagePayload,

  Puppet,
  PuppetOptions,

  RoomInvitationPayload,
  RoomMemberPayload,
  RoomPayload,

  UrlLinkPayload,
  MiniProgramPayload,

  log,
  MessageType,
  FriendshipAddOptions,
} from 'wechaty-puppet'

import {
  VERSION,
} from './config'

export type PuppetWalnutOptions = PuppetOptions & {
  sms?: string
}
const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const rp = require('request-promise')
const getAccessToken = require('./utils/getAccessToken')
const url = 'maap.5g-msg.com:30001'
const sipID = '20210401'
const app = new Koa()
const router = new Router()
const { v4: uuidv4 } = require('uuid')
class PuppetWalnut extends Puppet {

  static override readonly VERSION = VERSION

  sms: string
  smsid:string
  server:any
  router:any
  appId: string = process.env['WECHATY_PUPPET_WALNUT_APPID'] !
  conversationId: string = process.env['WECHATY_PUPPET_WALNUT_CONVERSATIONID'] !
  phone: string = process.env['WECHATY_PUPPET_WALNUT_PHONE'] !
  contributionId: string = process.env['WECHATY_PUPPET_WALNUT_CONTRIBUTIONID'] !
  private messageStore : { [id:string]:any}
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
    this.messageStore = {}
  }

  override async start (): Promise<void> {
    if (this.state.on()) {
      log.warn('PuppetWalnut', 'start() is called on a ON puppet. await ready(on) and return.')
      await this.state.ready('on')
      return
    }
    this.state.on('pending')

    // Do some async initializing tasks

    app.use(koaBody({
      mltipart: true,
    }))

    app.use(async (ctx: any, next: any) => {
      const start = Date.now()
      const ms = Date.now() - start
      log.verbose(`${ctx.method} ${ctx.url} - ${ms}ms`)
      await next()
    })
    void this.login(this.conversationId)
    this.router = router.get('/sms/notifyPath', async (ctx: any) => {
      const echostr = ctx.request.header.echostr
      ctx.body = {
        appId: this.appId,
        echoStr: echostr,
        msg: 'notifyPath',
      }
      this.id = this.appId
      ctx.set('appId', this.appId)
      ctx.set('echoStr', echostr)
    })

    router.post('/sms/messageNotification/sip:20210401@botplatform.rcs.chinaunicom.cn/messages', async (ctx: any) => {
      const payload = ctx.request.body
      this.smsid = payload.messageId
      this.messageStore[payload.messageId] = payload

      this.emit('message', { messageId: payload.messageId })

    })

    app.use(router.routes())
    app.use(router.allowedMethods())
    this.server = app.listen(5000, () => {
      log.verbose('服务开启在5000端口')
    })
    this.state.on(true)
    /**
     * Start mocker after the puppet fully turned ON.
     */
    // setImmediate(() => this.mocker.start())
  }

  override async stop (): Promise<void> {
    log.verbose('PuppetWalnut', 'stop()')
    if (this.state.off()) {
      log.warn('PuppetWalnut', 'stop() is called on a OFF puppet. await ready(off) and return.')
      await this.state.ready('off')
      return
    }

    this.state.off('pending')

    // if (this.loopTimer) {
    //   clearInterval(this.loopTimer)
    // }

    // this.mocker.stop()

    if (this.logonoff()) {
      await this.logout()
    }

    // await some tasks...
    this.server.close()
    this.router.close()
    this.id = undefined
    this.state.off(true)
  }

  override login (contactId: string): Promise<void> {
    log.verbose('PuppetWalnut', 'login()')
    return super.login(contactId)
  }

  override async logout (): Promise<void> {
    log.verbose('PuppetWalnut', 'logout()')

    if (!this.id) {
      throw new Error('logout before login?')
    }

    this.emit('logout', { contactId: this.id, data: 'test' }) // before we will throw above by logonoff() when this.user===undefined
    this.id = undefined

    // TODO: do the logout job
  }

  override ding (data?: string): void {
    log.silly('PuppetWalnut', 'ding(%s)', data || '')
    setTimeout(() => this.emit('dong', { data: data || '' }), 1000)
  }

  /**
   *
   * Contact
   *
   */
  contactSelfName (_name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  contactSelfQRCode (): Promise<string> {
    throw new Error('Method not implemented.')
  }

  contactSelfSignature (_signature: string): Promise<void> {
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

  override async contactAvatar(contactId: string): Promise<FileBox>
  override async contactAvatar(contactId: string, file: FileBox): Promise<void>

  override async contactAvatar (contactId: string, file?: FileBox): Promise<void | FileBox> {
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

  override async contactRawPayloadParser (payload: ContactPayload) { return payload }
  override async contactRawPayload (rawid: string): Promise<ContactPayload> {
    log.verbose('PuppetWalnut', 'contactRawPayload(%s)', rawid)
    throw new Error('Method not implemented.')
  }

  /**
   *
   * Conversation
   *
   */
  override async messageRawPayloadParser (smsPayload: any): Promise<MessagePayload> {
    const payload: MessagePayload = {
      fromId: smsPayload.senderAddress,
      id: smsPayload.messageId,
      text: smsPayload.messageList[0].contentText,
      timestamp: Date.now(),
      toId: smsPayload.destinationAddress[0],
      type: MessageType.Text,
    }
    return payload
  }

  override async messageRawPayload (id: string): Promise<any> {
    log.verbose('PuppetWalnut', 'messageRawPayload(%s)', id)
    return this.messageStore[id]
  }

  async #messageSend (
    conversationId: string,
    something: string | FileBox, // | Attachment
  ): Promise<void> {
    log.verbose('PuppetWalnut', 'messageSend(%s, %s)', conversationId, something)
    if (typeof something !== 'string') {
      return
    }
    const token = await getAccessToken()
    const accessToken = 'accessToken ' + token
    const URL = `http://${url}/bot/v1/sip:${sipID}@botplatform.rcs.chinaunicom.cn/messages`
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

  async messageSendContact (_conversationId: string, _contactId: string): Promise<string | void> {
    throw new Error('Method not implemented.')
  }

  async messageSendFile (_conversationId: string, _file: FileBox): Promise<string | void> {
    throw new Error('Method not implemented.')
  }

  async messageSendMiniProgram (_conversationId: string, _miniProgramPayload: MiniProgramPayload): Promise<string | void> {
    throw new Error('Method not implemented.')
  }

  async messageSendUrl (_conversationId: string, _urlLinkPayload: UrlLinkPayload): Promise<string | void> {
    throw new Error('Method not implemented.')
  }

  tagContactAdd (_tagId: string, _contactId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  tagContactDelete (_tagId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  tagContactList(contactId: string): Promise<string[]>
  tagContactList(): Promise<string[]>
  tagContactList (_contactId?: any): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  tagContactRemove (_tagId: string, _contactId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  friendshipAccept (_friendshipId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  friendshipAdd (_contactId: string, _option?: FriendshipAddOptions): Promise<void> {
    throw new Error('Method not implemented.')
  }

  friendshipSearchPhone (_phone: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  friendshipSearchWeixin (_weixin: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  protected friendshipRawPayload (_friendshipId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  protected friendshipRawPayloadParser (_rawPayload: any): Promise<FriendshipPayload> {
    throw new Error('Method not implemented.')
  }

  conversationReadMark (_conversationId: string, _hasRead?: boolean): Promise<boolean | void> {
    throw new Error('Method not implemented.')
  }

  messageContact (_messageId: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  messageFile (_messageId: string): Promise<FileBox> {
    throw new Error('Method not implemented.')
  }

  messageImage (_messageId: string, _imageType: ImageType): Promise<FileBox> {
    throw new Error('Method not implemented.')
  }

  messageMiniProgram (_messageId: string): Promise<MiniProgramPayload> {
    throw new Error('Method not implemented.')
  }

  messageUrl (_messageId: string): Promise<UrlLinkPayload> {
    throw new Error('Method not implemented.')
  }

  messageForward (_conversationId: string, _messageId: string): Promise<string | void> {
    throw new Error('Method not implemented.')
  }

  messageRecall (_messageId: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  roomInvitationAccept (_roomInvitationId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  protected roomInvitationRawPayload (_roomInvitationId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  protected roomInvitationRawPayloadParser (_rawPayload: any): Promise<RoomInvitationPayload> {
    throw new Error('Method not implemented.')
  }

  roomAdd (_roomId: string, _contactId: string, _inviteOnly?: boolean): Promise<void> {
    throw new Error('Method not implemented.')
  }

  roomAvatar (_roomId: string): Promise<FileBox> {
    throw new Error('Method not implemented.')
  }

  roomCreate (_contactIdList: string[], _topic?: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  roomDel (_roomId: string, _contactId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  roomList (): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  roomQRCode (_roomId: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  roomQuit (_roomId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  roomTopic(roomId: string): Promise<string>
  roomTopic(roomId: string, topic: string): Promise<void>
  roomTopic (_roomId: any, _topic?: any): Promise<void> | Promise<string> {
    throw new Error('Method not implemented.')
  }

  protected roomRawPayload (_roomId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  protected roomRawPayloadParser (_rawPayload: any): Promise<RoomPayload> {
    throw new Error('Method not implemented.')
  }

  roomAnnounce(roomId: string): Promise<string>
  roomAnnounce(roomId: string, text: string): Promise<void>
  roomAnnounce (_roomId: any, _text?: any): Promise<void> | Promise<string> {
    throw new Error('Method not implemented.')
  }

  roomMemberList (_roomId: string): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  protected roomMemberRawPayload (_roomId: string, _contactId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  protected roomMemberRawPayloadParser (_rawPayload: any): Promise<RoomMemberPayload> {
    throw new Error('Method not implemented.')
  }

}

export { PuppetWalnut }
export default PuppetWalnut
