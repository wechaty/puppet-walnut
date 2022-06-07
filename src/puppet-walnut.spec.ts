#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import { test } from 'tstest'

import PuppetWalnut from './puppet-walnut.js'
import * as PUPPET from 'wechaty-puppet'
import type { WalnutMessagePayload } from './help/struct.js'

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
  const puppet = new PuppetWalnut()
  for (let n = 0; n < 3; n++) {
    await puppet.start()
    await puppet.stop()
    t.pass('perfect restart succeed at #' + n)
  }
})

const puppet = new PuppetWalnut({
  sipId: '20210401',
  appId: '28871d8c83954bc78424ffcbff80285c',
  appKey: '3b9cc5506af2466aa82eee4c04f86471',
})

test('message parser for text message', async t => {
  const walnutMessagePayload = {
    messageId: '4BF4F950-A0B6-4CC3-86B4-5A9580399BCA',
    messageList: [
      {
        contentType: 'text/plain',
        contentText: 'hello world',
        contentEncoding: 'utf8',
      },
    ],
    messageFileSize: 0,
    messageItem: 'text',
    dateTime: '2020-01-17T14:42:20.840+08:00',
    destinationAddress: 'sip:106500@botplatform.rcs.domain.cn',
    senderAddress: 'tel:+8617928222350',
    conversationId: 'XSFDSFDFSAFDSAS^%',
    contributionId: 'SFF$#REGFY7&^%THT',
  }
  const messagePayload = await puppet.messageRawPayloadParser(walnutMessagePayload as WalnutMessagePayload)
  t.ok(
    messagePayload.listenerId === 'sip:106500@botplatform.rcs.domain.cn'
    && messagePayload.roomId === undefined
    && messagePayload.talkerId === '17928222350'
    && messagePayload.text === 'hello world'
    && messagePayload.type === PUPPET.types.Message.Text,
  )
})

test('message parser for image message', async t => {
  const walnutMessagePayload = {
    messageId: '4BF4F950-A0B6-4CC3-86B4-5A9580399BCA',
    messageList: [
      {
        contentType: 'application/vnd.gsma.rcs-ft-http',
        contentText: [{
          type: 'thumbnail',
          fileSize: '7427',
          fileName: 'DSC_379395051.JPG',
          contentType: 'image/jpg',
          url: 'http://xxxxx74f0. jpg',
          until: '2019-04-25T12:17:07Z',
        }, {
          type: 'file',
          fileSize: '183524',
          fileName: 'DSC_379395051.JPG',
          contentType: 'image/jpg',
          url: 'http://xxxxxx6c5274f0. jpg',
          until: '2019-04-25T12:17:07Z',
        }],
        contentEncoding: 'utf8',
      },
    ],
    messageFileSize: 0,
    messageItem: 'image',
    dateTime: '2020-01-17T14:42:20.840+08:00',
    destinationAddress: 'sip:106500@botplatform.rcs.domain.cn',
    senderAddress: 'tel:+8617928222350',
    conversationId: 'XSFDSFDFSAFDSAS^%',
    contributionId: 'SFF$#REGFY7&^%THT',
  }
  const messagePayload = await puppet.messageRawPayloadParser(walnutMessagePayload as WalnutMessagePayload)
  t.ok(
    messagePayload.listenerId === 'sip:106500@botplatform.rcs.domain.cn'
    && messagePayload.roomId === undefined
    && messagePayload.talkerId === '17928222350'
    && messagePayload.text === 'image'
    && messagePayload.type === PUPPET.types.Message.Image,
  )
})

test('message parser for file message', async t => {
  const walnutMessagePayload = {
    messageId: '4BF4F950-A0B6-4CC3-86B4-5A9580399BCA',
    messageList: [
      {
        contentType: 'application/vnd.gsma.rcs-ft-http',
        contentText: [{
          type: 'thumbnail',
          fileSize: '7427',
          fileName: 'DSC_379395051.JPG',
          contentType: 'image/jpg',
          url: 'http://xxxxx74f0. jpg',
          until: '2019-04-25T12:17:07Z',
        }, {
          type: 'file',
          fileSize: '183524',
          fileName: 'DSC_379395051.JPG',
          contentType: 'image/jpg',
          url: 'http://xxxxxx6c5274f0. jpg',
          until: '2019-04-25T12:17:07Z',
        }],
        contentEncoding: 'utf8',
      },
    ],
    messageFileSize: 0,
    messageItem: 'other',
    dateTime: '2020-01-17T14:42:20.840+08:00',
    destinationAddress: 'sip:106500@botplatform.rcs.domain.cn',
    senderAddress: 'tel:+8617928222350',
    conversationId: 'XSFDSFDFSAFDSAS^%',
    contributionId: 'SFF$#REGFY7&^%THT',
  }
  const messagePayload = await puppet.messageRawPayloadParser(walnutMessagePayload as WalnutMessagePayload)
  t.ok(
    messagePayload.listenerId === 'sip:106500@botplatform.rcs.domain.cn'
    && messagePayload.roomId === undefined
    && messagePayload.talkerId === '17928222350'
    && messagePayload.text === 'file'
    && messagePayload.type === PUPPET.types.Message.Attachment,
  )
})
