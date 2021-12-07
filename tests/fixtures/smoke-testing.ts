#!/usr/bin/env ts-node

import {
  PuppetWalnut,
  VERSION,
}                 from 'wechaty-puppet-walnut'
import {local} from '../../local.js';

async function main () {
  const puppet = new PuppetWalnut({
    appId: local.appId,
    appKey: local.appKey,
    sipId: local.sipId,
  })

  if (VERSION === '0.0.0') {
    throw new Error('version should not be 0.0.0 when prepare for publishing')
  }

  console.info(`Puppet v${puppet.version()} smoke testing passed.`)
  return 0
}

main()
  .then(process.exit)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
