import PuppetWalnut from '../puppet-walnut.js'

const reg: RegExp = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/

export function checkPhoneNumber (phone: string): void {
  if (!reg.exec(phone) && phone !== PuppetWalnut.chatbotId) {
    throw new Error(`invalid contactId: ${phone}`)
  }
}
