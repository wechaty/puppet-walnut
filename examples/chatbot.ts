import { WechatyBuilder } from 'wechaty'
import { log } from 'wechaty-puppet'
import PuppetWalnut from '../src/puppet-walnut.js'

const bot = WechatyBuilder.build({
  puppet: new PuppetWalnut(),
})  // get a Wechaty instance
  .on('login',            user => log.info(`User ${user} logged in`))
  .on('message',       async message => {
    log.info(`Message: ${message}`)
    console.log(await message.mentionList())
    console.log(message)
  })

await bot.start()

// const msg = await bot.Message.find({ id: 'c878ecfe-566e-103a-9750-ebf5c5e8f821' })
// const contact = await bot.Contact.find({ id: '15751763183' })
// contact.say('hello')
// console.log(msg)
// contact.sync()
