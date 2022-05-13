import Koa from 'koa'
import { logger } from './logging.js'
import koaBody from 'koa-body'
import { log } from '../config.js'
import type { Server } from 'http'
import initRouter from './routers.js'
import type Router from 'koa-router'

const app = new Koa()
let server: Server

export async function initServer (port: number, prefix: string) {
  app.use(logger)
  app.use(koaBody())

  const router: Router = initRouter(prefix)
  app.use(router.routes())

  server = app.listen(port)
  log.info('PuppetWalnut-Sever', `listen on port: ${port}`)
}

export async function closeServer () {
  server.close()
}
