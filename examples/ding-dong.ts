import {log} from "wechaty-puppet";
import {local} from "../local";
import {Message, WechatyBuilder} from "wechaty";
import PuppetWalnut from "../src/puppet-walnut";

/**
 *
 * 1. Declare your Bot!
 *
 */
const puppet = new PuppetWalnut({
    sipId: local.sipId,
    appId: local.appId,
    appKey: local.appKey
})
const bot = WechatyBuilder.build({
    name: 'myBot',
    puppet: puppet
})
log.level('verbose')

/**
 *
 * 2. Register event handlers for Bot
 *
 */
bot
    .on('message', onMessage)


/**
 *
 * 3. Start the bot!
 *
 */
bot.start()

/**
 *
 * 4. Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */

/**
 *
 * 5. The most important handler is for:
 *    dealing with Messages.
 *
 */
async function onMessage (msg: Message) {
    console.log(`receive message: ${msg.text()}`)
    if(msg.text() === 'ding'){
        await msg.talker().say("dong")
    }
}

/**
 *
 * 7. Output the Welcome Message
 *
 */
const welcome = `

Please wait... I'm trying to login in...

`
console.info(welcome)
