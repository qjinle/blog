---
title: JavaScript
lang: zh-CN
---

## 变量类型

### 值类型和引用类型

值类型：number、string、boolean、undefined

引用类型：Object、Array、Function、null

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

值类型的占用空间固定，保存再栈中，保存与复制的是值本身

引用类型的占用空间不固定，保存在堆中，保存与复制的是指向对象的一个指针

### 类型判断

`typeof`：识别所以值类型（undefined、string、number、boolean、symbol）、识别函数（function）、判断是否是引用类型（无法细分）

`instanceof`：判断数组、对象、正值表达式，返回布尔值

`Object.prototype.toString.call`：返回 `[object, xxx]`，xxx 为目标类型

### 类型转换

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

### 定义变量

var 是 ES5 语法，let const 是 ES6 的语法；var有变量提升

let const 有块级作用域

### 类型转换

强制：`parseInt`、`parseFloat`、`toString`

隐式：if、逻辑运算、==、+ 拼接字符串

## 数组

### 判断数组

```js
var arr = []

arr instanceof Array

Array.prototype.isPrototypeOf(arr)

arr.constructor === Array

Object.prototype.toString.call(arr) === "[object Array]"

Array.isArray(arr)
```

### 纯函数

纯函数：1. 不改变源数组（没有副作用）；2. 返回一个数组

`concat()`：连接两个或多个数组，生成新数组返回

`map()`：返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值

`filter()`：创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素

`slice(start,end)`：从已有的数组中返回选定的元素

###  数组截取

`slice(start,end)`：数组从 start 开始截取到 end（如果未定义 end 则到结束），返回新数组为被截取数组，不改变原数组

`splice(index,howmany,item1,.....,itemX)`：可删除从 index 处开始的零个或多个元素，并且用参数列表中声明的一个或多个值来替换那些被删除的元素，如果删除了元素，返回含有被删除元素的数组，改变原数组

### 数组拍平

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

### 数组去重

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

## 函数

函数声明：函数预加载（类似变量提升） `function() {}` 

函数表达式：先定义再赋值 `const fn = function() {}`

### 手写深拷贝

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

### 手写 bind 函数

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

### 手写深度比较

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

## 事件

### 通用事件监听函数

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

### 事件冒泡

`event.stopProgagation`：阻止冒泡

### 事件代理

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

### new Object() 和 Object.crate() 

{} 等同于 new Object()，原型 Object.prototype

Object.crate(null) 没有原型

Object.crate({...}) 可指定原型，创建的是空对象

## 作用域和闭包

### 闭包

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

### this指向

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

### 闭包实际应用

隐藏数据

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

### 手写 Promise 加载图片

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

### event loop 运行机制

event loop执行过程：

1. 同步代码，一行一行放在 Call Stack (调用栈)中执行
2. 遇到异步，会先“记录”，等待时机（定时、网络请求等）
3. 时机到了，就移动到 Callback Queue（回调函数队列）
4. 如 Call Stack 为空（同步代码执行完）Event Loop开始工作
5. **每一次 call stack 结束，都会触发 DOM 渲染（不一定非得渲染，就是给一次 DOM 渲染的机会！！！），然后再进行 event loop**
6. 轮询查找 Callback Queue，如有则移动到 Call Stack执行
7. .然后继续轮询查找

### Promise 状态

1. pending 状态：不会触发 then 或 catch
2. resolved 状态：会触发后续的 then 回调函数 
3. rejected 状态：会触发后续的 catch 回调函数

**then() 一般正常返回 resolved 状态的 promise，then() 里抛出错误，会返回 rejected 状态的 promise**

**catch() 不抛出错误，会返回 resolved 状态的 promise，catch() 抛出错误，会返回 rejected 状态的 promise**

### async/await

1. 执行 async 函数，返回的是 Promise 对象
2. await 相当于 Promise 的 then
3. try...catch 可以捕获异常，代替了 Promise 的 catch

**await 后面的代码相当于放在 callback 回调中执行，要等同步代码执行完才执行**

### for...of 

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

### 宏任务和微任务

- 宏任务：setTimeout setInterval ajax DOM 事件，DOM 渲染后再触发
- 微任务：Promise async/await，DOM 渲染前会触发
- 微任务比宏任务执行的更早

### 执行顺序

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

### 手写 ajax

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

### get 和 post 的区别

get 一般用于查询操作，post 一般用于用户提交操作

get 参数拼接在 url 上，post 放在请求体内（数据体积可更大）

post 易于防止 CSRF 攻击

## 异常

### 如何捕获异常

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
