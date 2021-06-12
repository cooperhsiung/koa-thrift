/**
 * Created by Cooper on 2021/06/12.
 */
var UnpkgService = require('./gen-nodejs/UnpkgService');
const mount = require('koa-mount');
import { Context } from 'koa';
import KoaThrift from '../index';

const app = new KoaThrift({ service: UnpkgService });

// use middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(
    `process ${ctx.path} request from ${ctx.ip} cost ${Date.now() - start}ms`
  );
});

// with route
app.use(
  mount('/Publish', async (ctx: Context) => {
    console.log('ctx.request: ', ctx.request);
    await sleep(300);
    ctx.body = { code: 0, message: 'publish success' };
  })
);

app.listen(9090);
console.log('listening on 9090...');

function sleep(delay = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
