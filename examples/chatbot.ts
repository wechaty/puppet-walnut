import { Message, WechatyBuilder } from 'wechaty'
import * as PUPPET from 'wechaty-puppet'
import PuppetWalnut from '../src/puppet-walnut.js'
import { FileBox } from 'file-box'
import { log } from 'wechaty-puppet'

const bot = WechatyBuilder.build({
  puppet: new PuppetWalnut(),
})  // get a Wechaty instance
  .on('login', (user: any) => log.info(`User ${user} logged in`))
  .on('message', async (message: Message) => {
    log.info(`Message: ${message}`)
  })

await bot.start()

const contact = await bot.Contact.find({ id: '15751763183' })

// contact.say('hi')

// contact.say(FileBox.fromFile('C:\\Users\\fabian\\Desktop\\1.png'))

const post = await bot.Post.builder()
  .add('This is a single rich card.')
  .add('This is the description of the rich card. It\'s the first field that will be truncated if it exceeds the maximum width or height of a card.')
  .add(FileBox.fromFile('C:\\Users\\fabian\\Desktop\\1.png'))
  .type(PUPPET.types.Post.Unspecified)
  .build()

await contact.say(post)
