#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'
import { config } from './config.js'

test('config check', async t => {
  t.ok(config.port, 'port should exist')
  t.ok(config.apiVersion, 'apiVersion should exist')
  t.ok(config.serverRoot, 'serverRoot should exist')
})
