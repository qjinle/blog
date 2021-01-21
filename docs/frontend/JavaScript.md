---
title: JavaScript
lang: zh-CN
---

## 数据类型

- **原始类型**：Number、String、Boolean、undefined、null、Symbol、BigInt
  - 原始类型的占用空间固定，保存在栈中，保存与复制的是值本身
  - 回收内存简单

- **引用类型**：Object、Array、Function
  - 引用类型的占用空间不固定，保存在堆中，保存与复制的是指向对象的一个指针
  - 分配内存和回收内存都会占用一定的时间

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

### 执行上下文

Javascript 代码编译一段代码后会生成两部分：**执行上下文（Execution context）**和 **可执行代码**

**执行上下文是 JavaScript 执行一段代码时的运行环境**

![执行上下文](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/执行上下文.png)

创建执行上下文有这几种情况：

1. 当 JavaScript 执行全局代码的时候，会编译全局代码并创建全局执行上下文，而且在整个页面的生存周期内，全局执行上下文只有一份。
2. 当调用一个函数的时候，函数体内的代码会被编译，并创建函数执行上下文，一般情况下，函数执行结束之后，创建的函数执行上下文会被销毁。
3. 当使用 eval 函数的时候，eval 的代码也会被编译，并创建执行上下文。

### 调用栈

**调用栈就是用来管理函数调用关系的一种数据结构**

JavaScript 引擎利用栈这种结构来管理执行上下文

在执行上下文创建好后，JavaScript 引擎会将执行上下文压入栈中，通常把这种用来管理执行上下文的栈称为**执行上下文栈**，又称**调用栈**

调用栈工作流程：

1. 创建全局上下文，并将其压入栈底
2. 每调用一个函数，JavaScript 引擎会为其创建执行上下文，并把该执行上下文压入调用栈，然后 JavaScript 引擎开始执行函数代码
3. 如果在一个函数 A 中调用了另外一个函数 B，那么 JavaScript 引擎会为 B 函数创建执行上下文，并将 B 函数的执行上下文压入栈顶
4. 当前函数执行完毕后，JavaScript 引擎会将该函数的执行上下文弹出栈

### 作用域

作用域是指在程序中定义变量的区域，该位置决定了变量的生命周期。

通俗地理解，作用域就是变量与函数的可访问范围，即作用域控制着变量和函数的可见性和生命周期。

1. **全局作用域** --- 对象在代码中的任何地方都能访问，其生命周期伴随着页面的生命周期
2. **函数作用域** --- 在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。函数执行结束之后，函数内部定义的变量会被销毁
3. **块级作用域** --- 使用一对大括号包裹的一段代码，如函数、判断、循环语句

通过 **let/const** 声明的变量属于块级作用域，这些变量在编译阶段会被放进执行上下文的 **词法环境**

块级作用域变量查询流程如下：

![块级作用域查找变量](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F.png)

### 作用域链

每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，这条指向链条就是 **作用域链**

外部引用的指向是根据 **词法作用域** 定义的（词法作用域由代码中函数声明的位置来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执行过程中如何查找标识符）

所以一个变量的查找全过程如下：

![变量查找](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/%E5%8F%98%E9%87%8F%E6%9F%A5%E6%89%BE.png)

**所有的自由变量的查找，是在函数定义的地方，向上级作用域查找，不是在执行的地方！！！**

### 闭包

在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。比如外部函数是 foo，那么这些变量的集合就称为 foo 函数的闭包。

影响：变量会常驻内存，得不到释放，内存泄露

```javascript
function foo() {
    var myName = " 极客时间 "
    let test1 = 1
    const test2 = 2
    var innerBar = {
        getName:function(){
            console.log(test1)
            return myName
        },
        setName:function(newName){
            myName = newName
        }
    }
    return innerBar
}
var bar = foo()
bar.setName(" 极客邦 ")
bar.getName()
console.log(bar.getName())
```

产生闭包的流程：

1. 当 JavaScript 引擎执行到 foo 函数时，首先会编译，并创建一个空执行上下文
2. 在编译过程中，遇到内部函数 setName，JavaScript 引擎还要对内部函数做一次快速的词法扫描，发现该内部函数引用了 foo 函数中的 myName 变量，由于是内部函数引用了外部函数的变量，所以 JavaScript 引擎判断这是一个闭包，于是在堆空间创建换一个 **closure(foo)** 的对象（这是一个内部对象，JavaScript 是无法访问的），用来保存 myName 变量
3. 接着继续扫描到 getName 方法时，发现该函数内部还引用变量 test1，于是 JavaScript 引擎又将 test1 添加到 **closure(foo)** 对象中。这时候堆中的 **closure(foo)** 对象中就包含了 myName 和 test1 两个变量了
4. 由于 test2 并没有被内部函数引用，所以 test2 依然保存在调用栈中

#### 闭包回收

如果引用闭包的函数是一个全局变量，那么闭包会一直存在直到页面关闭。（**内存泄漏**）

如果引用闭包的函数是个局部变量，等函数销毁后，在下次 JavaScript 引擎执行垃圾回收时，判断闭包这块内容如果已经不再被使用了，那么 JavaScript 引擎的垃圾回收器就会回收这块内存。

**如果该闭包会一直使用，那么它可以作为全局变量而存在；但如果使用频率不高，而且占用内存又比较大的话，那就尽量让它成为一个局部变量**。

#### 闭包实际应用

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

## this 机制

