#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test } from 'tstest'

import PuppetWalnut from './puppet-walnut.js'
import { local } from '../local.js'

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

test.skip('PuppetWalnut perfect restart testing', async t => {
  const puppet = new PuppetWalnut({
    appId: local.appId,
    appKey: local.appKey,
    sipId: local.sipId,
  })
  for (let n = 0; n < 3; n++) {
    await puppet.start()
    await puppet.stop()
    t.pass('perfect restart succeed at #' + n)
  }
})
