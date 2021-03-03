---
title: Vue
lang: zh-CN
---

## 基础

### 实例

#### 属性

`vm.$data`：Vue 实例观察的数据对象。等于 `vm.data`

`vm.$props`：当前组件接收到的 props 对象。

`vm.$el`：Vue 实例使用的根 DOM 元素。

`vm.$options`：用于当前 Vue 实例的初始化选项。

`vm.$parent`：父实例

`vm.$root`：当前组件树的根 Vue 实例。

`vm.$children`：当前实例的直接子组件。**需要注意 `$children` 并不保证顺序，也不是响应式的。**

`vm.$slots`：用来访问被插槽分发的内容。(例如：`v-slot:foo` 中的内容将会在 `vm.$slots.foo` 中被找到)

`vm.$scopedSlots`：用来访问作用域插槽。对于包括 `默认 slot` 在内的每一个插槽，该对象都包含一个返回相应 VNode 的函数。

`vm.$refs`：一个对象，持有注册过 `ref` 的所有 DOM 元素和组件实例。

`vm.$isServer`：当前 Vue 实例是否运行于服务器。用于服务端渲染

`vm.$attrs`：包含了父作用域中不作为 prop 被识别（且获取）的 attribute 绑定 (`class` 和 `style` 除外)。

`vm.$listeners`：包含了父作用域中的 (不含 `.native` 修饰器的) `v-on` 事件监听器。

#### 方法

`vm.$watch(expOrFn, callback, [options])`：观察 Vue 实例上的一个表达式或者一个函数计算结果的变化。回调函数得到的参数为新值和旧值。等同于 `watch` 监听器。`vm.$watch` 返回一个取消观察函数，用来停止触发回调。

`vm.$set(target, propertyName/index, value)`：向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。等同于 `Vue.set`。

`vm.$delete(target, propertyName/index)`：删除对象的 property，确保删除能触发更新视图。等同于 `Vue.delete`。

`vm.$on(event, callback)`：监听当前实例上的自定义事件。事件可以由 `vm.$emit` 触发。

`vm.$once(event, callback)`：监听一个自定义事件，但是只触发一次。一旦触发之后，监听器就会被移除。

`vm.$off([event, callback])`：移除自定义事件监听器。

> 如果没有提供参数，则移除所有的事件监听器
>
> 如果只提供了事件，则移除该事件所有的监听器
>
> 如果同时提供了事件与回调，则只移除这个回调的监听器

`vm.$emit(eventName, [...args])`：触发当前实例上的事件。

`vm.$mount(element/selector)`：Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，用此方法可以手动地挂载一个未挂载的实例。

`vm.$forceUpdate()`：迫使 Vue 实例重新渲染。**慎用，会影响性能**

`vm.$nextTick([callback])`：将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。等同于 `Vue.nextTick`。**可以提高性能**

```vue
<template>
  <div id="app">
    <ul ref="ul1">
        <li v-for="(item, index) in list" :key="index">
            {{item}}
        </li>
    </ul>
    <button @click="addItem">添加一项</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
      return {
        list: ['a', 'b', 'c']
      }
  },
  methods: {
    addItem() {
        this.list.push(`${Date.now()}`)
        this.list.push(`${Date.now()}`)
        this.list.push(`${Date.now()}`)

        // 1. 异步渲染，$nextTick 待 DOM 渲染完再回调
        // 2. 页面渲染时会将 data 的修改做整合，多次 data 修改只会渲染一次
        this.$nextTick(() => {
          // 获取 DOM 元素
          const ulElem = this.$refs.ul1
          // eslint-disable-next-line
          console.log( ulElem.childNodes.length )
        })
    }
  }
}
</script>
```

`vm.$destroy()`：完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。触发 `beforeDestroy` 和 `destroyed` 的钩子。

### 生命周期

从开始创建、初始化数据、编译模板、挂载 DOM、渲染→更新→渲染、销毁等一系列过程，我们称这是 Vue 的生命周期。总共分为三个阶段：初始化、运行中、销毁。

#### 流水线解释

##### 初始化

1. 先 new Vue 一个实例
2. 初始化事件和生命周期
3. 执行 beforeCreate 函数
4. 初始化 data，绑定事件等
5. 执行 created 函数
6. 编译模板，渲染为内存中的 DOM，还没挂载到页面中
7. 执行 beforeMount 函数
8. 将渲染好的 DOM 挂载到实例的 $el 上
9. 执行 mounted 函数，表示实例初始化完毕