**this 是和执行上下文绑定的**，也就是说每个执行上下文中都有一个 this

### 全局中 this

全局执行上下文中的 this 指向 window 对象，是 this 和作用域链的唯一交点

### 函数中 this

在全局环境中调用一个函数，函数内部的 this 指向的是全局变量 window

1. 可用 **call/apply/bind** 来设置 this 的指向
2. 通过一个对象来调用其内部的一个方法，该方法的执行上下文中的 this 指向对象本身
3. 通过构造函数中设置

### this 一些坑

1. **嵌套函数中的 this 不会从外层函数中继承**
   1. 嵌套函数中的 this 会指向 window 对象
   2. 解决此问题可以 **在外层函数中声明一个变量保存 this**（实质是把 this 体系转为作用域体系）
   3. 解决此问题还可用 **ES6 的箭头函数**（指向外层函数）
2. **普通函数中的 this 默认指向全局对象 window**

## new 机制

```js
function CreateObj(){
  this.name = "Jinle"
}
var myObj = new CreateObj()
```

使用 new 构建一个对象时，做了一下几步：

1. 首先创建一个空对象 tempObj
2. 接着调用 CreateObj.call 方法，并将 tempObj 作为 call 方法的参数，这样当 CreateObj 的执行上下文创建时，它的 this 就指向了 tempObj 对象
3. 然后执行 CreateObj 函数，此时的 CreateObj 函数执行上下文中的 this 指向了 tempObj 对象
4. 返回 tempObj 对象

代码演示为：

```js
var tempObj = {}
CreateObj.call(tempObj)
return tempObj
```

## 垃圾回收机制

数据分别存储在调用栈和堆之中，其垃圾回收机制是不同的

### 栈中垃圾回收

调用栈中除了存放执行上下文，还有一个 **记录当前状态的指针（ESP）**，**JavaScript 引擎会通过向下移动 ESP 来销毁函数保存在栈中的执行上下文**

![栈垃圾回收](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/%E6%A0%88%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6.png)

### 堆中垃圾回收

堆中垃圾回收使用的是 **JavaScript V8 引擎的垃圾回收器（主/副垃圾回收器）**

V8 把堆分成了两个区域：**新生代** 和 **老生代**

新生代中存放的是生存时间短的对象，通常只支持 1～8M 的容量，使用副垃圾回收器

老生代中存放的是生存时间久的对象，通常容量较大，使用主垃圾回收器

#### 副垃圾回收器

副垃圾回收器主要负责新生区的垃圾回收，主要用 **Scavenge 算法** 来处理，其每次清理都需要复制操作，所以新生区的空间会比较小，这是为了提高执行效率

其回收机制是：

1. 把新生代空间对半划分为两个区域，一半是**对象区域**，一半是**空闲区域**
2. 新加入的对象都会存放到对象区域
3. 当对象区域快被写满时，就需要执行一次垃圾清理操作
4. 对对象区域中的垃圾**做标记**
5. 进入垃圾清理阶段
   1. 副垃圾回收器**把存活的对象复制到空闲区域并排序**
   2. 对象区域与空闲区域进行**角色翻转（让新生代两块区域无限重复使用）**
   3. 清除新的空闲区域

V8 引擎采用了**对象晋升策略**，经过两次垃圾回收依然还存活的对象，会被移动到老生区中（为了解决新生区空间不大，容易被占满的问题）

#### 主垃圾回收器

主垃圾回收器主要负责老生区中的垃圾回收，主要用 **标记-清除算法** 进行垃圾回收

其回收机制是：

1. 标记阶段，对老生区进行扫描，标记**活动对象**和**垃圾数据**
2. 清理阶段，对老生区第二次扫描，清除垃圾数据

这种机制会产生 **内存碎片**，所以优化出了 **标记-整理算法**，其清理阶段是让所有活动对象向一端移动，然后直接清理端边界以外的内存

#### 增量标记

V8 引擎在执行垃圾回收算法时，JavaScript 会暂停执行，等待清理后再恢复执行，这叫做 **全停顿**（会引起页面卡顿现象）

为了降低老生代的垃圾回收而造成的卡顿，V8 将标记过程分为一个个的子标记过程，同时让垃圾回收标记和 JavaScript 应用逻辑交替进行，直到标记阶段完成，这就是 **增量标记算法**

## V8 引擎

V8 执行代码采用的是 **即时编译（JIT）**技术（字节码配合解释器和编译器）

### 执行代码流程

![V8执行代码](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/V8%E6%89%A7%E8%A1%8C%E4%BB%A3%E7%A0%81.png)

V8 在执行过程中既有 **解释器 Ignition**，又有 **编译器 TurboFan**

1. **生成抽象语法树（AST）和执行上下文**
   1. **分词（词法分析）**，将一行行的源码拆解成一个个 **token**（不可能再分的、最小的单个字符或字符串）
   2. **解析（语法分析）**，将上一步生成的 token 数据，根据语法规则转为 AST
2. **解释器根据 AST 生成字节码**（字节码就是介于 AST 和机器码之间的一种代码，但是与特定类型的机器码无关，字节码**需要通过解释器将其转换为机器码后才能执行**）
3. **执行代码**
   1. 第一次执行的字节码，解释器 Ignition 会**逐条解释执行**
   2. 如果发现有 **热点代码（一段代码被重复执行多次）**，后台的编译器 TurboFan 就会把该段热点的字节码编译为高效的机器码，再次执行该段代码只需执行编译后的机器码

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
