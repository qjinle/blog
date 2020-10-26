---
title: Vue
lang: zh-CN
---

## 基本使用

#### 组件通讯

#### 生命周期

#### 自定义 v-model

```js
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

#### $nextTick

将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。

```js
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

#### slot

#### 异步组件

#### keep-alive 缓存组件

```
缓存组件，不需要重复渲染

如多个静态 tab 页面的切换

优化性能
```

#### mixin

多个组件有相同的逻辑，抽离出来

## 原理

#### MVVM 模式 - 数据驱动视图

#### 双向绑定原理

`Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

```js
// 触发更新视图
function updateView() {
    console.log('视图更新')
}

// 重新定义数组原型
const oldArrayProperty = Array.prototype
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(methodName => {
    arrProto[methodName] = function () {
        updateView() // 触发视图更新
        oldArrayProperty[methodName].call(this, ...arguments)
        // Array.prototype.push.call(this, ...arguments)
    }
})

// 重新定义属性，监听起来
function defineReactive(target, key, value) {
    // 深度监听
    observer(value)

    // 核心 API
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                // 深度监听
                observer(newValue)

                // 设置新值
                // 注意，value 一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
                value = newValue

                // 触发更新视图
                updateView()
            }
        }
    })
}

// 监听对象属性
function observer(target) {
    if (typeof target !== 'object' || target === null) {
        // 不是对象或数组
        return target
    }

    if (Array.isArray(target)) {
        target.__proto__ = arrProto
    }

    // 重新定义各个属性（for in 也可以遍历数组）
    for (let key in target) {
        defineReactive(target, key, target[key])
    }
}

// 准备数据
const data = {
    name: 'zhangsan',
    age: 20,
    info: {
        address: '北京' // 需要深度监听
    },
    nums: [10, 20, 30]
}

// 监听数据
observer(data)

// 测试
// data.name = 'lisi'
// data.age = 21
// // console.log('age', data.age)
// data.x = '100' // 新增属性，监听不到 —— 所以有 Vue.set
// delete data.name // 删除属性，监听不到 —— 所有已 Vue.delete
// data.info.address = '上海' // 深度监听
data.nums.push(4) // 监听数组
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