##### 运行中

1. 实例的数据更改后，执行 beforeUpadte 函数
2. 虚拟 DOM 机制根据最新的 data 重新构建 DOM 与上一次的虚拟 DOM 树利用 diff 算法进行对比之后重新渲染
3. 执行 updated 函数

##### 销毁

1. 调用 $destroy 方法后，执行 beforeDestroy 函数，此时 data、方法都还可用
2. 执行 destroyed 函数

#### 钩子函数

- **beforeCreate** --- 此时数据还没挂载，**不要修改 data 数据**，无法访问到数据和 DOM，一般不做操作
- **created** --- data 数据挂载完成，修改数据不会触发其他钩子，可用于 ajax 请求初始化数据，不过 DOM 未挂载，组件仍不可见
- **beforeMount** --- 开始创建 VDOM，可以访问数据
- **mounted** --- VDOM 创建完毕并且已经挂在为真实 DOM
- **beforeUpdate** --- 组件更新前
- **updated** --- 组件更新后
- **beforeDestory** --- 一般在这里做一些善后工作，例如清除计时器、清除非指令绑定的事件等
- **destoryed**

### data

组件的 `data` 选项是一个函数。Vue 在创建新组件实例的过程中调用此函数。它应该返回一个对象，然后 Vue 会通过响应性系统将其包裹起来，并以 `$data` 的形式存储在组件实例中。

直接将不包含在 `data` 中的新 property 添加到组件实例是可行的。但由于该 property 不在背后的响应式 `$data` 对象内，所以 **Vue 的响应性系统** 不会自动跟踪它。

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.$data.count) // => 4
console.log(vm.count)       // => 4

// 修改 vm.count 的值也会更新 $data.count
vm.count = 5
console.log(vm.$data.count) // => 5

