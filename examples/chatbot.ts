import { WechatyBuilder } from 'wechaty'
import { log } from 'wechaty-puppet'
import PuppetWalnut from '../src/puppet-walnut.js'

const bot = WechatyBuilder.build({
  puppet: new PuppetWalnut(),
})  // get a Wechaty instance
  .on('login',            user => log.info(`User ${user} logged in`))
  .on('message',       async message => {
    log.info(`Message: ${message}`)
    // const contact = await bot.Contact.find({ id: '15751763183' })
    // await message.forward(contact)
    console.log(message)
  })

await bot.start()

// const contact = await bot.Contact.find({ id: '15751763183' })
// contact.say('hello')
// console.log(contact)
// contact.sync()
