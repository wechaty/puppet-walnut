#!/usr/bin/env ts-node

import { test }  from 'tstest'

import {
  Wechaty,
}                from 'wechaty'

import {
  PuppetWalnut,
}                         from '../src/mod'

test('integration testing', async t => {
  const puppet = new PuppetWalnut({  })
  const wechaty = new Wechaty({ puppet })

  t.ok(wechaty, 'should instantiate wechaty with puppet mocker')
})