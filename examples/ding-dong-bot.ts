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
import { log } from 'wechaty-puppet'
import { local } from '../local.js'
import type * as PUPPET from 'wechaty-puppet'
import PuppetWalnut from '../src/puppet-walnut.js'

/**
 *
 * 1. Declare your Bot!
 *
 */
const puppet = new PuppetWalnut({
  appId: local.appId,
  appKey: local.appKey,
  sipId: local.sipId,
})
log.level('silly')

/**
 *
 * 2. Register event handlers for Bot
 *
 */
puppet
  .on('login', onLogin)
  .on('message', onMessage)

/**
 *
 * 3. Start the bot!
 *
 */
puppet.start()
  .catch(async (e: any) => {
    log.error('Bot start() fail:', e)
    await puppet.stop()
    process.exit(-1)
  })

/**
 *
 * 4. You are all set. ;-]
 *
 */

/**
 *
 * 5. Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */

async function onLogin (payload: PUPPET.payloads.EventLogin) {
  log.info('bot login: ' + payload.contactId)
}

/**
 *
 * 6. The most important handler is for:
 *    dealing with Messages.
 *
 */
async function onMessage (payload: PUPPET.payloads.EventMessage) {
  const msgPayload = await puppet.messagePayload(payload.messageId)
  log.info(`receive message: ${msgPayload.text}`)
  if (msgPayload.text === 'ding') {
    void await puppet.messageSendText(msgPayload.fromId!, 'dong')
  }
}

/**
 *
 * 7. Output the Welcome Message
 *
 */
const welcome = `
Puppet Version: ${puppet.version()}

Please wait... I'm trying to login in...

`
console.info(welcome)
