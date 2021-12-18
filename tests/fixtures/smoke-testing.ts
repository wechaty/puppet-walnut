#!/usr/bin/env ts-node

import {
  PuppetWalnut,
  VERSION,
}                 from 'wechaty-puppet-walnut'


async function main () {
  const puppet = new PuppetWalnut({
    sipId: '20210401',
    appId: '28871d8c83954bc78424ffcbff80285c',
    appKey: '3b9cc5506af2466aa82eee4c04f86471',
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
