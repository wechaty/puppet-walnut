import type Koa from "koa";
import * as PUPPET  from 'wechaty-puppet';

interface ILogData {
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

function outputLog(data: Partial<ILogData>, thrownError: any) {
    PUPPET.log.verbose(`Puppet5g-Sever`, `${data.statusCode} ${data.method} ${data.url} - ${data.responseTime}ms`);
    if (thrownError) {
        console.error(thrownError);
    }
}

export async function logger(ctx: Koa.Context, next: () => Promise<any>) {

    const start = new Date().getMilliseconds();

    const logData: Partial<ILogData> = {
        method: ctx.method,
        url: ctx.url,
        query: ctx.querystring,
        remoteAddress: ctx.request.ip,
        host: ctx.headers['host'],
        userAgent: ctx.headers['user-agent'],
    };

    let errorThrown: any = null;
    try {
        await next();
        logData.statusCode = ctx.status;
    }
    catch (e: any) {
        errorThrown = e;
        logData.errorMessage = e.message;
        logData.errorStack = e.stack;
        logData.statusCode = e.status || 500;
        if (e.data) {
            logData.data = e.data;
        }
    }

    logData.responseTime = new Date().getMilliseconds() - start;
    outputLog(logData, errorThrown);

    if (errorThrown) {
        throw errorThrown;
    }
}
