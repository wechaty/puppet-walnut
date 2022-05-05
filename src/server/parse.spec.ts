#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'
import axios from 'axios'
import PuppetWalnut from '../puppet-walnut.js'
import { initSever } from './server.js'

test('server authorization test', async t => {
  void initSever().then(
    await axios.request({
      data: {},
      headers: {
        echoStr: 'sadfgaegraeqgeafveagfeafrgag',
      },
      method: 'GET',
      // url: 'http://localhost:' + PuppetWalnut.port + '/sms/notifyPath',
      url: 'http://localhost:3000/sms/notifyPath',
    }).then(res => {
      const appid = res.headers['appId']
      const echoStr = res.headers['echoStr']

      t.equal(appid, PuppetWalnut.appId)
      t.equal(echoStr, 'sadfgaegraeqgeafveagfeafrgag')
      return null
    }),
  )
  // const appid: string = ''
  // const echoStr: string = ''

})
