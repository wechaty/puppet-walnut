#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'
import { checkPhoneNumber } from './utils.js'

test('phone check test', async t => {
  t.throws(() => checkPhoneNumber('23r543242'))
  t.throws(() => checkPhoneNumber(''))
  t.throws(() => checkPhoneNumber('132222423423'))
  t.throws(() => checkPhoneNumber('32543gveq'))
})
