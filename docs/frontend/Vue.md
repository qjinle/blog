---
title: Vue
lang: zh-CN
---

## 基本使用

#### 实例

##### 属性

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

##### 方法

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

#### 组件通讯

##### 父子组件通信

父组件通过 `props` 传递数据给子组件。

父组件对子组件的自定义事件使用 `v-on:eventName=doSomething` 进行监听，当子组件内部触发了该自定义事件时（使用 `$emit('eventName')`），父组件执行 `doSomething`，从而实现子组件向父组件的通信。

##### 非父子组件通信

同个 vue 实例下使用 `vm.$on` 鉴定事件，`vm.$emit` 触发事件

#### 生命周期

- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeDestory
- destoryed

#### 自定义 v-model

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

#### slot

#### 异步组件

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

#### keep-alive 缓存组件

```
缓存组件，不需要重复渲染

如多个静态 tab 页面的切换

优化性能
```

#### mixin

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

#### 自定义指令

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

## 原理

#### MVVM 模式 - 数据驱动视图

#### 双向绑定原理

vue 数据双向绑定是通过数据劫持结合发布者-订阅者模式的方式来实现的。通过 `Object.defineProperty()` 来劫持各个属性的 `setter`，`getter`，再数据变动时发布消息给订阅者，触发响应的监听回调。

##### 实现过程

1、实现一个监听器 Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者。

2、实现一个订阅者 Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图。

3、实现一个解析器 Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器。

##### 实现 Observer

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

##### 实现 Watcher

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

##### 实现 Compile

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

##### 实现一个入口文件

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

`Object.defineProperty()` 缺点

- 深度监听，需要递归到底，一次计算量大
- 无法监听新增属性/删除属性（Vue.set Vue.delete）
- 无法监听原生数组，需要特殊处理

#### 虚拟DOM

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

#### 编译模板

模板到 render 函数，再到 vnode，再到渲染和更新

## 面试题

#### 1. v-show 和 v-if 的区别

```
v-show 通过 css 的 display 控制，频繁切换时使用

v-if 通过 vue 本身组件控制动态创建和销毁，切换一次后不再频繁切换时使用
```

#### 2. 为何 v-for 要用 key

```
diff 算法中通过 tag 和 key 来判断是否为 sameNode，减少渲染次数，提升渲染性能
```

#### 3. 描述 Vue 组件生命周期（有父子组件的情况）

#### 4. Vue 组件如何通讯

```
父子组件通信
父向子用 props，子向父用 $emit

自定义组件通信
event.$on event.$off event.$emit

vuex通信
```

#### 5. 描述组件渲染和更新的过程

```
- 初次渲染过程
  - 解析模板为 render 函数（vue-loader）
  - 触发响应式，监听 data 属性 getter setter
  - 执行 render 函数，生成 vnode，patch(elem,vnode)
  
- 更新过程
  - 修改 data，触发 setter
  - 重新执行 render 函数，生成 newVnode
  - patch(vnode,newVnode)
  
- 异步渲染
  - $nextTick
```

#### 6. 双向数据绑定 v-model 的实现原理

```
input 元素的 value = this.name
绑定 @input 事件 this.name = $event.target.value
data 更新触发 re-render
```

#### 7. computed 有何特点

```
缓存，data 不变不会重新计算
可以提高性能
```

#### 8. 为何 data 必须是一个函数

```
定义的 vue 文件是一个类，每次使用相当于对类实例化，data 数据以函数返回值形式定义，这样每复用一次组件，就会返回
一份新的 data，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据，类似形成闭包。

而单纯的写成对象形式，就使得所有组件实例共用了一份 data，就会造成一个变了全都会变的结果。
```

#### 9. ajax 应该放在哪个生命周期

```
mounted

js 是单线程的，ajax 异步获取数据，数据没渲染前需要排队

放在 mounted 之前没有用，只会让逻辑混乱
```

#### 10. 何时需要使用 beforeDsetory

```
解绑自定义事件 event.$off （内存泄漏问题）

清除定时器

解绑自定义 DOM 事件，如 window.scroll
```

#### 11. Vue为何是异步渲染，$nextTick何用

```
异步渲染以及合并 data 修改，以提高渲染性能

$nextTick 在 DOM 更新完后触发回调
```

#### 12. Vue 常见性能优化

```
合理使用 v-show 和 v-if
合理使用 computed
v-for 时加 key，以及避免和 v-if 同时使用
自定义事件、DOM 事件及时销毁
合理使用异步组件
合理使用 keep-alive
data 层级不要太深
使用 vue-loader 在开发环境做模板编译
```

