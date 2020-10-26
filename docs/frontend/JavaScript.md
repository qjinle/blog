---
title: JavaScript
lang: zh-CN
---

## 变量类型

#### 值类型和引用类型（栈和堆）

​	值类型：number、string、boolean、undefined

​	引用类型：Object、Array、Function、null

```javascript
let a = 100;
let b = a;
a = 200;
console.log(b); // 100 (互不影响)
```

```javascript
let a = { age: 20 };
let b = a;
a.age= 21;
console.log(b.age); // 21 (b.age随a.age的改变而改变)
```

​	值类型的占用空间固定，保存再栈中，保存与复制的是值本身

​	引用类型的占用空间不固定，保存在堆中，保存与复制的是指向对象的一个指针

#### 类型判断

​	typeof：识别所以值类型 ( undefined string number boolean symbol )、识别函数 ( function ) 、判断是否是引用类型（无法细分）

​	instanceof：判断数组、对象、正值表达式，返回布尔值

#### 手写深拷贝

```javascript
function deepClone(obj = {}) {
    // 判断类型
    if (typeof obj !== 'object' || obj == null) {
        return obj;
    }

    let result;
    // 判断 obj 是不是数组
    if (obj instanceof Array) {
        result = [];
    } else {
        result = {};
    }

    for (let key in obj) {
        // 保证 key 不是原型的属性
        if (obj.hasOwnProperty(key)) {
            // 递归
            result[key] = deepClone(obj[key]);
        }
    }

    return result;
};
```

#### 类型转换

- 字符串拼接问题

- == 运算符问题
  - 会隐式类型转换

- if 语句和逻辑运算
  - truly 变量和 falsely 变量

```javascript
// 以下是falsely变量，除此之外都是truly变量
!!0 === false;
!!NaN === false;
!!' ' === false;
!!null === false;
!!undefined === false;
!!false === false;
```

#### var 和 let const 的区别

var 是 ES5 语法，let const 是 ES6 的语法；var有变量提升

let const 有块级作用域

#### 强制/隐式类型转换

强制：`parseInt`、`parseFloat`、`toString`

隐式：if、逻辑运算、==、+ 拼接字符串

#### 手写深度比较 lodash.isEqual

```js
// 全相等（深度）
function isEqual(obj1, obj2) {
    // 判断是否是对象或数组
    function isObject(obj) {
        return typeof obj === 'object' && obj !== null
    }
    if (!isObject(obj1) || !isObject(obj2)) {
        // 值类型（注意，参与 equal 的一般不会是函数）
        return obj1 === obj2
    }
    if (obj1 === obj2) {
        return true
    }
    // 两个都是对象或数组，而且不相等
    // 1. 先取出 obj1 和 obj2 的 keys ，比较个数
    const obj1Keys = Object.keys(obj1)
    const obj2Keys = Object.keys(obj2)
    if (obj1Keys.length !== obj2Keys.length) {
        return false
    }
    // 2. 以 obj1 为基准，和 obj2 一次递归比较
    for (let key in obj1) {
        // 比较当前 key 的 val —— 递归！！！
        const res = isEqual(obj1[key], obj2[key])
        if (!res) {
            return false
        }
    }
    // 3. 全相等
    return true
}
```

#### split() 和 join() 的区别

`split()`：用于把一个字符串分割成字符串数组，需填入指定分隔符

`join()`：用于把数组中的所有元素放入一个字符串，元素是通过指定的分隔符进行分隔的

## 数组

#### 数组的 pop push unshift shift 分别是什么

`pop()`：删除数组的最后一个元素，返回被删除元素，会改变原数组

`push()`：向数组的末尾添加一个或多个元素，返回新的长度，会改变原数组

`unshift()`：向数组的开头添加一个或更多元素，返回新的长度，会改变原数组

`shift()`：删除数组的第一个元素，返回被删除元素，会改变原数组

#### 数组的纯函数

纯函数：1. 不改变源数组（没有副作用）；2. 返回一个数组

`concat()`：连接两个或多个数组，生成新数组返回

`map()`：返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值

`filter()`：创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素

