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
  PayloadType,
  MessageType,
} from 'wechaty-puppet'

import {
  CHATIE_OFFICIAL_ACCOUNT_QRCODE,
  qrCodeForChatie,
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
const portfinder = require('portfinder')
const { v4: uuidv4 } = require('uuid')
class PuppetWalnut extends Puppet {

  static override readonly VERSION = VERSION

  private loopTimer?: ReturnType<typeof setTimeout>

  sms: string
  smsid:string
  server:any
  appId: string = process.env['WECHATY_PUPPET_WALNUT_APPID'] !
  conversationId: string = process.env['WECHATY_PUPPET_WALNUT_CONVERSATIONID'] !
  phoneNumber: string = process.env['WECHATY_PUPPET_WALNUT_phoneNumber'] !
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
    router.get('/sms/notifyPath', async (ctx: any) => {
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

      .post('/sms/messageNotification/sip:20210401@botplatform.rcs.chinaunicom.cn/messages', async (ctx: any) => {
        const payload = ctx.request.body
        this.smsid = payload.messageId
        this.messageStore[payload.messageId] = payload

        this.emit('message', { messageId: payload.messageId })

      })

    app.use(router.routes())
    app.use(router.allowedMethods())
    portfinder.getPortPromise()
      .then((port:any) => {
        this.server = app.listen(port, () => {
          log.info('服务开启在端口' + port)
        })
        return port
      })
      .catch((err:any) => {
        log.info(err)
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

  override unref (): void {
    log.verbose('PuppetWalnut', 'unref()')
    super.unref()
    if (this.loopTimer) {
      this.loopTimer.unref()
    }
  }

  /**
   *
   * ContactSelf
   *
   *
   */
  override async contactSelfQRCode (): Promise<string> {
    log.verbose('PuppetWalnut', 'contactSelfQRCode()')
    return CHATIE_OFFICIAL_ACCOUNT_QRCODE
  }

  override async contactSelfName (name: string): Promise<void> {
    log.verbose('PuppetWalnut', 'contactSelfName(%s)', name)
  }

  override async contactSelfSignature (signature: string): Promise<void> {
    log.verbose('PuppetWalnut', 'contactSelfSignature(%s)', signature)
  }

  /**
   *
   * Contact
   *
   */
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
  override async conversationReadMark (conversationId: string, hasRead?: boolean): Promise<void> {
    log.verbose('PuppetService', 'conversationRead(%s, %s)', conversationId, hasRead)
  }

  /**
   *
   * Message
   *
   */
  override async messageContact (
    messageId: string,
  ): Promise<string> {
    log.verbose('PuppetWalnut', 'messageContact(%s)', messageId)
    // const attachment = this.mocker.MockMessage.loadAttachment(messageId)
    // if (attachment instanceof ContactMock) {
    //   return attachment.id
    // }
    return ''
  }

  override async messageImage (
    messageId: string,
    imageType: ImageType,
  ): Promise<FileBox> {
    log.verbose('PuppetWalnut', 'messageImage(%s, %s[%s])',
      messageId,
      imageType,
      ImageType[imageType],
    )
    // const attachment = this.mocker.MockMessage.loadAttachment(messageId)
    // if (attachment instanceof FileBox) {
    //   return attachment
    // }
    return FileBox.fromQRCode('fake-qrcode')
  }

  override async messageRecall (
    messageId: string,
  ): Promise<boolean> {
    log.verbose('PuppetWalnut', 'messageRecall(%s)', messageId)
    return false
  }

  override async messageFile (id: string): Promise<FileBox> {
    // const attachment = this.mocker.MockMessage.loadAttachment(id)
    // if (attachment instanceof FileBox) {
    //   return attachment
    // }
    return FileBox.fromBase64(
      'cRH9qeL3XyVnaXJkppBuH20tf5JlcG9uFX1lL2IvdHRRRS9kMMQxOPLKNYIzQQ==',
      'mock-file' + id + '.txt',
    )
  }

  override async messageUrl (messageId: string): Promise<UrlLinkPayload> {
    log.verbose('PuppetWalnut', 'messageUrl(%s)', messageId)
    // const attachment = this.mocker.MockMessage.loadAttachment(messageId)
    // if (attachment instanceof UrlLink) {
    //   return attachment.payload
    // }
    return {
      title: 'mock title for ' + messageId,
      url: 'https://mock.url',
    }
  }

  override async messageMiniProgram (messageId: string): Promise<MiniProgramPayload> {
    log.verbose('PuppetWalnut', 'messageMiniProgram(%s)', messageId)
    // const attachment = this.mocker.MockMessage.loadAttachment(messageId)
    // if (attachment instanceof MiniProgram) {
    //   return attachment.payload
    // }
    return {
      title: 'mock title for ' + messageId,
    }
  }

  override async messageRawPayloadParser (smsPayload: any): Promise<MessagePayload> {
    const payload: MessagePayload = {
      fromId: smsPayload.senderAddress,
      id: smsPayload.messageId,
      text: smsPayload.messageList[0].contentText,
      timestamp: Date.now(),
      toId: smsPayload.destinationAddress[0],
      type: MessageType.Text,
    }
    log.info('in messageRawPayloadParser')
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
        contributionId: '7f6505f0ss014012225a31b46d6d3c912',
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
          'tel:+8613911833788',
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

  override async messageSendFile (
    conversationId: string,
    file: FileBox,
  ): Promise<void> {
    return this.#messageSend(conversationId, file)
  }

  override async messageSendContact (
    conversationId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetMock', 'messageSendUrl(%s, %s)', conversationId, contactId)

    // const contact = this.mocker.MockContact.load(contactId)
    // return this.messageSend(conversationId, contact)
  }

  override async messageSendUrl (
    conversationId: string,
    urlLinkPayload: UrlLinkPayload,
  ): Promise<void> {
    log.verbose('PuppetMock', 'messageSendUrl(%s, %s)', conversationId, JSON.stringify(urlLinkPayload))

    // const url = new UrlLink(urlLinkPayload)
    // return this.messageSend(conversationId, url)
  }

  override async messageSendMiniProgram (
    conversationId: string,
    miniProgramPayload: MiniProgramPayload,
  ): Promise<void> {
    log.verbose('PuppetMock', 'messageSendMiniProgram(%s, %s)', conversationId, JSON.stringify(miniProgramPayload))
    // const miniProgram = new MiniProgram(miniProgramPayload)
    // return this.messageSend(conversationId, miniProgram)
  }

  override async messageForward (
    conversationId: string,
    messageId: string,
  ): Promise<void> {
    log.verbose('PuppetMock', 'messageForward(%s, %s)',
      conversationId,
      messageId,
    )
  }

  /**
   *
   * Room
   *
   */
  override async roomRawPayloadParser (payload: RoomPayload) { return payload }
  override async roomRawPayload (id: string): Promise<RoomPayload> {
    log.verbose('PuppetMock', 'roomRawPayload(%s)', id)
    throw new Error('Method not implemented.')
  }

  override async roomList (): Promise<string[]> {
    log.verbose('PuppetMock', 'roomList()')
    throw new Error('Method not implemented.')
  }

  override async roomDel (
    roomId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetMock', 'roomDel(%s, %s)', roomId, contactId)
  }

  override async roomAvatar (roomId: string): Promise<FileBox> {
    log.verbose('PuppetMock', 'roomAvatar(%s)', roomId)

    const payload = await this.roomPayload(roomId)

    if (payload.avatar) {
      return FileBox.fromUrl(payload.avatar)
    }
    log.warn('PuppetMock', 'roomAvatar() avatar not found, use the chatie default.')
    return qrCodeForChatie()
  }

  override async roomAdd (
    roomId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetMock', 'roomAdd(%s, %s)', roomId, contactId)
  }

  override async roomTopic(roomId: string): Promise<string>
  override async roomTopic(roomId: string, topic: string): Promise<void>

  override async roomTopic (
    roomId: string,
    topic?: string,
  ): Promise<void | string> {
    log.verbose('PuppetMock', 'roomTopic(%s, %s)', roomId, topic)

    if (typeof topic === 'undefined') {
      return 'mock room topic'
    }

    await this.dirtyPayload(PayloadType.Room, roomId)
  }

  override async roomCreate (
    contactIdList: string[],
    topic: string,
  ): Promise<string> {
    log.verbose('PuppetMock', 'roomCreate(%s, %s)', contactIdList, topic)

    return 'mock_room_id'
  }

  override async roomQuit (roomId: string): Promise<void> {
    log.verbose('PuppetMock', 'roomQuit(%s)', roomId)
  }

  override async roomQRCode (roomId: string): Promise<string> {
    log.verbose('PuppetMock', 'roomQRCode(%s)', roomId)
    return roomId + ' mock qrcode'
  }

  override async roomMemberList (roomId: string): Promise<string[]> {
    log.verbose('PuppetMock', 'roomMemberList(%s)', roomId)
    return []
  }

  override async roomMemberRawPayload (roomId: string, contactId: string): Promise<RoomMemberPayload> {
    log.verbose('PuppetMock', 'roomMemberRawPayload(%s, %s)', roomId, contactId)
    return {
      avatar: 'mock-avatar-data',
      id: 'xx',
      name: 'mock-name',
      roomAlias: 'yy',
    }
  }

  override async roomMemberRawPayloadParser (rawPayload: RoomMemberPayload): Promise<RoomMemberPayload> {
    log.verbose('PuppetMock', 'roomMemberRawPayloadParser(%s)', rawPayload)
    return rawPayload
  }

  override async roomAnnounce(roomId: string): Promise<string>
  override async roomAnnounce(roomId: string, text: string): Promise<void>

  override async roomAnnounce (roomId: string, text?: string): Promise<void | string> {
    if (text) {
      return
    }
    return 'mock announcement for ' + roomId
  }

  /**
   *
   * Room Invitation
   *
   */
  override async roomInvitationAccept (roomInvitationId: string): Promise<void> {
    log.verbose('PuppetMock', 'roomInvitationAccept(%s)', roomInvitationId)
  }

  override async roomInvitationRawPayload (roomInvitationId: string): Promise<any> {
    log.verbose('PuppetMock', 'roomInvitationRawPayload(%s)', roomInvitationId)
  }

  override async roomInvitationRawPayloadParser (rawPayload: any): Promise<RoomInvitationPayload> {
    log.verbose('PuppetMock', 'roomInvitationRawPayloadParser(%s)', JSON.stringify(rawPayload))
    return rawPayload
  }

  /**
   *
   * Friendship
   *
   */
  override async friendshipRawPayload (id: string): Promise<any> {
    return { id } as any
  }

  override async friendshipRawPayloadParser (rawPayload: any): Promise<FriendshipPayload> {
    return rawPayload
  }

  override async friendshipSearchPhone (
    phone: string,
  ): Promise<null | string> {
    log.verbose('PuppetMock', 'friendshipSearchPhone(%s)', phone)
    return null
  }

  override async friendshipSearchWeixin (
    weixin: string,
  ): Promise<null | string> {
    log.verbose('PuppetMock', 'friendshipSearchWeixin(%s)', weixin)
    return null
  }

  override async friendshipAdd (
    contactId: string,
    hello: string,
  ): Promise<void> {
    log.verbose('PuppetMock', 'friendshipAdd(%s, %s)', contactId, hello)
  }

  override async friendshipAccept (
    friendshipId: string,
  ): Promise<void> {
    log.verbose('PuppetMock', 'friendshipAccept(%s)', friendshipId)
  }

  /**
   *
   * Tag
   *
   */
  override async tagContactAdd (
    tagId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetMock', 'tagContactAdd(%s)', tagId, contactId)
  }

  override async tagContactRemove (
    tagId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetMock', 'tagContactRemove(%s)', tagId, contactId)
  }

  override async tagContactDelete (
    tagId: string,
  ): Promise<void> {
    log.verbose('PuppetMock', 'tagContactDelete(%s)', tagId)
  }

  override async tagContactList (
    contactId?: string,
  ): Promise<string[]> {
    log.verbose('PuppetMock', 'tagContactList(%s)', contactId)
    return []
  }

}

export { PuppetWalnut }
export default PuppetWalnut
