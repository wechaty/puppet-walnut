import {WechatyBuilder} from 'wechaty'
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
    // const file = await message.toImage()
    // console.log(file)
    // console.log(await file.thumbnail())
    // console.log(await file.artwork())
  })

await bot.start()

const contact = await bot.Contact.find({ id: '15751763183' })
// contact.say(new LocationInterface('payload'))
// const location = {
//   accuracy  : 11,
//   address   : '北京市北京市海淀区45 Chengfu Rd',
//   latitude  : 39.995120999999997,
//   longitude : 116.334154,
//   name      : '东升乡人民政府(海淀区成府路45号)',
// }
// await contact.say('aaa')
contact.say(FileBox.fromUrl('https://fabian.oss-cn-hangzhou.aliyuncs.com/img/mmexport1630917534919.jpg'))
// console.log(msg)
// contact.sync()
// const message = await bot.Message.find({ id: '8dcf7a26-5760-103a-b02f-f7e6c49198e7' })
// console.log(message.age())
// console.log(message.date())