`slice(start,end)`：从已有的数组中返回选定的元素

#### 数组 slice 和 splice 的区别

`slice(start,end)`：数组从 start 开始截取到 end（如果未定义 end 则到结束），返回新数组为被截取数组，不改变原数组

`splice(index,howmany,item1,.....,itemX)`：可删除从 index 处开始的零个或多个元素，并且用参数列表中声明的一个或多个值来替换那些被删除的元素，如果删除了元素，返回含有被删除元素的数组，改变原数组

#### [10,20,30].map(parseInt) 返回的结果

```js
const res = [10, 20, 30].map(parseInt)
console.log(res) //[10, NAN, NAN]

// 拆解
[10, 20, 30].map((num, index) => {
    return parseInt(num, index)
})
```

`parseInt(string,radix)`：radix 代表该进位系统的数字，比如 10 代表十进制

#### 函数声明和函数表达式

函数声明：函数预加载（类似变量提升） `function() {}` 

函数表达式：先定义再赋值 `const fn = function() {}`

#### 数组拍平，手写 flatern

```js
function flat(arr) {
    // 验证 arr 中，还有没有深层数组 [1, 2, [3, 4]]
    const isDeep = arr.some(item => item instanceof Array)
    if (!isDeep) {
        return arr // 已经是 flatern [1, 2, 3, 4]
    }
    const res = Array.prototype.concat.apply([], arr)
    return flat(res) // 递归
}
```

#### 数组去重

传统方式：效率低

```js
function unique(arr) {
    const res = []
    arr.forEach(item => {
        if (res.indexOf(item) < 0) {
            res.push(item)
        }
    })
    return res
}
```

使用 Set：无序，不能重复

```js
function unique(arr) {
    const set = new Set(arr)
    return [...set]
}
```

## 事件

#### 编写一个通用的事件监听函数

```js
// 通用的事件绑定函数
function bindEvent(elem, type, selector, fn) {
    if (fn == null) {
        fn = selector
        selector = null
    }
    elem.addEventListener(type, event => {
        const target = event.target
        if (selector) {
            // 代理绑定
            if (target.matches(selector)) {
                fn.call(target, event)
            }
        } else {
            // 普通绑定
            fn.call(target, event)
        }
    })
}
```

#### 事件冒泡

`event.stopProgagation`：阻止冒泡

#### 事件代理（监听无限列表）

代码简洁、减少浏览器内存占用、但是不要滥用

```js
const div1 = document.querySelector('#div1');
div1.addEventListener('click', event => {
    // 获取被点击元素
    const target = event.target;
    // 判断元素是否为指定标签
    if (target.matches('a')) {
        alert(target.innerHTML);
    }
})
```

## 原型和原型链

`prototype`：显示原型

`__proto__`：隐式原型

#### 如何准确判断一个变量是不是数组

instanceof：判断数组、对象、正值表达式，返回布尔值

```javascript
a instanceof Array  // true
```

#### 手写一个简易的JQuery，考虑插件和扩展性

#### class的原型本质，怎么理解

#### new Object() 和 Object.crate() 区别

{} 等同于 new Object()，原型 Object.prototype

Object.crate(null) 没有原型

Object.crate({...}) 可指定原型，创建的是空对象

## 作用域和闭包

#### 闭包

两种表现形式

```javascript
// 函数作为返回值
function create() {
    const a = 100
    return function() {
        console.log(a)
    }
}
const fn = create()
const a = 200
fn() // 100

// 函数作为参数被传递
function print(fn) {
    const a = 200
    fn()
}
const a = 100
function fn() {
    console.log(a)
}
print(fn) // 100
```

**所有的自由变量的查找，是在函数定义的地方，向上级作用域查找，不是在执行的地方！！！**

影响：变量会常驻内存，得不到释放，内存泄露

#### this指向

this取值是在函数执行的时候确定的，不是在函数定义是确定的

箭头函数this取值是它上一作用域的值

```js
const User = {
    count: 1,
    getCount: function() {
        return this.count
    }
}
console.log(User.getCount()) // 1
const func = User.getCount
console.log(func()) // undefined
```

#### 手写 bind 函数

