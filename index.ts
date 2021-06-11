/**
 * Created by Cooper on 2021/06/11.
 */
import compose from 'koa-compose';
import Koa, { Context } from 'koa';
import net, { Socket } from 'net';

const respond = require('./respond');

type Options = {
  env?: string;
  keys?: string[];
  proxy?: boolean;
  subdomainOffset?: number;
  proxyIpHeader?: string;
  maxIpsCount?: number;
};

class Application extends Koa {
  service: any;

  constructor(options: Options & { service: any }) {
    super(options);
    this.service = options.service;
  }

  // @ts-ignore
  createContext(socket: Socket, method: any) {
    const context = {
      path: '/' + method,
      originalUrl: '/' + method,
    } as Context;
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this as any;
    context.req = request.req = response.req = { socket: socket } as any;
    context.res = request.res = response.res = { socket: socket } as any;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    // context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  // @ts-ignore
  callback() {
    const fn = compose(this.middleware);
    if (!this.listenerCount('error')) this.on('error', this.onerror);

    return (socket: Socket) => {
      const processor = new this.service.Processor(
        new Proxy(this.service.Client, {
          get: (target: any, method: string) => {
            return this.handleRequest(socket, fn)(method);
          },
        })
      );
      return respond.call(this, socket, processor);
    };
  }

  handleRequest(socket: Socket, fnMiddleware: any) {
    return (method: string) => (request: any, result: any) => {
      const ctx = this.createContext(socket, method);
      ctx.request = request;
      ctx.socket = socket;
      ctx.ip = socket.remoteAddress || '';
      Object.defineProperty(ctx, 'body', {
        set(v: any) {
          ctx.response = v;
          return v;
        },
      });

      fnMiddleware(ctx)
        .then(() => {
          if (ctx.response === undefined) {
            return result(new Error('Not Found'));
          }
          result(null, ctx.response);
        })
        .catch(result);
    };
  }

  // @ts-ignore
  listen(...args: any) {
    const server = net.createServer(this.callback());
    return server.listen(...args);
  }
}

export default Application;
