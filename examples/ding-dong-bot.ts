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
import { local } from '../local'
import { ContactSelf, Message, WechatyBuilder } from 'wechaty'
import PuppetWalnut from '../src/puppet-walnut'

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
const bot = WechatyBuilder.build({
  name: 'myBot',
  puppet: puppet,
})
log.level('info')

/**
 *
 * 2. Register event handlers for Bot
 *
 */
bot
  .on('login', onLogin)
  .on('message', onMessage)

/**
 *
 * 3. Start the bot!
 *
 */
bot.start()
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

async function onLogin (user: ContactSelf) {
  log.info('bot login: ' + user.id)
}

/**
 *
 * 6. The most important handler is for:
 *    dealing with Messages.
 *
 */
async function onMessage (msg: Message) {
  log.info(`receive message: ${msg.text()}`)
  if (msg.text() === 'ding') {
    await msg.talker().say('dong')
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
