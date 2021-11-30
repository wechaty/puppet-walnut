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
import * as PUPPET  from 'wechaty-puppet'
import { log }  from 'wechaty-puppet'
import { initSever } from './sever/sever'
import { config, VERSION } from './config'
import { updateToken } from './help/request'
import { messageParse } from './help/prase'
import type { message } from './help/struct'
import { send } from './help/message'

export type PuppetWalnutOptions = PUPPET.PuppetOptions & {
  sipId: string,
  appId: string,
  appKey: string,
}

class PuppetWalnut extends PUPPET.Puppet {

  static override readonly VERSION = VERSION

  cacheMessagePayload : Map<string, PUPPET.payload.Message>
  cacheContactPayload : Map<string, PUPPET.payload.Contact>

  constructor (options: PuppetWalnutOptions) {
    super()
    config.sipId = options.sipId
    config.appId = options.appId
    config.appKey = options.appKey
    config.chatbotId = `sip:${config.sipId}@botplatform.rcs.chinaunicom.cn`
    config.base = `http://${config.serverRoot}/bot/${config.apiVersion}/${config.chatbotId}`
    this.cacheMessagePayload = new Map()
    this.cacheContactPayload = new Map()
    log.verbose('PuppetWalnut', 'constructor("%s")', JSON.stringify(options))
  }

  onStart (): Promise<void> {

    void initSever(this).then(() => {
      log.info('PuppetWalnut-Sever', `Server running on port ${config.port}`)
      return null
    })

    updateToken()

    this.login(config.chatbotId)

    return Promise.resolve(undefined)
  }

  onStop (): Promise<void> {
    return Promise.resolve(undefined)
  }

  /**
   *
   * Message
   *
   */
  override async messageRawPayloadParser (payload: PUPPET.payload.Message) {
    return payload
  }

  override async messageRawPayload (id: string): Promise<PUPPET.payload.Message> {
    log.verbose('PuppetWalnut', 'messageRawPayload(%s)', id)
    return this.cacheMessagePayload.get(id)!
  }

  override async messageSendText (to: string, msg: string) {
    send(to, msg)
    log.info(`send message to ${to}: `, msg)
  }

  onMessage (message: message) {
    const msg: PUPPET.payload.Message = messageParse(message)
    this.cacheMessagePayload.set(message.messageId, msg)
    this.emit('message', { messageId: message.messageId })
  }

  /**
   *
   * Contact
   *
   */
  override async contactRawPayloadParser (payload: PUPPET.payload.Contact) { return payload }
  override async contactRawPayload (id: string): Promise<PUPPET.payload.Contact> {
    log.verbose('PuppetWalnut', 'contactRawPayload(%s)', id)
    return this.cacheContactPayload.get(id)!
  }

}

export default PuppetWalnut
