import axios from 'axios'
import { Api } from './api.js'
import { log }  from 'wechaty-puppet'
import PuppetWalnut from '../puppet-walnut.js'
import type { FileBoxInterface } from 'file-box'
import FormData from 'form-data'

const headers = {
  'Content-Type': 'application/json',
  authorization: 'accessToken',
}

export async function updateToken () {
  await axios.request({
    data: {
      appId: PuppetWalnut.appId,
      appKey: PuppetWalnut.appKey,
    },
    headers: headers,
    method: 'POST',
    url: PuppetWalnut.baseUrl + Api.accessToken,
  }).then(res => {
    headers.authorization = headers.authorization + ' ' + res.data.accessToken
    log.info('update-token', `${headers['authorization']}`)
    return null
  })
  // 定时两小时
  // setTimeout(updateToken, 2 * 60 * 60 * 1000)
}

export async function uploadFile (temp: boolean, file: FileBoxInterface) {
  const data = new FormData()
  data.append('img', await file.toStream())
  return  axios.request({
    data,
    headers: {
      authorization: headers.authorization,
      uploadMode: temp ? 'temp' : 'perm',
      ...data.getHeaders(),
    },
    method: 'POST',
    url: PuppetWalnut.baseUrl + Api.uploadFile,
  })
}

export function get (url: string, data = {}) {
  return axios.request({
    data,
    headers: headers,
    method: 'GET',
    url: PuppetWalnut.baseUrl + url,
  })
}

export function post (url: string, data = {}) {
  return axios.request({
    data,
    headers: headers,
    method: 'POST',
    url: PuppetWalnut.baseUrl + url,
  })
}

axios.interceptors.request.use(
  function (config) {
    log.silly('PuppetWalnut-Axios',
      `Params: ${JSON.stringify(config.data)}, Url: ${config.url}`)
    return config
  },
)

axios.interceptors.response.use(
  function (response) {
    log.silly('PuppetWalnut-Axios',
      `Response: ${JSON.stringify(response.data)}`)
    // if (response.data.errorCode !== 0) {
    //   log.error('PuppetWalnut-Axios', JSON.stringify(response.data))
    // }
    return response
  }, function (error) {
    log.info(error)
    return Promise.reject(error)
  },
)
