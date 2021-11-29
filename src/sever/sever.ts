import Koa from 'koa'
import { logger } from './logging'
import routers from './routers'
import { config } from '../config'
import koaBody from 'koa-body'
import PuppetWalnut from '../puppet-walnut'

const app = new Koa()

export async function initSever (puppet: PuppetWalnut) {
  app.use(logger)
  app.use(koaBody())
  app.use(routers)
  app.context['puppet'] = puppet
  app.listen(config.port)
}
