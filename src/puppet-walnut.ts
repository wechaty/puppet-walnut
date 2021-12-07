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
import * as PUPPET from 'wechaty-puppet'
import { log } from 'wechaty-puppet'
import type { FileBoxInterface } from 'file-box'
import { FileBox } from 'file-box'
import { initSever } from './sever/sever.js'
import { config, VERSION } from './config.js'
import { updateToken } from './help/request.js'
import type { WalnutMessagePayload } from './help/struct.js'
import { send } from './help/message.js'
import * as path from 'path'
import CacheManager from './cache/cacheManager.js'

export type PuppetWalnutOptions = PUPPET.PuppetOptions & {
  sipId: string,
  appId: string,
  appKey: string,
}

class PuppetWalnut extends PUPPET.Puppet {

  static override readonly VERSION = VERSION
  public cacheManager?: CacheManager

  constructor (options: PuppetWalnutOptions) {
    super()
    config.sipId = options.sipId
    config.appId = options.appId
    config.appKey = options.appKey
    config.chatbotId = `sip:${config.sipId}@botplatform.rcs.chinaunicom.cn`
    config.base = `http://${config.serverRoot}/bot/${config.apiVersion}/${config.chatbotId}`
    log.verbose('PuppetWalnut', 'constructor("%s")', JSON.stringify(options))

    void initSever(this).then(() => {
      log.info('PuppetWalnut-Sever', `Server running on port ${config.port}`)
      return null
    })

    void CacheManager.init(config.sipId).then(() => {
      this.cacheManager = CacheManager.Instance
      return null
    })
  }

  override async onStart (): Promise<void> {

    updateToken()

    this.login(config.chatbotId)

    return Promise.resolve(undefined)
  }

  override async onStop (): Promise<void> {
    log.verbose('PuppetWalnut', 'onStop()')
    if (this.isLoggedIn) {
      await this.logout()
    }

    // this.stopperFnList.forEach(setImmediate)
    // this.stopperFnList.length = 0
    //
    // // await some tasks...
    // this.server.close()
    return Promise.resolve(undefined)
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
    if (file) {
      return
    }
    const WECHATY_ICON_PNG = path.resolve('../../docs/images/wechaty-icon.png')
    return FileBox.fromFile(WECHATY_ICON_PNG)
  }

  override async contactRawPayloadParser (payload: PUPPET.payloads.Contact) { return payload }
  override async contactRawPayload (contactId: string): Promise<WalnutMessagePayload | undefined> {
    log.verbose('PuppetWalnut', 'contactRawPayload(%s)', contactId)
    return this.cacheManager?.getContact(contactId)
  }

  /**
   *
   * Message
   *
   */
  override async messageRawPayloadParser (rawPayload: WalnutMessagePayload): Promise<PUPPET.payloads.Message> {
    return {
      id: rawPayload.messageId,
      timestamp: Date.parse(new Date().toString()),
      type: PUPPET.types.Message.Text,
      text: rawPayload.messageList[0]!.contentText,
      fromId: rawPayload.senderAddress.replace('tel:+86', ''),
      toId: rawPayload.destinationAddress,
    }
  }

  override async messageRawPayload (messageId: string): Promise<WalnutMessagePayload | undefined> {
    log.verbose('PuppetWalnut', 'messageRawPayload(%s)', messageId)
    return this.cacheManager?.getMessage(messageId)
  }

  override async messageSendText (to: string, msg: string): Promise<void> {
    log.verbose('PuppetWalnut', 'messageSend(%s, %s)', to, msg)
    send(to, msg)
  }

}

export default PuppetWalnut
