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

### 类型转换

强制：`parseInt`、`parseFloat`、`toString`

隐式：if、逻辑运算、==、+ 拼接字符串

### 变量提升

在 var 时代，**不管我们的变量声明是写在程序的哪个角落，最后都会被提到作用域的顶端去**，这就是变量提升

其原理即是在 **编译阶段**，JS 引擎会搜集所以变量声明，并提前让声明生效

```js
console.log(num) 
var num = 1

// 等同于

var num
console.log(num)
num = 1
```

在 ES6 引入的 let 和 const 即不存在变量提升，它们的声明生效时机和具体代码的执行时机保持一致

#### 暂时性死区

ES6 中有明确的规定：如果区块中存在 let 和 const 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域

假如我们尝试在声明前去使用这类变量，就会报错，报错的区域就叫做暂时性死区

```js
var me = 'xiuyan';

{
	me = 'bear'; // 暂时性死区
	let me;
}
```

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

### 类数组

- 它必须是一个对象
- 它有 length 属性

```js
const book = {
  0: 'how to read a book',
  1: 10,
  length: 2
}
```

#### 转化为数组

- Array 原型上的 `slice` 方法 --- 这个方法如果不传参数的话会返回原数组的一个拷贝，因此可以用此方法转换类数组到数组：

  ```js
  const arr = Array.prototype.slice.call(arrayLike);
  ```

- `Array.from` 方法 --- 这是 ES6 新增的一个数组方法，专门用来把类数组转为数组：

  ```js
  const arr = Array.from(arrayLike);
  ```

