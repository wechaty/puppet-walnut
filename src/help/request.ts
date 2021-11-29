import axios from 'axios'
import { api } from './Api'
import { log }  from 'wechaty-puppet'
import { config } from '../config'

const headers = {
  authorization: 'accessToken ',
  'Content-Type': 'application/json',
}

export function updateToken () {
  void axios.request({
    url: config.base + api.accessToken,
    method: 'POST',
    headers: headers,
    data: {
      appId: config.appId,
      appKey: config.appKey,
    },
  }).then(res => {
    headers.authorization = headers.authorization + res.data.accessToken
    log.info('update-token', `${headers['authorization']}`)
    return null
  })
  // 定时两小时
  setTimeout(updateToken, 2 * 60 * 60 * 60 * 60)
}

export function get (params: {}, url: string) {
  return axios.request({
    url: config.base + url,
    method: 'GET',
    headers: headers,
    data: {
      ...params,
    },
  })
}

export function post (url: string, params: {}) {
  return axios.request({
    url: config.base + url,
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
  }
)