```javascript
// 模拟 bind
Function.prototype.bind1 = function () {
    // 将参数拆解为数组
    const args = Array.prototype.slice.call(arguments)

    // 获取 this（数组第一项）
    const t = args.shift()

    // fn1.bind(...) 中的 fn1
    const self = this

    // 返回一个函数
    return function () {
        return self.apply(t, args)
    }
}
```

#### 闭包实际应用

​	隐藏数据

```javascript
4// 闭包隐藏数据，只提供 API
function createCache() {
    const data = {} // 闭包中的数据，被隐藏，不被外界访问
    return {
        set: function (key, val) {
            data[key] = val
        },
        get: function (key) {
            return data[key]
        }
    }
}
```

## 异步

异步一般用于网络请求，如ajax图片加载；定时任务，如setTimeout。

异步基于 JS 单线程语言，不会阻塞代码执行；同步会阻塞代码执行。

#### 手写 Promise 加载一张图片

```javascript
function loadImg(src) {
    return new Promise((resolve, reject) => {
            const img = document.createElement('img')
            img.onload = () => {
                resolve(img)
            }
            img.onerror = () => {
                const err = new Error(`图片加载失败 ${src}`)
                reject(err)
            }
            img.src = src
        }
    )
}
```

#### 描述 event loop 运行机制（可画图）

event loop执行过程：

1. 同步代码，一行一行放在 Call Stack (调用栈)中执行
2. 遇到异步，会先“记录”，等待时机（定时、网络请求等）
3. 时机到了，就移动到 Callback Queue（回调函数队列）
4. 如 Call Stack 为空（同步代码执行完）Event Loop开始工作
5. **每一次 call stack 结束，都会触发 DOM 渲染（不一定非得渲染，就是给一次 DOM 渲染的机会！！！），然后再进行 event loop**
6. 轮询查找 Callback Queue，如有则移动到 Call Stack执行
7. .然后继续轮询查找

#### Promise 哪几种状态，如何变化？

1. pending 状态：不会触发 then 或 catch
2. resolved 状态：会触发后续的 then 回调函数 
3. rejected 状态：会触发后续的 catch 回调函数

**then() 一般正常返回 resolved 状态的 promise，then() 里抛出错误，会返回 rejected 状态的 promise**

**catch() 不抛出错误，会返回 resolved 状态的 promise，catch() 抛出错误，会返回 rejected 状态的 promise**

#### 场景题 Promise catch 连接 then

```js
// 第一题
Promise.resolve().then(() => {
    console.log(1)
}).catch(() => {
    console.log(2)
}).then(() => {
    console.log(3)
})
// 1 3

// 第二题
Promise.resolve().then(() => { // 返回 rejected 状态的 promise
    console.log(1)
    throw new Error('erro1')
}).catch(() => { // 返回 resolved 状态的 promise
    console.log(2)
}).then(() => {
    console.log(3)
})
// 1 2 3

// 第三题
Promise.resolve().then(() => { // 返回 rejected 状态的 promise
    console.log(1)
    throw new Error('erro1')
}).catch(() => { // 返回 resolved 状态的 promise
    console.log(2)
}).catch(() => {
    console.log(3)
})
// 1 2 
```

#### async/await 和 Promise 的关系

1. 执行 async 函数，返回的是 Promise 对象
2. await 相当于 Promise 的 then
3. try...catch 可以捕获异常，代替了 Promise 的 catch

**await 后面的代码相当于放在 callback 回调中执行，要等同步代码执行完才执行**

#### for...of 异步遍历

```js
// 定时算乘法
function multi(num) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(num * num)
        }, 1000)
    })
}
// 使用 for...of ，可以让计算挨个串行执行
async function test2 () {
    const nums = [1, 2, 3];
    for (let x of nums) {
        // 在 for...of 循环体的内部，遇到 await 会挨个串行计算
        const res = await multi(x)
        console.log(res)
    }
}
test2()
```

#### 宏任务和微任务

- 宏任务：setTimeout setInterval ajax DOM 事件，DOM 渲染后再触发
- 微任务：Promise async/await，DOM 渲染前会触发
- 微任务比宏任务执行的更早

