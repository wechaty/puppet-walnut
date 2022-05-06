import Koa from 'koa'
import { logger } from './logging.js'
import routers from './routers.js'
import koaBody from 'koa-body'
import { log } from '../config.js'
import type { Server } from 'http'

const app = new Koa()
let server: Server

export async function initServer (port: number) {
  app.use(logger)
  app.use(koaBody())
  app.use(routers)
  server = app.listen(port)
  log.info('PuppetWalnut-Sever', `listen on port: ${port}`)
}

export async function closeServer () {
  server.close()
}
