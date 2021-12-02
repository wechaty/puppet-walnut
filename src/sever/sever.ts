import Koa from 'koa'
import { logger } from './logging.js'
import routers from './routers.js'
import { config } from '../config.js'
import koaBody from 'koa-body'
import type PuppetWalnut from '../puppet-walnut'

const app = new Koa()

export async function initSever (puppet: PuppetWalnut) {
  app.use(logger)
  app.use(koaBody())
  app.use(routers)
  app.context['puppet'] = puppet
  app.listen(config.port)
}