#### 执行顺序问题

```js
async function async1 () {
  console.log('async1 start') // 2
    // 这一句会同步执行，返回 Promise ，其中的 `console.log('async2')` 也会同步执行
  await async2() 
  // 上面有 await ，下面就变成了“异步”，类似 cakkback 的功能（微任务）
  console.log('async1 end')  // 6 
}

async function async2 () {
  console.log('async2') // 3
}

console.log('script start') // 1

setTimeout(function () { // 异步，宏任务
  console.log('setTimeout') // 8
}, 0)

async1()

// 返回 Promise 之后，即同步执行完成，then 是异步代码
new Promise (function (resolve) { 
    // Promise 的函数体会立刻执行
  console.log('promise1') // 4
  resolve()
}).then (function () { // 异步，微任务
  console.log('promise2') // 7
})

console.log('script end') // 5

// 同步代码执行完之后，屡一下现有的异步未执行的，按照顺序
// 1. async1 函数中 await 后面的内容 —— 微任务
// 2. setTimeout —— 宏任务
// 3. then —— 微任务
```

## AJAX

#### 手写原生ajax

```js
function ajax(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText))
                } else if (xhr.status === 404 || xhr.status === 500) {
                    reject(new Error('404 not found'))
                }
            }
        }
        xhr.send(null)
    })
}
```

#### 跨域的常用实现方式

JSONP原理：script标签跨域

```
使用 jsonp 来实现跨域请求，它的主要原理是通过动态构建 script 标签来实现跨域请求，因为浏览器对 script 标签的
引入没有跨域的访问限制。通过在请求的 url 后指定一个回调函数，然后服务器在返回数据的时候，构建一个 json 数据的
包装，这个包装就是回调函数，然后返回给前端，前端接收到数据后，因为请求的是脚本文件，所以会直接执行，这样我们先前
定义好的回调函数就可以被调用，从而实现了跨域请求的处理。这种方式只能用于 get 请求。
```

CORS：纯服务端

```
使用 CORS 的方式，CORS 是一个 W3C 标准，全称是"跨域资源共享"。CORS 需要浏览器和服务器同时支持。目前，所有浏
览器都支持该功能，因此我们只需要在服务器端配置就行。浏览器将 CORS 请求分成两类：简单请求和非简单请求。

对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是会在头信息之中，增加一个 Origin 字段。Origin 字段用来
说明本次请求来自哪个源。服务器根据这个值，决定是否同意这次请求。对于如果 Origin 指定的源，不在许可范围内，服务
器会返回一个正常的 HTTP 回应。浏览器发现，这个回应的头信息没有包含 Access-Control-Allow-Origin 字段，就
知道出错了，从而抛出一个错误，ajax 不会收到响应信息。如果成功的话会包含一些以 Access-Control- 开头的字段。

非简单请求，浏览器会先发出一次预检请求，来判断该域名是否在服务器的白名单中，如果收到肯定回复后才会发起请求。
```

websocket 协议

#### get 和 post 的区别

get 一般用于查询操作，post 一般用于用户提交操作

get 参数拼接在 url 上，post 放在请求体内（数据体积可更大）

post 易于防止 CSRF 攻击

## 异常

#### 如何捕获异常

手动捕获：

```js
try {
    // todo
} catch(ex) {
    console.error(ex) // 手动捕获
} finally {
    // todo
}
```

自动捕获：

```js
window.onerror = function (message, source, lineNum, colNum, error) {}
```

## 面试题

1. 使用JS实现一个repeat方法，function repeat (func, times, wait) {}， const repeatFunc = repeat(alert, 4, 3000), 调用这个 repeatedFunc("hellworld")，会alert4次 helloworld, 每次间隔3秒

   ```js
   function repeat(func, times, wait) {
     return function (value) {
       let flag = 0
       function st() {
         if (flag > times-1) {
           return;
         }
         setTimeout(() => {
           func(value)
           flag++
           st()
         }, wait)
       }
       st()
     }
   
   const repeatFunc = repeat(alert, 4, 3000)
   repeatFunc('hellword')
   ```
