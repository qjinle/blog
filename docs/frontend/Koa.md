---
title: Koa
lang: zh-CN
---

## 使用

```js
const Koa = require('koa');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

## koa2中间件原理

洋葱圈模型

```js
const http = require('http');

// 组合中间件
function compose(middlewareList) {
    return function (ctx) {
        function dispatch(i) {
            const fn = middlewareList[i];
            try {
                return Promise.resolve(
                    fn(ctx, dispatch.bind(null, i + 1))
                );
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return dispatch(0);
    }
}

class LikeKoa2 {
    constructor() {
        this.middlewareList = [];
    }

    use(fn) {
        this.middlewareList.push(fn);
        return this;    // 链式调用
    }

    createContext(req, res) {
        const ctx = {
            req,
            res
        }
        return ctx;
    }

    handleRequest(ctx, fn) {
        return fn(ctx);
    }

    callback() {
        const fn = compose(this.middlewareList);
        return (req, res) => {
            const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback());
        server.listen(...args);
    }
}

module.exports = LikeKoa2
```



