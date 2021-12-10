import axios from 'axios'
import { API } from './Api.js'
import { log }  from 'wechaty-puppet'
import PuppetWalnut from '../puppet-walnut.js'

const headers = {
  authorization: 'accessToken ',
  'Content-Type': 'application/json',
}

export function updateToken () {
  void axios.request({
    url: PuppetWalnut.baseUrl + API.accessToken,
    method: 'POST',
    headers: headers,
    data: {
      appId: PuppetWalnut.appId,
      appKey: PuppetWalnut.appKey,
    },
  }).then(res => {
    headers.authorization = headers.authorization + res.data.accessToken
    log.info('update-token', `${headers['authorization']}`)
    return null
  })
  // 定时两小时
  setTimeout(updateToken, 2 * 60 * 60 * 1000)
}

export function get (url: string, params = {}) {
  return axios.request({
    url: PuppetWalnut.baseUrl + url,
    method: 'GET',
    headers: headers,
    data: {
      ...params,
    },
  })
}

export function post (url: string, params = {}) {
  return axios.request({
    url: PuppetWalnut.baseUrl + url,
    method: 'POST',
    headers: headers,
    data: {
      ...params,
    },
  })
}

axios.interceptors.response.use(
  function (response) {
    return response
  }, function (error) {
    log.info(error)
    return Promise.reject(error)
  },
)
