import { WechatyBuilder } from 'wechaty'
import { log } from 'wechaty-puppet'
import PuppetWalnut from '../src/puppet-walnut.js'
import { FileBox } from 'file-box'

const bot = WechatyBuilder.build({
  puppet: new PuppetWalnut(),
})  // get a Wechaty instance
  .on('login',            user => log.info(`User ${user} logged in`))
  .on('message',       async message => {
    log.info(`Message: ${message}`)
    // console.log(message)
  })

await bot.start()

const contact = await bot.Contact.find({ id: '15751763183' })
contact.say(FileBox.fromFile('C:\\Users\\fabian\\Desktop\\avatar.jpg'))
// console.log(msg)
// contact.sync()
