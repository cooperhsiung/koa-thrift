/**
 * Created by Cooper on 2021/06/11.
 */
import thrift from 'thrift';
import compose from 'koa-compose';
import { Context, Middleware } from 'koa';

function getMethods(iClient: any) {
  let result = [];
  for (const prop of Object.getOwnPropertyNames(iClient.prototype)) {
    if (
      ['seqid', 'new_seqid'].includes(prop) ||
      prop.startsWith('send_') ||
      prop.startsWith('recv_')
    ) {
      continue;
    }
    result.push(prop);
  }
  return result;
}

// type Context = {
//   request?: any;
//   body?: any;
//   response?: any;
//   originalUrl?: string;
//   path?: string;
// };

class App {
  service: any;
  middlewares: Middleware[];
  processor: any;
  constructor(srv: any) {
    this.middlewares = [];
    this.service = srv;
  }

  use(handler: Middleware) {
    this.middlewares.push(handler);
  }

  listen(args: any) {
    const handler = compose(this.middlewares);
    // console.log('========= this.service', this.service);
    const methods = getMethods(this.service.Client);
    // console.log('========= methods', methods);

    const noop = (method: string) =>
      function (req: any, result: any) {
        console.log('========= req', req);
        const ctx = {
          request: req,
          originalUrl: '/' + method,
          path: '/' + method,
        } as Context;
        handler(ctx)
          .then((ret: any) => {
            if (ctx.body === undefined) {
              return result(new Error('Not Found'));
            }
            result(null, ctx.body);
          })
          .catch((err: any) => {
            console.error(err);
            result(err);
          });
      };
    const handlers = methods.reduce((s, v) => {
      s[v] = noop(v);
      return s;
    }, {} as any);

    const server = thrift.createServer(this.service, handlers);
    return server.listen(args);
  }
}

export default App;
