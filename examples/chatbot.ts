import { WechatyBuilder } from "wechaty"
import { log } from 'wechaty-puppet'
import PuppetWalnut from '../src/puppet-walnut.js'
import * as PUPPET from 'wechaty-puppet';
import { FileBox } from 'file-box';
// import { FileBox } from 'file-box'
const bot = WechatyBuilder.build({
  puppet: new PuppetWalnut(),
})  // get a Wechaty instance
  .on('login',            (user: any) => log.info(`User ${user} logged in`))
  .on('message',       async (message: { toContact: () => void }) => {
    log.info(`Message: ${message}`)
    console.log(message)
  })

await bot.start()

const contact = await bot.Contact.find({ id: '15751763183' })

// const post = await bot.Post.builder()
//   .add('This is a single rich card.')
//   .add('This is the description of the rich card. It\'s the first field that will be truncated if it exceeds the maximum width or height of a card.')
//   .add(FileBox.fromFile('C:\\Users\\fabian\\Desktop\\1.png'))
//   .type(PUPPET.types.Post.Unspecified)
//   .build()
//
// await contact.say(post)

// contact.say(new LocationInterface('payload'))
// const location = {
//   accuracy  : 11,
//   address   : '北京市北京市海淀区45 Chengfu Rd',
//   latitude  : 39.995120999999997,
//   longitude : 116.334154,
//   name      : '东升乡人民政府(海淀区成府路45号)',
// }
await contact.say('This is a simple text message.')
// contact.say(FileBox.fromUrl('https://fabian.oss-cn-hangzhou.aliyuncs.com/img/mmexport1630917534919.jpg'))
// console.log(msg)
// contact.sync()
// const message = await bot.Message.find({ id: '8dcf7a26-5760-103a-b02f-f7e6c49198e7' })
// console.log(message.age())
// console.log(message.date())
