#!/usr/bin/env -S node

import test  from 'tstest'

import { PuppetWalnut } from './puppet-walnut'

/**
 *   zrn-fight - https://github.com/zrn-fight
 *
 *   2021.10.14
 *
 *   This test can pass CI.
 *   The job running on runner Hosted Agent will exceede the maximum execution time of 360 minutes.
 *
 *   issue:https://github.com/wechaty/wechaty-puppet-walnut/issues/9
 *
 */

test.skip('PuppetWalnut perfect restart testing', async (t) => {
  const puppet = new PuppetWalnut({ sms: '12345' })
  await puppet.start()
  await puppet.stop()
  t.pass('perfect restart succeed at #')
})
