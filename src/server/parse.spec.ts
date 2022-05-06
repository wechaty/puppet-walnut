#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'
import axios from 'axios'
import { initSever } from './server.js'

test('server authorization test', async t => {
  t.setTimeout(400000)
  await initSever(3000)
  await axios.request({
    data: {},
    headers: {
      echoStr: 'sadfgaegraeqgeafveagfeafrgag',
    },
    method: 'GET',
    url: 'http://localhost:3000/sms/notifyPath',
  }).then(res => {
    const echoStr = res.headers['echostr']
    t.equal(echoStr, 'sadfgaegraeqgeafveagfeafrgag')
    return null
  })
})
