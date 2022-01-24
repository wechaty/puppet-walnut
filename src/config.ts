import { log } from 'wechaty-puppet'

const config = {
  // The version of the API you are using
  apiVersion: 'v1',
  // Contact's default avatar url
  avatarUrl: 'https://raw.githubusercontent.com/wechaty/puppet-walnut/main/docs/images/avatar.webp',
  // The port for the sever to receive message
  port: 3000,
  // The server's root url
  serverRoot: 'maap.5g-msg.com:30001',
}

enum contentEncoding {
  utf8 = 'utf8'
}

export {
  contentEncoding,
  config,
  log,
}

export { VERSION } from './version.js'
