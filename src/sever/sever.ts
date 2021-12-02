import Koa from 'koa'
import { logger } from './logging.ts'
import routers from './routers.ts'
import { config } from '../config.ts'
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
