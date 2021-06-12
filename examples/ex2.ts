/**
 * Created by Cooper on 2021/06/12.
 */
var UnpkgService = require('./gen-nodejs/UnpkgService');
const mount = require('koa-mount');
import { Context } from 'koa';
import KoaThrift from '../index';

const app = new KoaThrift({ service: UnpkgService });

// with route
app.use(
  mount('/Publish', function (ctx: Context) {
    console.log('ctx.request: ', ctx.request);
    ctx.body = { code: 0, message: 'publish success' };
  })
);

app.listen(9090);
console.log('listening on 9090...');
