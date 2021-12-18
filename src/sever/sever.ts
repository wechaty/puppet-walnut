import Koa from 'koa'
import { logger } from './logging.js'
import routers from './routers.js'
import koaBody from 'koa-body'
import PuppetWalnut from '../puppet-walnut.js'

const app = new Koa()

export async function initSever () {
  app.use(logger)
  app.use(koaBody())
  app.use(routers)
  app.listen(PuppetWalnut.port)
}
