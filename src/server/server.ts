import Koa from 'koa'
import { logger } from './logging.js'
import routers from './routers.js'
import koaBody from 'koa-body'
import { log } from '../config.js'

const app = new Koa()

export async function initSever (port: number) {
  app.use(logger)
  app.use(koaBody())
  app.use(routers)
  app.listen(port)
  log.info('PuppetWalnut-Sever', `listen on port: ${port}`)
}
