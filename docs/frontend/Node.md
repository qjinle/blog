---
title: Node
lang: zh-CN
---

## 封装 mysql

```js
const mysql = require('mysql');

// 创建连接对象
const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'myblog'
    });

// 开始连接
con.connect();

// 执行 sql 函数
function exec(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, res) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(res);
        })
    })
}

module.exports = {
    exec
}
```

## express

### express中间件原理

app.use 用来注册中间件，先收集起来

遇到 http 请求，根据 path 和 method 判断触发条件

实现next 机制，即上一个通过 next 触发下一个

```js
const http = require('http');
const slice = Array.prototype.slice;

class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    // 注册中间件通用方法
    register(path) {
        const info = {};
        if (typeof path === 'string') {
            info.path = path;
            info.stack = slice.call(arguments, 1);
        } else {
            info.path = '/';
            info.stack = slice.call(arguments, 0);
        }
        return info;
    }

    use() {
        const info = this.register(...arguments);
        this.routes.all.push(info);
    }

    get() {
        const info = this.register(...arguments);
        this.routes.get.push(info);
    }

    post() {
        const info = this.register(...arguments);
        this.routes.post.push(info);
    }

    match(method, url) {
        let stack = [];
        if (url === '/favicon.ico') {
            return stack;
        }

        // 获取 routes
        let curRoutes = [];
        curRoutes = curRoutes.concat(this.routes.all);
        curRoutes = curRoutes.concat(this.routes[method]);

        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) {
                stack = stack.concat(routeInfo.stack);
            }
        });
    }

    // 核心 next 机制
    handle(req, res, stack) {
        const next = () => {
            // 拿第一个中间件
            const middleware = stack.shift();
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next);
            }
        }
        next();
    }

    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json');
                res.end(
                    JSON.stringify(data)
                );
            }
            const url = req.url;
            const method = req.method.toLowerCase();

            const resultList = this.match(method, url);
            this.handle(req, res, resultList);
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback());
        server.listen(...args);
    }
}

// 工厂函数
module.exports = () => {
    return new LikeExpress()
}
```

## pm2

除了常见的 `pm2 start index.js`，我们也可以使用配置文件。

#### 进程守护

 用 node app.js 或者 nodemon app.js， 进程崩溃则不能访问。pm2 遇到进程奔溃，会自动重启。这是 pm2 最核心的价值之一

#### 多进程

1、操作系统会限制一个进程的最大可用内存。单个进程内存受限

2、如果只有一个进程，无法充分利用机器的全部内存

3、如果只有一个进程，无法充分利用多核 cpu 的优势

4、使用多进程会带来一个问题，就是多个进程，内存是无法共享的。所以通过共享 `redis`，实现数据共享

#### 配置

新建一个 `pm2.config.json` 文件，后用 ` pm2 start pm2.config.json` 来启动

```json
{
    "apps": {
        "name": "pm2-test-server",
        "script": "index.js",
        "watch": true,
        "ignore_watch": [
            "node_modules",
            "logs"
        ],
        "error_file": "logs/err.log",
        "out_file": "logs/out.log",
        "instances": 4,
        "log_date_format": "YYYY-MM-DD HH:mm:ss"
    }
}
```

#### 常用命令

```
pm2 start app.js
pm2 list	// 列表
pm2 restart <appname>/<id>	// 重启
pm2 stop <appname>/<id>	// 停止
pm2 delete <appname>/<id>	//删除
pm2 info <appname>/<id>
pm2 log <appname>/<id>
pm2 monit <appname>/<id>	// 监听内存、cpu 信息
...
```

