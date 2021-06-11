# koa-thrift

[![NPM Version][npm-image]][npm-url]
[![Node Version][node-image]][node-url]

## Installation

```bash
npm i koa-thrift -S
```

## Usage

simple app

```typescript
import KoaThrift from 'koa-thrift'
const app = new KoaThrift();

app.use((ctx) => {
  console.log('ctx.request: ', ctx.request);
  ctx.body = { Data: 'heeleo11' };
});

app.listen(9090);
```

with router

```typescript
import KoaThrift from 'koa-thrift'
const mount = require('koa-mount');
const app = new KoaThrift();

app.use( mount('/Publish',  (ctx: Context) => {
    console.log('ctx.request: ', ctx.request);
    ctx.body = { Data: 'Publish2' };
  }),
);

app.listen(9090);
```

## Others

## Todo

- [ ] xxxx

## License

MIT

[npm-image]: https://img.shields.io/npm/v/koa-thrift.svg
[npm-url]: https://www.npmjs.com/package/koa-thrift
[node-image]: https://img.shields.io/badge/node.js-%3E=8-brightgreen.svg
[node-url]: https://nodejs.org/download/