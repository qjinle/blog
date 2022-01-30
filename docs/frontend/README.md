---
title: HTML
lang: zh-CN
---

## HTML 语义化

- 通过标签自己的属性来控制显示效果，让人更容易读懂

- 有利于搜索引擎优化和页面爬取

## 行内元素 vs 块级元素

行内元素特指 **不会独占一行** 的元素，如 `span`、`a`、`label` 等

- 行内元素属性标签它和其它标签处在同一行内
- 行内元素只能容纳文本或者其他行内元素
- 行内元素属性标签无法设置 `width | height | margin-top | margin-bottom | padding-top | padding-bottom`
- 行内元素宽度随内容增加，高度随字体大小改变

块级元素特指 **会独占一行** 的元素，如 `div`、`p`、`h1` 等

- 块级元素其宽度自动填满其父元素宽度
- 块级元素可以包含行内元素和块级元素
- **p 标签中不能嵌套 div 标签**

## async vs defer

### 共同点

加上 `async` 或 `defer` 属性的脚本的 **加载过程 ** 都不会阻塞 HTML 的解析

### 不同点

- `async` —— 脚本加载完后会立刻开始脚本的执行，并停止对 HTML 的解析，待脚本执行完再继续 HTML 的解析
  - 不可控
  - 执行顺序按网络加载结果
- `defer` —— 等整个HTML文档都解析完（ `DOMContentLoaded` 事件发生），脚本才开始执行
  - 执行顺序按 HTML 文档顺序执行

## DOMContentLoaded vs Load

**当 HTML 文档解析完成就会触发 `DOMContentLoaded`，而所有资源加载完成之后，`load` 事件才会被触发**

- `DOMContentLoaded` —— 当初始的 **HTML** 文档被完全加载和解析完成之后，`DOMContentLoaded` 事件被触发，而无需等待样式表、图像和子框架的完成加载
- `load` —— 当一个资源及其依赖资源已完成加载时，将触发 load 事件

## 前端路由

### 背景

在前端技术早期，一个 url 对应一个页面，如果你要从 A 页面切换到 B 页面，那么必然伴随着页面的刷新，这个用户体验并不好

后来，Ajax 出现使得可以在不刷新页面的情况下发起请求，与之共生的是 **SPA（单页面应用）**

SPA 极大地提升了用户体验，它允许页面在不刷新的情况下更新页面内容，使内容的切换更加流畅，但仍然有两个问题：

1. **SPA 不会记住你的操作**，SPA 其实并不知道当前的页面进展到了哪一步，可能你在一个站点下经过了反复的前进才终于唤出了某一块内容，但是此时只要刷新一下页面，一切就会被清零，你必须重复之前的操作、才可以重新对内容进行定位
2. 由于**有且仅有一个 URL 给页面做映射**，这对 SEO 也不够友好，搜索引擎无法收集全面的信息

前端路由可以帮助我们在仅有一个页面的情况下，记住用户当前走到了哪一步，即 **为 SPA 中的各个视图匹配一个唯一标识**

解决思路：

1. 拦截用户的刷新操作，避免服务端盲目响应、返回不符合预期的资源内容，把刷新这个动作完全放到前端逻辑里消化掉
2. 感知 URL 的变化，给 URL 做一些微小的处理，这些处理并不会影响 URL 本身的性质，不会影响服务器对它的识别，只有前端感知得到；一旦感知到，就根据这些变化、用 JS 去生成不同的内容

### hash 模式

hash 模式是指通过改变 URL 后面以 `#` 分隔的字符串，从而让页面感知到路由变化的一种实现方式

```
// 主页
https://www.imooc.com/#index

// 活动页
https://www.imooc.com/#activePage
```

#### hash 改变

可以通过 location 暴露出来的属性，直接去修改当前 URL 的 hash 值

```js
window.location.hash = 'index'; 
```

#### hash 感知

通过监听 `hashchange` 事件，我们可以用 JS 来捕捉 hash 值的变化，进而决定我们页面内容是否需要更新

```js
// 监听hash变化，点击浏览器的前进后退会触发
window.addEventListener('hashchange', function(event){ 
    // 根据 hash 的变化更新内容
},false)
```

### history 模式

history 模式利用 history API 实现 url 地址改变，网页内容改变

`window.history` 属性指向 History 对象，它表示当前窗口的浏览历史，当发生改变时，只会改变页面的路径，不会刷新页面

History 对象主要有两个属性：

- `History.length`：当前窗口访问过的网址数量（包括当前网页）
- `History.state`：History 堆栈最上层的状态值

#### history 改变

在 HTML4 时，可以通过下面的接口来操作浏览历史、实现跳转动作

```js
window.history.forward()  // 前进到下一页
window.history.back() // 后退到上一页
window.history.go(2) // 前进两页
window.history.go(-2) // 后退两页
```

> 移动到以前访问过的页面时，页面通常是从浏览器缓存之中加载，而不是重新要求服务器发送新的网页

从 HTML5 开始，浏览器支持了 `pushState` 和 `replaceState` 两个 API，允许对浏览历史进行修改和新增

##### pushState(object, title, url)

该方法用于在历史中添加一条记录，不会触发页面刷新，只是导致 History 对象发生变化，地址栏会有变化

该方法三个参数：

- `object`：是一个对象，通过 `pushState` 方法可以将该对象内容传递到新页面中
- `title`：指标题，几乎没有浏览器支持该参数，传一个空字符串比较安全
- `url`：新的网址，必须与当前页面处在同一个域。不指定的话则为当前的路径，如果设置了一个跨域网址，则会报错

```js
var data = { foo: 'bar' };
history.pushState(data, '', '2.html');
console.log(history.state) // {foo: "bar"}
```

> 如果 `pushState` 的 URL 参数设置了一个新的锚点值（即 hash），并不会触发 `hashchange` 事件。反过来，如果 URL 的锚点值变了，则会在 History 对象创建一条浏览记录

##### replaceState(object, title, url)

该方法用来修改 History 对象的当前记录，用法与 `pushState` 一样

```js
history.pushState({page: 1}, '', '?page=1')
// URL 显示为 http://example.com/example.html?page=1

history.pushState({page: 2}, '', '?page=2');
// URL 显示为 http://example.com/example.html?page=2

history.replaceState({page: 3}, '', '?page=3');
// URL 显示为 http://example.com/example.html?page=3
```

#### history 感知

可以通过监听 `popstate` 事件来感知浏览历史的变化

```js
window.addEventListener('popstate', function(e) {
  console.log(e)
});
```

**注意这里有个坑**：`go`、`forward` 和 `back` 等方法的调用确实会触发 `popstate`，但是 `pushState` 和 `replaceState` 不会
