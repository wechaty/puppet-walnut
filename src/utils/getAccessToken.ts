import { log } from 'wechaty-puppet'

const rp = require('request-promise')
const APPID = '28871d8c83954bc78424ffcbff80285c'
const APPKEY = '3b9cc5506af2466aa82eee4c04f86471'
const url = 'maap.5g-msg.com:30001'
const sipID = '20210401'
const URL = `http://${url}/bot/v1/sip:${sipID}@botplatform.rcs.chinaunicom.cn/accessToken`
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')

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

setInterval(async () => {
  await updateAccessToken()
}, (7200 - 300) * 1000)

// updateAccessToken()
// console.log(getAccessToken())
module.exports = getAccessToken