- 扩展运算符 --- 可以把类数组对象转换为数组，前提是这个类数组对象上部署了遍历器接口，比如函数内部的 arguments 变量（它也是类数组对象），就满足条件，可以用这种方法来转换：

  ```js
  function demo() {
    console.log('转换后的 arguments 对象：', [...arguments])
  } 
  demo(1, 2, 3, 4) // 转换后的 arguments 对象：[1, 2, 3, 4]
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

### 手写 call 函数

```js
Function.prototype.myCall = function (ctx, ...args) {
	ctx = arguments[0] || window
  // 把函数挂到目标对象上
  ctx.func = this
  // 执行函数，利用扩展运算符将数组展开
  const res = ctx.func(...args)
  // 删除 step1 中挂到目标对象上的函数
  delete ctx.func
  return res
}
```

### 手写 apply 函数

```js
Function.prototype.myApply = function (ctx, args) {
  ctx = arguments[0] || window
  // 把函数挂到目标对象上
  ctx.func = this
  let res
  // 执行函数，利用扩展运算符将数组展开
  if (args) {
    res = ctx.func(...args)
  } else {
    res = ctx.func()
  }
  // 删除 step1 中挂到目标对象上的函数
  delete ctx.func
  return res
}
```

### 手写 bind 函数

```javascript
Function.prototype.myBind = function (ctx, ...args) {
  ctx = arguments[0] || window
  // 记录当前函数
  const _this = this
  return function (...args2) {
    ctx.fnc = _this
    const res = args.length !== 0 ? ctx.fnc(...args) : ctx.fnc(...args2)
    delete ctx.fnc
    return res
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

## DOM

把 HTML 中各个标签定义出的元素以对象的形式包装起来，确保开发者可以通过 JS 脚本来操作 HTML

### 常用 API

DOM API常见操作，无非是增删改查

#### 获取 DOM 节点

```js
- getElementById // 按照 id 查询
- getElementsByTagName // 按照标签名查询
- getElementsByClassName // 按照类名查询
- querySelector // 按照 css 选择器查询第一个匹配
- querySelectorAll // 按照 css 选择器查询所以匹配
```

#### 创建 DOM 节点

```js
// 首先获取父节点
var container = document.getElementById('container')

// 创建新节点
var targetSpan = document.createElement('span')

// 设置 span 节点的内容
targetSpan.innerHTML = 'hello world'

// 把新创建的元素塞进父节点里去
container.appendChild(targetSpan) 
```

#### 删除 DOM 节点

```js
// 获取目标元素的父元素
var container = document.getElementById('container')
// 获取目标元素
var targetNode = document.getElementById('title')
// 删除目标元素
container.removeChild(targetNode)  
```

或者通过子节点数组来完成删除：

```js
// 获取目标元素的父元素
var container = document.getElementById('container')
// 获取目标元素
var targetNode = container.childNodes[1]
// 删除目标元素
container.removeChild(targetNode) 
```

#### 修改 DOM 元素

修改 DOM 元素这个动作可以分很多维度，比如说移动 DOM 元素的位置，修改 DOM 元素的属性等

##### 交换 DOM 元素位置

```js
// 获取父元素
var container = document.getElementById('container')   
 
// 获取两个需要被交换的元素
var title = document.getElementById('title')
var content = document.getElementById('content')

// 交换两个元素，把 content 置于 title 前面
container.insertBefore(content, title)
```

##### 修改 DOM 元素属性

可以使用 `getAttribute` 和 `setAttribute` 来获取和设置属性

```js
var title = document.getElementById('title')

// 获取 id 属性
var titleId = title.getAttribute('id')

// 修改 id 属性
title.setAttribute('id', 'anothorTitle')
```

此外，我们通过访问 DOM 对象中提供给我们的属性名，也可以达成查询并修改某一些属性的目的

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

JS 原型编程范式的核心思想就是 **利用实例来描述对象，用实例作为定义对象和继承的基础**，其体现就是 **基于原型链的继承**

### 原型

每个构造函数都拥有一个 `prototype` 属性，它指向构造函数的原型对象，这个原型对象中有一个 `construtor` 属性指回构造函数

每个实例都有一个 `__proto__` 属性，当我们使用构造函数去创建实例时，实例的 `__proto__` 属性就会指向构造函数的原型对象

```js
// 创建一个Dog构造函数
function Dog(name, age) {
  this.name = name
  this.age = age
}
Dog.prototype.eat = function() {
  console.log('eat')
}
// 使用Dog构造函数创建dog实例
const dog = new Dog('旺财', 3)
```

![](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/JS%E5%8E%9F%E5%9E%8B.jpg)

### 原型链

- 调用实例的属性 / 方法时，他首先搜索实例本身
- 当发现实例没有定义对应的属性 / 方法时，它会转而去搜索实例的原型对象
- 如果原型对象中也搜索不到，它就去搜索原型对象的原型对象

这个搜索的轨迹，就叫做原型链

```js
dog.eat()
dog.toString()
```

![](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/JS%E5%8E%9F%E5%9E%8B%E9%93%BE.jpg)

> 几乎所有 JavaScript 中的对象都是位于原型链顶端的 Object 的实例，除了 `Object.prototype`
>
> 当然，如果我们手动用 `Object.create(null)` 创建一个没有任何原型的对象，那它也不是 Object 的实例

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

#### 生命周期

每个执行上下文都有一个生命周期（全局执行上下文为例）：

1. **创建阶段** --- 执行上下文的初始化状态，此时一行代码都还没有执行，只是做了一些准备工作
   1. 创建全局对象（Window）
   2. 创建 this ，并让它指向全局对象
   3. 给变量和函数安排内存空间
   4. **默认给变量赋值为 undefined** 将函数声明放入内存
   5. 创建作用域链
2. **执行阶段** --- 逐行执行脚本里的代码
   1. 执行上下文在执行阶段里其实始终是处在一个 **动态**

函数执行上下文与全局执行上下文 **不同** 主要为：

- **创建的时机** --- 全局上下文在进入脚本之初就被创建，而函数上下文则是在函数调用时被创建
- **创建的频率** --- 全局上下文仅在代码刚开始被解释的时候创建一次；而函数上下文由脚本里函数调用的多少决定，理论上可以创建无数次
- **创建阶段的工作内容不完全相同** --- 函数上下文不会创建全局对象（Window），而是创建参数对象（arguments）；创建出的 this 不再死死指向全局对象，而是取决于该函数是如何被调用（如果它被一个引用对象调用，那么 this 就指向这个对象；否则，this 的值会被设置为全局对象或者 undefined）

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

#### 修改作用域

JS 的作用域是遵循**词法作用域模型**，即书写过程中根据定义位置来决定划分作用域

在代码书写的时候完成划分，作用域链沿着它**定义的位置**往外延伸

##### eval

eval 函数的入参是一个字符串，eval 在运行时改变了作用域的内容

当 eval 拿到一个字符串入参后，它会把这段字符串的内容当做一段 js 代码（不管它是不是一段 js 代码），插入自己被调用的那个位置

```js
function showName(str) {
  eval(str)
  console.log(name)
}

var name = 'xiuyan'
var str = 'var name = "BigBear"'

showName(str) // 输出 BigBear
```

##### with

with 做的事情其实就是**凭空创建出了一个新的作用域，此作用域查询规则依然遵循词法作用域的查询规则**

```js
function changeName(person) {
  with(person) {
    name = 'BigBear'
  }
}

var me = {
  name: 'xiuyan',
  career: 'coder',
  hobbies: ['coding', 'footbal']
}

var you = {
  career: 'product manager'
}

changeName(me)
changeName(you)
console.log(name) // 输出 'BigBear'
```

### 作用域链

每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，这条指向链条就是 **作用域链**

外部引用的指向是根据 **词法作用域** 定义的（词法作用域由代码中函数声明的位置来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执行过程中如何查找标识符）

所以一个变量的查找全过程如下：

![变量查找](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/%E5%8F%98%E9%87%8F%E6%9F%A5%E6%89%BE.png)

**所有的自由变量的查找，是在函数定义的地方，向上级作用域查找，不是在执行的地方！！！**

### 闭包

在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包

比如外部函数是 foo，那么这些变量的集合就称为 foo 函数的闭包

**影响：变量会常驻内存，得不到释放，内存泄露**

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

**产生闭包的流程：**

1. 当 JavaScript 引擎执行到 `foo` 函数时，首先会编译，并创建一个空执行上下文
2. 在编译过程中，遇到内部函数 `setName`，JavaScript 引擎还要对内部函数做一次快速的词法扫描，发现该内部函数引用了 `foo` 函数中的 `myName` 变量，由于是内部函数引用了外部函数的变量，所以 JavaScript 引擎判断这是一个闭包，于是在堆空间创建换一个 **closure(foo)** 的对象（这是一个内部对象，JavaScript 是无法访问的），用来保存 `myName` 变量
3. 接着继续扫描到 `getName` 方法时，发现该函数内部还引用变量 `test1`，于是 JavaScript 引擎又将 `test1` 添加到 **closure(foo)** 对象中。这时候堆中的 **closure(foo)** 对象中就包含了 `myName` 和 `test1` 两个变量了
4. 由于 `test2` 并没有被内部函数引用，所以 `test2` 依然保存在调用栈中

#### 闭包回收

如果引用闭包的函数是一个全局变量，那么闭包会一直存在直到页面关闭。（**内存泄漏**）

如果引用闭包的函数是个局部变量，等函数销毁后，在下次 JavaScript 引擎执行垃圾回收时，判断闭包这块内容如果已经不再被使用了，那么 JavaScript 引擎的垃圾回收器就会回收这块内存。

**如果该闭包会一直使用，那么它可以作为全局变量而存在；但如果使用频率不高，而且占用内存又比较大的话，那就尽量让它成为一个局部变量**。

#### 闭包实际应用

##### 模拟私有变量的实现

```js
const User = (function() {
    // 定义私有变量_password
    let _password

    class User {
        constructor (username, password) {
            // 初始化私有变量_password
            _password = password
            this.username = username
        }
       login() {
           // 这里我们增加一行 console，为了验证 login 里仍可以顺利拿到密码
           console.log(this.username, _password)
           // 使用 fetch 进行登录请求，同上，此处省略
       }
    }
    return User
})()

let user = new User('jinle', '123456')
```

##### 偏函数与柯里化

柯里化是把 **接受 n 个参数的 1 个函数** 改造为 **只接受 1个参数的 n 个互相嵌套的函数** 的过程

偏函数是固定函数的 **某一个或几个参数**，然后返回一个新的函数（这个函数用于接收剩下的参数）

```js
function generateName(prefix, type, itemName) {
    return prefix + type + itemName
}
var itemFullName = generateName('大卖网', '母婴', '奶瓶')

// 柯里化
function generateName(prefix) {  
    return function(type) {
        return function (itemName) {
            return prefix + type + itemName
        }    
    }
}
var itemFullName = generateName('大卖网')('母婴')('奶瓶')

// 偏函数
function generateName(prefix) {
    return function(type, itemName) {
        return prefix + type + itemName
    }
}
var itemFullName = generateName('大卖网')('母婴', '奶瓶')
```

### LHS/RHS

相对于赋值操作来说的两种变量查询方式

LHS --- 变量赋值或写入内存，强调写入动作，查询变量对应的内存空间

RHS --- 变量查找或者从内存读取，强调读取动作，查询变量内容

```js
name = 'jinle' // LHS
var myName = name // RHS
```

## 内存泄漏

该释放的变量（内存垃圾）没有被释放，仍然霸占着原有的内存不松手，导致内存占用不断攀高，带来性能恶化、系统崩溃等一系列问题，这种现象就叫内存泄漏

### 闭包导致

`unused` 是一个不会被使用的闭包，但和它共享同一个父级作用域的 `someMethod`，则是一个 **可抵达** 的闭包

`unused` 引用了 `originalThing`，这导致和它共享作用域的 `someMethod` 也间接地引用了 `originalThing`

结果就是 `someMethod` 产生了对 `originalThing` 的持续引用，`originalThing` 虽然没有任何意义和作用，却永远不会被回收

`originalThing` 每次 `setInterval` 都会改变一次指向（指向最近一次的 `theThing` 赋值结果），这导致无法被回收的无用 `originalThing` 越堆积越多，最终导致严重的内存泄漏

```js
var theThing = null;
var replaceThing = function () {
  var originalThing = theThing;
  var unused = function () {
    if (originalThing) // 'originalThing'的引用
      console.log("嘿嘿嘿");
  };
  theThing = {
    longStr: new Array(1000000).join('*'),
    someMethod: function () {
      console.log("哈哈哈");
    }
  };
};
setInterval(replaceThing, 1000);
```

### 全局变量导致

定义变量没有 var，则会被挂载到全局对象上

```js
function test() {
  me = 'jinle'
}
```

### 定时器导致

在 setInterval 和链式调用的 setTimeout 这两种场景下，定时器的工作可以说都是无穷无尽的

当定时器囊括的函数逻辑不再被需要、而我们又忘记手动清除定时器时，它们就会永远保持对内存的占用

```js
setInterval(function() {
    // 函数体
}, 1000);

setTimeout(function() {
  // 函数体
  setTimeout(arguments.callee, 1000);
}, 1000);
```

### DOM 导致

删除 DOM 后，myDiv 对 DOM 的引用依然存在，堆积多了就会存在内存隐患

```js
const myDiv = document.getElementById('myDiv')

function handleMyDiv() {
    // 一些与myDiv相关的逻辑
}

// 使用myDiv
handleMyDiv()

// 尝试”删除“ myDiv
document.body.removeChild(document.getElementById('myDiv'));
```

## this 机制

**this 是和执行上下文绑定的**，也就是说每个执行上下文中都有一个 this

**this 的指向是在调用时决定的，而不是在书写时决定的。这点和闭包恰恰相反**

多数情况下，this 指向调用它所在 **方法** 的那个 **对象**

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
3. **立即执行函数中 this 指向 window**
4. **setTimeout/setInterval 中传入的函数 this 指向 window**

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

在 JS 中，垃圾回收算法有两种 —— **引用计数法** 和 **标记清除法**

数据分别存储在调用栈和堆之中，其垃圾回收机制是不同的

### 引用计数法

**在引用计数法的机制下，内存中的每一个值都会对应一个引用计数。当垃圾收集器感知到某个值的引用计数为 0 时，就判断它 “没用” 了，随即这块内存就会被释放**

现代浏览器已经废除这种算法，因为其无法判断循环引用的场景

```js
function badCycle() {
  var cycleObj1 = {}
  var cycleObj2 = {}
  cycleObj1.target = cycleObj2
  cycleObj2.target = cycleObj1
}

badCycle() // 执行后，cycleObj1、cycleObj2 不会被清除
```

### 标记清除法

在标记清除算法中，一个变量是否被需要的判断标准，是 **它是否可抵达**

1. 标记阶段 --- 垃圾收集器会先找到根对象（在浏览器里根对象是 Window，在 Node 里根对象是 Global），从根对象出发，垃圾收集器会扫描所有可以通过根对象触及的变量，这些对象会被标记为 **可抵达**。
2. 清除阶段 --- 没有被标记为 **可抵达** 的变量，就会被认为是不需要的变量，这波变量会被清除

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

### Promise

Promise 对象是一个代理对象，它接受你传入的 executor（执行器）作为入参，允许你把异步任务的成功和失败分别绑定到对应的处理方法上去，其解决了 **回调地狱** 的问题

#### Promise 状态

Promise实例的状态是可以改变的，但它 **只允许被改变一次**

- pending 状态：不会触发 then 或 catch
- fulfilled 状态：会触发后续的 then 回调函数 
- rejected 状态：会触发后续的 catch 回调函数

**`.then()` 入参必须为函数，如不是会跳过该 `.then()`**

**`.then()` 一般正常返回 resolved 状态的 promise，`.then()` 里抛出错误，会返回 rejected 状态的 promise**

**`.catch()` 不抛出错误，会返回 resolved 状态的 promise，`.catch()` 抛出错误，会返回 rejected 状态的 promise**

#### Promise 方法

- **Promise.all(iterable)** --- 方法返回一个新的 promise 对象，该 promise 对象在 iterable 参数对象里所有的 promise 对象都成功的时候才会触发成功，一旦有任何一个 iterable 里面的 promise 对象失败则立即触发该 promise 对象的失败
- **Promise.race(iterable)** --- 当 iterable 参数里的任意一个子 promise 被成功或失败后，父 promise 马上也会用子 promise 的成功返回值或失败详情作为参数调用父 promise 绑定的相应处理函数，并返回该 promise 对象
- **Promise.reject(reason)** ---  返回一个状态为失败的 Promise 对象，并将给定的失败信息传递给对应的处理方法
- **Promise.resolve(value)** --- 返回一个 Promise 对象，但是这个对象的状态由你传入的 value 决定
  - 如果传入的是一个带有 then 方法的对象，返回的 Promise 对象的最终状态由 then 方法执行决定
  - 否则的话，返回的 Promise 对象状态为 fulfilled，同时这里的 value 会作为 then 方法中指定的 onfulfilled 的入参

#### 手写 Promise 加载图片

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

#### 手写 Promise

```js
function MyPromise(executor) {
  // value 记录异步任务成功的执行结果
  this.value = null;
  // reason 记录异步任务失败的原因
  this.reason = null;
  // status 记录当前状态，初始化是 pending
  this.status = 'pending';

  // 缓存两个队列，维护 resolved 和 rejected 各自对应的处理函数
  this.onResolvedQueue = [];
  this.onRejectedQueue = [];

  // 把 this 存下来，后面会用到
  var self = this;

  // 定义 resolve 函数
  function resolve(value) {
    // 如果不是 pending 状态，直接返回
    if (self.status !== 'pending') {
      return;
    }
    // 异步任务成功，把结果赋值给 value
    self.value = value;
    // 当前状态切换为 resolved
    self.status = 'resolved';
    // 用 setTimeout 延迟队列任务的执行
    setTimeout(function () {
      // 批量执行 resolved 队列里的任务
      self.onResolvedQueue.forEach(resolved => resolved(self.value));
    });
  }

  // 定义 reject 函数
  function reject(reason) {
    // 如果不是 pending 状态，直接返回
    if (self.status !== 'pending') {
      return;
    }
    // 异步任务失败，把结果赋值给 value
    self.reason = reason;
    // 当前状态切换为 rejected
    self.status = 'rejected';
    // 用 setTimeout 延迟队列任务的执行
    setTimeout(function () {
      // 批量执行 rejected 队列里的任务
      self.onRejectedQueue.forEach(rejected => rejected(self.reason));
    });
  }

  // 把 resolve 和 reject 能力赋予执行器
  executor(resolve, reject);
}

// then 方法接收两个函数作为入参（可选）
MyPromise.prototype.then = function (onResolved, onRejected) {

  // 注意，onResolved 和 onRejected必须是函数；如果不是，我们此处用一个透传来兜底
  if (typeof onResolved !== 'function') {
    onResolved = function (x) { return x };
  }
  if (typeof onRejected !== 'function') {
    onRejected = function (e) { throw e };
  }
  // 依然是保存 this
  var self = this;
  // 判断是否是 resolved 状态
  if (self.status === 'resolved') {
    // 如果是 执行对应的处理方法
    onResolved(self.value);
  } else if (self.status === 'rejected') {
    // 若是 rejected 状态，则执行 rejected 对应方法
    onRejected(self.reason);
  } else if (self.status === 'pending') {
    // 若是 pending 状态，则只对任务做入队处理
    self.onResolvedQueue.push(onResolved);
    self.onRejectedQueue.push(onRejected);
  }
  return this
};
```

### Generator

除了 Promise， ES2015 还为我们提供了 Generator

Generator 有利于异步的特性是，它可以在执行中被中断、然后等待一段时间再被我们唤醒。通过这个 **中断后唤醒** 的机制，我们可以把  Generator 看作是异步任务的容器，利用 `yield` 关键字，实现对异步任务的等待

### async/await

1. 执行 async 函数，返回的是 Promise 对象
2. await 相当于 Promise 的 then
3. try...catch 可以捕获异常，代替了 Promise 的 catch

**await 后面的代码相当于放在 callback 回调中执行，要等同步代码执行完才执行**

### event loop 运行机制

event loop执行过程：

1. 同步代码，一行一行放在 Call Stack (调用栈)中执行
2. 遇到异步，会先“记录”，等待时机（定时、网络请求等）
3. 时机到了，就移动到 Callback Queue（回调函数队列）
4. 如 Call Stack 为空（同步代码执行完）Event Loop开始工作
5. **每一次 call stack 结束，都会触发 DOM 渲染（不一定非得渲染，就是给一次 DOM 渲染的机会！！！），然后再进行 event loop**
6. 轮询查找 Callback Queue，如有则移动到 Call Stack执行
7. .然后继续轮询查找

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
