---
title: WebSocket
lang: zh-CN
---

## 背景

相较于 HTTP 协议，HTTP 协议有一个的缺陷为：HTTP 协议是一个请求－响应协议，请求必须先由浏览器发给服务器，服务器才能响应这个请求，再把数据发送给浏览器。换句话说，**浏览器不主动请求，服务器是没法主动发数据给浏览器的**

在一些场景下，这种单向请求的特点，注定了如果服务器有连续的状态变化，客户端要获知就非常麻烦。我们只能使用轮询：每隔一段时候，就发出一个询问，了解服务器有没有新的信息。最典型的场景就是聊天室

轮询的效率低，非常浪费资源（因为必须不停连接，或者 HTTP 连接始终打开）

因此 WebSocket 诞生了

## WebSocket

**WebSocket 是 HTML5 新增的协议，它的目的是在浏览器和服务器之间建立一个不受限的双向通信的通道，比如说，服务器可以在任意时刻发送消息给浏览器**

- 属于应用层协议
- 基于 TCP 传输协议
- 复用 HTTP 的握手通道

通信过程中，可互相发送 JSON、XML、HTML 或图片等任意格式的数据

### 与 HTTP 异同

#### 相同点

- 都是基于 TCP 的应用层协议
- 都使用 Request/Response 模型进行连接的建立
- 在连接的建立过程中对错误的处理方式相同，在这个阶段 WS 可能返回和 HTTP 相同的返回码
- 都可以在网络中传输数据

#### 不同点

- WS 使用 HTTP 来建立连接，但是定义了一系列新的 header 域，这些域在 HTTP 中并不会使用
- WS 的连接不能通过中间人来转发，它必须是一个直接连接
- WS 连接建立之后，通信双方都可以在任何时刻向另一方发送数据
- WS 连接建立之后，数据的传输使用帧来传递，不再需要 Request 消息
- WS 的数据帧有序

### 通信

![ws通信](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/ws%E9%80%9A%E4%BF%A1.png)

WebSocket 是基于 TCP 的一个应用协议，与 HTTP 协议的关联之处在于 WebSocket 的握手数据被 HTTP 服务器当作 HTTP 包来处理，主要通过 Update request HTTP 包建立起连接，之后的通信全部使用 WebSocket 自己的协议

首先，WebSocket 连接必须由浏览器发起，因为请求协议是一个标准的 HTTP 请求，格式如下：

```http
GET ws://localhost:3000/ws/chat HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Origin: http://localhost:3000
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: client-random-string
Sec-WebSocket-Protocol: binary, base64
```

- 第一行为为请求的方法，类型必须为 GET，协议版本号必须大于 1.1
- GET 请求地址是以 `ws://` 开头的
- 请求头 `Upgrade: websocket` 和 `Connection: Upgrade` 表示这个连接将要被转换为 WebSocket 连接
- `Sec-WebSocket-Key` 字段必须包含 ，记录着握手过程中必不可少的键值
- `Sec-WebSocket-Protocol` 字段必须包含 ，记录着使用的子协议
- `Sec-WebSocket-Version` 指定了 WebSocket 的协议版本
- Origin 用来指明请求的来源，Origin 头部主要用于保护 Websocket 服务器免受非授权的跨域脚本调用 Websocket API 的请求。也就是不想没被授权的跨域访问与服务器建立连接，服务器可以通过这个字段来判断来源的域并有选择的拒绝

随后，服务器如果接受该请求，就会返回如下响应：

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: server-random-string
```

- 该响应代码 `101` 表示本次连接的HTTP协议即将被更改，更改后的协议就是 `Upgrade: websocket` 指定的 WebSocket 协议
- `Sec-WebSocket-Accept` 字段是由握手请求中的 `Sec-WebSocket-Key` 字段生层的

握手成功后，通信不再使用 HTTP 协议，而采用 WebSocket 独立的数据帧，浏览器和服务器就可以随时主动发送消息给对方

消息有两种，一种是文本，一种是二进制数据。通常，我们可以发送 JSON 格式的文本，这样，在浏览器处理起来就十分容易

## 使用

```js
// 前端使用原生Websocket Api
let ws = new WebSocket('ws://localhost:8080')
ws.onopen = (e) => {
	console.log('open', e)
	ws.send('client send')
}
ws.onmessage = (e) => {
	console.log('msg', e)
}

// 后端
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
```

### 常用 API

#### 构造

WebSocket 对象作为一个构造函数，用于新建 [WebSocket 实例对象](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

```js
let ws = new WebSocket('ws://localhost:8080');
```

#### readyState

`readyState` 属性返回实例对象的当前状态，可用于判断连接情况，共有四种：

- `CONNECTING` —— 值为0，表示正在连接
- `OPEN` —— 值为1，表示连接成功，可以通信了
- `CLOSING` —— 值为2，表示连接正在关闭
- `CLOSED` —— 值为3，表示连接已经关闭，或者打开连接失败

#### onopen

实例对象的 `onopen` 属性，用于指定连接成功后的回调函数

```js
ws.onopen = function(e) {
	console.log('open', e)
	ws.send('client send')
}
```

如果要指定多个回调函数，可以使用 `addEventListener` 方法

```js
ws.addEventListener('open', function(event) {
	ws.send('client send')
})
```

#### onmessage

实例对象的 `onmessage` 属性，用于指定收到服务器数据后的回调函数

```javascript
ws.onmessage = function(event) {
  let data = event.data;
  // 处理数据
};

ws.addEventListener("message", function(event) {
  let data = event.data;
  // 处理数据
});
```

#### onclose

实例对象的 `onclose` 属性，用于指定连接关闭后的回调函数

```js
ws.onclose = function(event) {
  var code = event.code;
  var reason = event.reason;
  var wasClean = event.wasClean;
  // handle close event
};

ws.addEventListener("close", function(event) {
  var code = event.code;
  var reason = event.reason;
  var wasClean = event.wasClean;
  // handle close event
});
```

#### send

实例对象的 `send()` 方法用于向服务器发送数据

```js
// 发送文本
ws.send('your message');

// 发送 blob 对象
var file = document
  .querySelector('input[type="file"]')
  .files[0];
ws.send(file);
```

#### onerror

实例对象的 `onerror` 属性，用于指定报错时的回调函数

```js
ws.onerror = function(event) {
  // handle error event
};

ws.addEventListener("error", function(event) {
  // handle error event
});
```

