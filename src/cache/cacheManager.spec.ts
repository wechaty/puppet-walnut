#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'
import CacheManager from './cacheManager.js'

test('cacheManager test', async t => {
  await CacheManager.init()
  t.pass()
  // const cache1 = CacheManager.Instance
  // const cache2 = CacheManager.Instance
  // t.equal(cache1, cache2)
})