// 反之亦然
vm.$data.count = 6
console.log(vm.count) // => 6
```

#### 为何 data 必须是一个函数

定义的 Vue 文件是一个类，每次使用相当于对类实例化，`data` 数据以函数返回值形式定义，这样每复用一次组件，就会返回一份新的 `data`，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据，类似形成闭包。

而单纯的写成对象形式，就使得所有组件实例共用了一份 `data`，就会造成一个变了全都会变的结果。

### 计算属性和侦听器

#### computed

**计算属性** 用于处理任何包含响应式数据的复杂逻辑，简化模板，可以提高性能。

计算属性是基于响应式数据的反应依赖关系缓存的，计算属性只在相关响应式依赖发生改变时才会重新求值。

计算属性也可以提供 setter：

```js
computed: {
  fullName: {
    // getter
    get() {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set(newValue) {
      const names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```

#### watch

**侦听器** 用于需要在数据变化时执行异步或开销较大的操作

除了 watch 选项之外，你还可以使用命令式的 `vm.$watch`

```js
 watch: {
   value(newVal, oldVal) {
     if (newVal !== oldVal) {
       // do something ...
     }
   }
 }
```

### 条件渲染

#### v-if

`v-if` 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 truthy 值的时候被渲染。

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

#### v-show

另一个用于根据条件展示元素的选项是 `v-show` 指令。用法大致一样：

```html
<h1 v-show="ok">Hello!</h1>
```

不同的是带有 `v-show` 的元素始终会被渲染并保留在 DOM 中。`v-show` 只是简单地切换元素的 CSS property `display`。

> 注意：`v-show` 不支持 `<template>` 元素，也不支持 `v-else`

#### v-if and v-show

`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销

如果需要非常频繁地切换，则使用 `v-show` 较好

如果在运行时条件很少改变，则使用 `v-if` 较好

### 列表渲染

#### v-for

`v-for` 指令基于一个数组来渲染一个列表。`v-for` 指令需要使用 `item in items` 形式的特殊语法，其中 `items` 是源数据数组，而 `item` 则是被迭代的数组元素的别名。

```html
<div v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</div>
```

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

`v-for` 也可以遍历对象

```html
<div v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</div>
```

> 注意：使用 `v-for` 时最好给定一个 `key` 值，`diff` 算法中通过 `tag` 和 `key` 来判断是否为 `sameNode`，以此减少渲染次数，提升渲染性能

### 事件处理

我们可以使用 `v-on` 指令 (通常缩写为 `@` 符号) 来监听 DOM 事件，用法为 `v-on:click="methodName"` 或使用快捷方式 `@click="methodName"`。

#### 事件修饰符

- `.stop`：等同于 JavaScript 中的 `event.stopPropagation()`，防止事件冒泡
- `.prevent`：等同于 JavaScript 中的 `event.preventDefault()`，防止执行预设的行为（如果事件可取消，则取消该事件，而不停止事件的进一步传播）
- `.capture`：与事件冒泡的方向相反，事件捕获由外到内
- `.self`：只会触发自己范围内的事件，不包含子元素
- `.once`：只会触发一次
- `.passive`：防止不执行预设行为（触发默认行为）**（能够极大提升移动端性能）**

> 注意：使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生
>
> 注意：不要把 `.passive` 和 `.prevent` 一起使用，因为 `.prevent` 将会被忽略

#### 按键修饰符

在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 `v-on` 或者 `@` 在监听键盘事件时添加按键修饰符：

```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input @keyup.enter="submit" />
```

#### 系统修饰符

仅在按下相应按键时才触发鼠标或键盘事件的监听器。

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

`.exact` 修饰符允许你控制由精确的系统修饰符组合触发的事件。

```html
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick">A</button>
```

## 组件

### 组件通讯

#### 父子组件通信

父组件通过 `props` 传递数据给子组件。

父组件对子组件的自定义事件使用 `v-on:eventName=doSomething` 进行监听，当子组件内部触发了该自定义事件时（使用 `$emit('eventName')`），父组件执行 `doSomething`，从而实现子组件向父组件的通信。

#### 非父子组件通信

同个 vue 实例下使用 `vm.$on` 鉴定事件，`vm.$emit` 触发事件

## 自定义 v-model

```vue
<template>
    <!-- 例如：vue 颜色选择 -->
    <input type="text"
        :value="text1"
        @input="$emit('change1', $event.target.value)"
    >
    <!--
        1. 上面的 input 使用了 :value 而不是 v-model
        2. 上面的 change1 和 model.event1 要对应起来
        3. text1 属性对应起来
    -->
</template>

<script>
export default {
    model: {
        prop: 'text1', // 对应 props text1
        event: 'change1'
    },
    props: {
        text1: String,
        default() {
            return ''
        }
    }
}
</script>
```

## 异步组件

`defineAsyncComponent`

```js
const app = Vue.createApp({})

const AsyncComp = Vue.defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      resolve({
        template: '<div>I am async!</div>'
      })
    })
)

app.component('async-example', AsyncComp)
```

## keep-alive 缓存组件

keep-alive 是 Vue 提供的一个内置组件，用来对组件进行缓存

**在组件切换过程中将状态保留在内存中，防止重复渲染DOM**

组件包裹 keep-alive 后会多出两个生命周期：deactivated、actived

- **deactivated** --- 组件被换掉时触发，并且会被缓存到内存中
- **actived** --- 组件被切回来时触发，再去缓存里找这个组件

## mixin

多个组件有相同的逻辑，抽离出来

```js
// define a mixin object
const myMixin = {
  created() {
    this.hello()
  },
  methods: {
    hello() {
      console.log('hello from mixin!')
    }
  }
}

// define an app that uses this mixin
const app = Vue.createApp({
  mixins: [myMixin]
})

app.mount('#mixins-basic') // => "hello from mixin!"
```

## 自定义指令

```js
const app = Vue.createApp({})

// 注册
app.directive('my-directive', {
  // 指令是具有一组生命周期的钩子：
  // 在绑定元素的父组件挂载之前调用
  beforeMount() {},
  // 绑定元素的父组件挂载时调用
  mounted() {},
  // 在包含组件的 VNode 更新之前调用
  beforeUpdate() {},
  // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
  updated() {},
  // 在绑定元素的父组件卸载之前调用
  beforeUnmount() {},
  // 卸载绑定元素的父组件时调用
  unmounted() {}
})

// 注册 (功能指令)
app.directive('my-directive', () => {
  // 这将被作为 `mounted` 和 `updated` 调用
})

// getter, 如果已注册，则返回指令定义
const myDirective = app.directive('my-directive')
```

## 双向绑定原理

vue 数据双向绑定是通过数据劫持结合发布者-订阅者模式的方式来实现的。通过 `Object.defineProperty()` 来劫持各个属性的 `setter`，`getter`，再数据变动时发布消息给订阅者，触发响应的监听回调。

### 实现过程

1、实现一个监听器 Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者。

2、实现一个订阅者 Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图。

3、实现一个解析器 Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器。

#### 实现 Observer

```js
function defineReactive(data, key, val) {
    observe(val);
    let dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return val;
        },
        set: function (newVal) {
            val = newVal;
            console.log('属性被监听了', val);
            dep.notify();
        }
    })
}

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key]);
    })
}

// 消息订阅器
function Dep() {
    this.subs = [];
}
Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    notify: function () {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}
Dep.target = null;
```

#### 实现 Watcher

```js
class Watcher {
    constructor(vm, exp, cb) {
        this.cb = cb;
        this.vm = vm;
        this.exp = exp;
        this.value =  this.get();   // 将自己添加到订阅器 Dep
    }
    update() {
        this.run();
    }
    run() {
        let value = this.vm.data[this.exp];
        let oldVal = this.value;
        if(value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    }
    get() {
        Dep.target = this;  // 缓存自己
        let value = this.vm.data[this.exp]; // 强制执行监听器里的 get 函数
        Dep.target = null;  // 释放
        return value;
    }
}
```

#### 实现 Compile

```js
class Compile {
    constructor(el, vm) {
        this.vm = vm;
        this.el = document.querySelector(el);
        this.fragment = null;
        this.init();
    }
    init() {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.log('DOM 元素不存在');
        }
    }
    // 获取 dom 元素放入 fragment 片段
    nodeToFragment(el) {
        let fragment = document.createDocumentFragment();
        let child = el.firstChild;
        while (child) {
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    }
    // 遍历节点
    compileElement(el) {
        let childNodes = el.childNodes;
        // console.log(childNodes)
        Array.prototype.slice.call(childNodes).forEach(node => {
            let reg = /\{\{(.*)\}\}/;
            // 返回节点文本内容
            let text = node.textContent;

            // 判断是否是符合这种形式{{}}的指令
            if (this.isTextNode(node) && reg.test(text)) {
                // console.log(reg.exec(text)[1])
                this.compileText(node, reg.exec(text)[1]);
            }
            // 继续递归遍历子节点
            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node);
            }
        })
    }
    compileText(node, exp) {
        let self = this;
        let initText = this.vm[exp];
        // 将初始化的数据初始化到视图中
        this.updateText(node, initText);
        // 生成订阅器并绑定更新函数
        new Watcher(this.vm, exp, function (value) {
            self.updateText(node, value);
        });
    }
    // 更新文本
    updateText(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    }
    // 判断节点类型
    isTextNode(node) {
        return node.nodeType === 3;
    }
}
```

#### 实现一个入口文件

```js
class SelfVue {
  constructor(options) {
    this.data = options.data;
    this.el = options.el
    this.vm = this;
    this.init();
  }
  init() {
    this.proxyKeys(this.data);

    observe(this.data);

    new Compile(this.el, this.vm);
  }
  // 代理 data 的所有 key
  proxyKeys(data) {
    let self = this;
    Object.keys(data).forEach(key => {
      Object.defineProperty(self, key, {
        enumerable: false,
        configurable: true,
        get: function proxyGetter() {
          return self.data[key];
        },
        set: function proxySetter(newVal) {
          self.data[key] = newVal;
        }
      })
    })
  }
}
```

### 缺陷

`Object.defineProperty()` 缺点

- 深度监听，需要递归到底，一次计算量大
- 无法监听新增属性/删除属性（Vue.set Vue.delete）
- 无法监听原生数组，需要特殊处理

## 虚拟DOM

用 JS 模拟 DOM 结构

```html
<div id="div1" class="container">
  <p>vdom</p>
  <ul style="font-size: 20px">
    <li>a</li>
  </ul>
</div>
```

```js
{
  tag: 'div',
  props: {
    id: 'div1',
    className: 'container'
  },
  children: [
    {
      tag: 'p',
      children: 'vdom'
    },
    {
      tag: 'ul',
      props: {style: 'font-size: 20px'},
      children: [
        {
          tag: 'li',
          children: 'a'
        }
      ]
    }
  ]
}
```

**diff 算法 **是 vdom 中最核心、最关键的部分

- 只比较同一层级，不跨级比较
- tag 不相同，则直接删掉重建，不再深度比较
- tag 和 key，两者都相同，则认为是相同结点，不再深度比较

## nextTick

### 使用

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM

```js
// 修改数据
vm.msg = 'Hello'
// DOM 还没有更新
Vue.nextTick(function () {
  // DOM 更新了
})

// 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
Vue.nextTick()
  .then(function () {
    // DOM 更新了
  })
```

### 原理

当 Vue 数据更新发生时

1. Vue 不会立刻给你执行视图层的更新动作
2. 而是先把这个更新动作存在 **异步更新队列**
3. 即使一个 watcher 被多次触发，它也只会被推进异步更新队列一次
4. 在同步逻辑执行完之后，watcher 对应的就是其依赖属性的最新的值
5. 最后，Vue 会把异步更新队列的动作集体出队，批量更新

这个实现异步任务派发的接口，就叫做 **nextTick**

#### 逻辑统筹者——nextTick

```js
// 暴露 nextTick 方法
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  // 维护一个异步更新队列
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  // pending 是一个锁，确保任务执行有序、不重复
  if (!pending) {
    pending = true
    timerFunc()
  }
  // 兜底逻辑，处理入参不是回调的情况
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
// callbacks - 异步更新队列
// pending - 锁
// timerFunc - 异步任务的派发函数
```

1. nextTick 的入参是一个回调函数，这个回调函数就是一个任务
2. 每次 nextTick 接收一个任务，它不会立刻去执行它，而是把它 push 进 callbacks 这个异步更新队列里
3. 检查 pending 的值
   1. 为 false 时，意味着 **现在还没有一个异步更新队列被派发出去**，直接调用 timerFunc，把当前维护的这个异步队列给派发出去
   2. 为 true 时，意味着现在异步更新队列（callbacks）已经被 **派发** 出去了，这时只需要往队列添加任务就可以了

#### 异步任务派发器——timerFunc

```js
// 用来派发异步任务的函数
let timerFunc

// 下面这一段逻辑，是根据浏览器的不同，选择不同的 api 来派发异步任务
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

不同的 timerFunc 之间有一个共性，它们都在派发 flushCallbacks 这个函数

timerFunc 按照优先级分别可能通过：Promise.then、MutationObserver、setImmediate、setTimeout 四种途径派发

> 优先微任务派发从效率上来说更优秀，宏任务派发会导致我们的界面更新 **延迟一个事件循环**

#### 任务执行器——flushCallbacks

```js
function flushCallbacks () {
  // 把“锁”打开
  pending = false
  // 创造 callbacks 副本，避免副作用
  const copies = callbacks.slice(0)
  // callbacks 队列置空
  callbacks.length = 0
  // 逐个执行异步任务
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

负责把 callbacks 里的任务逐个取出，依次执行

## MVVM

- View 层：视图层，对应到 `<template>` 标签的内容
- VM 层：View-Model，对应到 Vue 实例
  - 是 View 和 Model 间的媒介
  - 当用户操作通过 View 修改 View-Model 层的数据后，View-Model 会去修改 Model，然后再反过来把修改后的数据映射到 View 层上去
- Model 层： 模型层，其实就是数据层
  - 对应到 Vue 中的数据
  - 这个数据并非一个固定的实体，它可以代指 data 属性，也可以代指 Vuex 提供的数据，总之，它是页面所依赖的 JS 数据对象

MVVM 模型的关键，在于 View 的变化会直接映射在 ViewModel 中，开发者开发 View 中的显示逻辑和 View-Model 中调用 model 的业务逻辑可以隔离的非常好，不需要在 View 中还去维护一块和 ViewModel 间的逻辑

## Vue-Router

- hash: --- 使用 URL hash 值来作路由。支持所有浏览器
- history --- 需要 HTML5 History API 和服务器配置结合。对浏览器版本有要求，不支持低版本浏览器
- abstract --- 支持所有 JavaScript 运行环境。如果当前环境没有浏览器 API，路由会自动进入这个模式

