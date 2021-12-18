import type Koa from 'koa'
import { log }  from 'wechaty-puppet'

interface LogData {
    method: string;
    url: string;
    query: string;
    remoteAddress: string;
    host: string;
    userAgent: string;
    statusCode: number;
    errorMessage: string;
    errorStack: string;
    data: any;
    responseTime: number;
}

function outputLog (data: Partial<LogData>, thrownError: any) {
  log.verbose('PuppetWalnut-Sever', `${data.statusCode} ${data.method} ${data.url} - ${data.responseTime}ms`)
  if (thrownError) {
    log.error(thrownError)
  }
}

export async function logger (ctx: Koa.Context, next: () => Promise<any>) {

  const start = new Date().getMilliseconds()

  const logData: Partial<LogData> = {
    host: ctx.headers['host'],
    method: ctx.method,
    query: ctx.querystring,
    remoteAddress: ctx.request.ip,
    url: ctx.url,
    userAgent: ctx.headers['user-agent'],
  }

  let errorThrown: any = null
  try {
    await next()
    logData.statusCode = ctx.status
  } catch (e: any) {
    errorThrown = e
    logData.errorMessage = e.message
    logData.errorStack = e.stack
    logData.statusCode = e.status || 500
    if (e.data) {
      logData.data = e.data
    }
  }

  logData.responseTime = new Date().getMilliseconds() - start
  outputLog(logData, errorThrown)

  if (errorThrown) {
    throw errorThrown
  }
}
