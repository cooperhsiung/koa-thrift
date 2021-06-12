/**
 * Created by Cooper on 2021/06/12.
 */
var UnpkgService = require('./gen-nodejs/UnpkgService');
import { Context } from 'koa';
import KoaThrift from '../index';

const app = new KoaThrift({ service: UnpkgService });

// not found
app.use((ctx: Context) => {
  console.log('ctx.request: ', ctx.request);
});

// result -> InvalidOperation TApplicationException: Not Found

app.listen(9090);
console.log('listening on 9090...');
