#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'
import PuppetWalnut from '../puppet-walnut.js'

test('cacheManager test', async t => {
  // await new PuppetWalnut({
  //   appId: '28871d8c83954bc78424ffcbff80285c',
  //   appKey: '3b9cc5506af2466aa82eee4c04f86471',
  //   sipId: '20210401',
  // }).start()
  // const cacheManager = PuppetWalnut.getCacheManager()
  t.pass()
  // const cache1 = CacheManager.Instance
  // const cache2 = CacheManager.Instance
  // t.equal(cache1, cache2)
})
