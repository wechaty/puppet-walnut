import fs from 'fs'
import path from 'path'
import rp from 'request-promise'
import { log } from 'wechaty-puppet'
const APPID = process.env['WECHATY_PUPPET_WALNUT_APPID'] !
const APPKEY = process.env['WECHATY_PUPPET_WALNUT_APPKEY'] !

const url = 'maap.5g-msg.com:30001'
const sipID = '20210401'
const URL = `http://${url}/bot/v1/sip:${sipID}@botplatform.rcs.chinaunicom.cn/accessToken`
const fileName = path.resolve(__dirname, './access-token.json')

const updateAccessToken = async () => {
  const options = {
    method: 'POST',
    uri: URL,
    // eslint-disable-next-line sort-keys
    body: {
      appId:APPID,
      appKey:APPKEY,
    },
    headers: {
      'content-type': 'application/json',
    },
    json: true,
  }
  await rp(options)
    .then((body: any) => {
      // eslint-disable-next-line promise/always-return
      if (body.accessToken) {
        fs.writeFileSync(fileName, JSON.stringify({
          accessToken: body.accessToken,
          createTime: new Date(),
        }))
      } else {
        void updateAccessToken()
      }
    })
    .catch((err:any) => {
      log.verbose(err)
      // console.log(err)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      updateAccessToken()
    })
}

const getAccessToken = async () => {
  // 读取文件
  try {
    const readRes = fs.readFileSync(fileName, 'utf8')
    const readObj = JSON.parse(readRes)
    const createTime = new Date(readObj.createTime).getTime()
    const nowTime = new Date().getTime()
    if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
      await updateAccessToken()
      await getAccessToken()
    }
    return readObj.accessToken

  } catch (error) {
    await updateAccessToken()
    await getAccessToken()
  }
}

const timer = setInterval(async () => {
  await updateAccessToken()
}, (7200 - 300) * 1000)

export {
  getAccessToken,
  timer,
}
