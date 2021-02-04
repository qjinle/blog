---
title: React
lang: zh-CN
---

## 理解React

声明式开发、组件化开发、单向数据流、视图层框架、函数式编程

#### 性能优化

1. 函数绑定 this 放在 constructor 里面
2. setState 异步函数，合并多次处理
3. 虚拟 DOM
4. shouldComponentUpdate 减少不必要的 render 组件渲染

## 组件

### props

#### 类型检查 PropTypes

PropTypes 进行类型检查，defaultProps 确保父组件没有指定值时有一个默认值，详细参考官方文档

```jsx
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  // 可以在任何 PropTypes 属性后面加上 isRequired ，确保这个 prop 没有被提供时，会打印警告信息。
  name: PropTypes.string.isRequired,
  // 一个对象可以是几种类型中的任意一个类型
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  // 可以指定一个数组由某一类型的元素组成
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
  // 可以指定一个对象由某一类型的值组成
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),
  // 可以指定一个对象由特定的类型值组成
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  })
};

// 指定 props 的默认值：
Greeting.defaultProps = {
  name: 'Stranger'
};
```

### state

组件 state 一般代表一个组件 UI 呈现的完整状态集，数据一般为：

1. 渲染组件时使用到的数据来源
2. 用作组件 UI 展现的判断依据

> 如果变量通过其他状态或属性计算得到，不推荐定义为一个 state
>
> 如果变量在 render 中没有使用，不推荐定义为一个 state，更适合为一个普通属性

#### 修改 state 的一些坑

state 直接修改不会触发 render，正确用法为 **setState()**

setState() 接受一个对象或者函数作为参数

```jsx
this.setState({
  name: 'Jinle'
})

this.setState(() => ({
  name: 'Jinle'
}))
```

调用 setState() 时不会立即更新，setState() 只是把修改状态放入一个队列，等 React 优化真正的执行时机，出于性能考虑，会合并多次 setState()

如果此次 setState() 依赖前一次 setState() 的参数：

```jsx
this.setState((preState, props) => ({
	counter: preState.quantity + 1;
}))
// preState 当前状态的前一状态（本次组件修改前的状态）
// props 当前最新属性
```

##### 状态类型是数组

1. 使用 preState、concat 创建新数

   ```jsx
   this.setState(preState => ({
   	books: preState.books.concat(['React']);
   }))
   ```

2. ES6 扩展语法

   ```jsx
   this.setState(preState => ({
   	books: [...preState.books, 'React'];
   }))
   ```

截取部分元素可用 slice，过滤可用 filter

> 不使用 push、pop、shift、unshift、splice 等修改数组类型的状态

##### 状态类型是普通对象

1. 使用 Object.assign

   ```jsx
   this.setState(preState => ({
   	owner: Object.assign({}, preState.owner, {name: 'Jinle'})
   }))
   ```

2. ES6 扩展语法

   ```jsx
   this.setState(preState => ({
   	owner: {...preState.owner, name: 'Jinle'}
   }))
   ```

### props 和 state 

props 和 state 变化都会触发组件重新渲染（render 函数）

props 和 state 更新都是异步的

props 对组件来说时只读的，通过父组件传值，只能在父组件修改

state 是组件内部维护的状态，是可变的

### 组件通信

#### 父子组件通信

父组件通过 props 传递数据给子组件

子组件通过调用父组件传递的 props 上的函数，实现向父组件通信

#### 非父子组件通信

可以借助 context（慎用，会使数据流混乱），情况复杂用 Redux

##### context

Context 设计目的是为了共享那些对于一个组件树而言是**全局**的数据，例如当前认证的用户、主题或首选语言。可以避免通过中间组件传递 props

### 组件和服务端通信

一般在 componentWillMount 和 componentDidMount 中发送 ajax 请求通信

componentDidMount 会更优选：

1. componentDidMount 保证获取数据时组件以及处于挂载状态，操作 DOM 比较安全
2. 组件服务端渲染时，componentDidMount 调用一次，componentWillMount 调用两次，可以避免多余的数据请求

在组件更新阶段，组件以 props 中某个属性作为请求参数时，可用 componentWillReceiveProps 来与服务端通信，通过判断新老 props 是否相同来判断是否发送请求

### UI组件和容器组件

#### UI组件

- 只负责UI的呈现，没有任何业务逻辑
- 没有State，参数由Props提供
- 用无状态（函数）组件会提高性能

#### 容器组件

- 不负责UI的呈现，负责处理业务逻辑
- 带有内部状态

## Context

Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props

```jsx
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（“light”为默认值）。
const ThemeContext = React.createContext('light');
class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

> Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这**会使得组件的复用性变差**。

### React.createContext

```jsx
const MyContext = React.createContext(defaultValue);
```

**创建一个 Context 对象**，当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 context 值

当组件所处的树中没有匹配到 Provider 时，其 `defaultValue` 参数才会生效

### Context.Provider

```jsx
<MyContext.Provider value={/* 某个值 */}>
```

Provider 接收一个 `value` 属性，传递给消费组件

当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染

### Context.Consumer

```jsx
import {ThemeContext} from './theme-context';
function ThemeTogglerButton() {
  // Theme Toggler 按钮不仅仅只获取 theme 值，它也从 context 中获取到一个 toggleTheme 函数
  return (
    <ThemeContext.Consumer>
      {({theme, toggleTheme}) => (
        <button onClick={toggleTheme} style={{backgroundColor: theme.background}}>
					Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}
```

一个 React 组件可以订阅 context 的变更

这种方法需要一个函数作为子元素，这个函数接收当前的 context 值，并返回一个 React 节点

## Refs

何时使用 refs：

- 管理焦点，文本选择或媒体播放
- 触发强制动画
- 集成第三方 DOM 库

```jsx
class App extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick = () => {
    this.input.current.focus()
  }

  render() {
    return (
      <div>
      	// 绑定
        <input type="text" ref={(input) => {this.input = input}} />
        <button onClick={this.handleClick}>点我</button>
      </div>
    )
  }
}
```

## Fragments

Fragments 允许将子列表分组，而无需向 DOM 添加额外节点

```jsx
class TodoList extends Component {
  render() {
    return (
      <React.Fragment>
        <div><input /><button>提交</button></div>
        <ul>
          <li>a</li>
          <li>b</li>
        </ul>
      </React.Fragment>
    )
  }
}
```

`key` 是唯一可以传递给 `Fragment` 的属性

### 短语法

可以用 `<> </>` 来声明 Fragments

```jsx
class TodoList extends Component {
  render() {
    return (
      <>
        <div><input /><button>提交</button></div>
        <ul>
          <li>a</li>
          <li>b</li>
        </ul>
      </>
    )
  }
}
```

## 事件处理

事件命名采用驼峰命名法（onclick 写成 onClick）

### this 指向

ES6 class 并不会为方法自动绑定 this 到当前对象

##### 使用箭头函数

直接在 React 元素中采用箭头函数定义事件的处理函数，如

```jsx
render() {
  return (
  	<button onClick={(event)=>{console.log(this.state.number)}}>
  )
}
```

或者把逻辑封装成组件的一个方法

```jsx
handleClick(event) {
  ...
}
render() {
  return (
  	<button onClick={(event)=>{this.handleClick(event)}}>
  )
}
```

这种方法最大的问题是，每次 `render` 都会创建一个心得事件处理函数，带来额外的性能开销。

##### 使用组件方法

直接将组件的方法赋给元素的事件属性，同时在类构造函数中，将方法的 this 绑定当前对象。

```jsx
class MyComponent extends React.Component {
	constructor(props) {
		...
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		...
	}
	render() {
  	return (
  		<button onClick={this.handleClick}>
      {
      	// <button onClick={this.handleClick.bind(this)}>
      }
  	)
	}
}
```

##### 属性初始化语法

ES7 的 property initializers 会自动为 class 中定义的方法绑定 this

```jsx
class MyComponent extends React.Component {
	constructor(props) {
		...
	}
  // 实际上用了箭头函数
	handleClick = () => {
    ...
  }
	render() {
  	return (
  		<button onClick={this.handleClick}>
  	)
	}
}
```

## Hook

Hook 是一些可以让你在函数组件里 **钩入** React state 及生命周期等特性的函数

Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React

### useState

```tsx
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### useEffect

 React 组件中执行过数据获取、订阅或者手动修改过 DOM 等操作成为 **副作用**

`useEffect` 就是一个 **Effect Hook**，给函数组件增加了操作副作用的能力

默认情况下，React 会在每次渲染后调用副作用函数，**包括第一次渲染的时候**

```tsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  
  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

#### 清除机制

副作用函数还可以通过返回一个函数来指定如何 **清除** 副作用，React 会在组件卸载的时候执行清除操作，它会在调用一个新的 effect 之前对前一个 effect 进行清理

```tsx
import React, { useState, useEffect } from 'react'

const MouseTracker: React.FC = () => {
  const [ positions, setPositions ] = useState({x: 0, y: 0})
  function updateMouse(e: MouseEvent) {
    setPositions({ x: e.clientX, y: e.clientY })
  }
  useEffect(() => {
    document.addEventListener('click', updateMouse)
    return () => {
      document.removeEventListener('click', updateMouse)
    }
  })
  return (
    <p>X: {positions.x}, Y : {positions.y}</p>
  )
}
```

#### 指定更新

在某些情况下，每次渲染后都执行清理或者执行 effect 可能会导致性能问题

如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React **跳过** 对 effect 的调用，只要传递数组作为 `useEffect` 的第二个可选参数即可

```tsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

如果想执行只运行一次的 effect（**仅在组件挂载和卸载时执行**），可以传递一个 **空数组** 作为第二个参数

### useRef

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数。返回的 ref 对象在组件的整个生命周期内保持不变

**当 ref 对象内容发生变化时，`useRef` 并不会通知你，变更 `.current` 属性不会引发组件重新渲染**

```tsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

### useContext

```jsx
const value = useContext(MyContext);
```

接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值

当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定

### 自定义 Hook

通过自定义 Hook，可以将组件逻辑提取到可重用的函数中

**自定义 Hook 是一个函数，其名称以 “`use`” 开头，函数内部可以调用其他的 Hook**

```tsx
import React, { useState, useEffect } from 'react'

const useMousePosition = () => {
  const [ positions, setPositions ] = useState({x: 0, y: 0})
  function updateMouse(e: MouseEvent) {
    setPositions({ x: e.clientX, y: e.clientY })
  }
  useEffect(() => {
    document.addEventListener('mousemove', updateMouse)
    return () => {
      document.removeEventListener('mousemove', updateMouse)
    }
  }, [])
  return positions
}
```

## 组件生命周期

组件从创建到销毁成为生命周期，分为三个阶段：挂载、更新、卸载。

类组件才有生命周期方法，函数组件没有生命周期方法。

### 挂载阶段

此阶段组件创建、初始化，并挂载到 DOM 中。

##### constructor

组件使用 ES6 `class` 构造时先调用的方法，一般用于初始化组件的 `state` 以及绑定事件处理方法等。

##### componentWillMount（即将淘汰）

被挂载到 DOM 前调用（只有一次），比较少用。方法中调用 `this.setState` 不会引起组件渲染。

##### render（必要的）

根据组件的 `props` 和 `state` 返回一个 React 元素，用于描述组件的 UI（注意：render 不负责渲染，渲染由 React 自身负责）。`render` 是一个纯函数，不能调用 `this.setState`，这会改变组件状态。

##### componentDidMount

组件被挂载到 DOM 后调用（只有一次），可以获取 DOM 节点，常用于依赖 DOM 节点的操作，向服务器发起请求等。方法中调用 `this.setState` 会引起组件渲染。

### 更新阶段

组件挂在后，`props` 和 `state` 可以引起组件更新，`props` 由渲染该组件的父组件引起（调用 `render` 方法），`state` 是由 `this.setState` 来引起更新的。

##### componentWillReceiveProps(nextProps)（即将淘汰）

此方法在 `props` 引起组件更新时被调用，`this.setState` 不会触发该方法。

`nextProps` 时父组件传递给当前组件的新的 `props`，可能与当前组件的 `props` 相等，因此往往需要比较  `nextProps` 和 `this.props` 来决定是否执行 `props` 发生变化后的逻辑。

#####  shouldComponentUpdate(nextProps, nextState)

此方法决定组件是否继续执行更新过程。方法返回 `true` 则继续，放回 `false` 则停止更新过程。

一般通过比较 `nextProps`、`nextState` 和当前组件的 `props`、`state` 来决定返回值。

可以减少组件不必要的渲染，从而优化性能。

##### componentWillUpdate(nextProps, nextState)（即将淘汰）

此方法在 `render` 之前调用，少用。

##### render

与上相同

##### componentDidUpdate(prevProps, prevState)

组件更新后调用，常用于操作 DOM。

`prevProps`、`prevState` 是组件更新前的 `props` 和 `state`。

> 1、`componentWillReceiveProps` 中调用 `this.setState`，只有在组件 `render` 之后才会指向更新后的 `state`。
>
> 2、`shouldComponentUpdate` 和 `componentWillUpdate` 中不能调用 `this.setState`。

### 卸载阶段

组件从 DOM 被卸载的过程

##### componentWillUnmount

常用于执行一些清理工作，如清除定时器，清除手动创建的 DOM 元素，以免内存泄漏。

## 虚拟 DOM

虚拟 DOM 就是一个 JS 对象，用它来描述真实 DOM

```jsx
<div id='abc'><span>hello world</span></div>
[
  'div',
  {
    id: 'abc'
  },
  [
    'span',
    {},
    'hello world'
  ]
]
```

##### 为什么虚拟 DOM 会极大提升性能？

因为虚拟 DOM 减少对真实 DOM 的创建和对比，使用了 JS 对象进行操作

### 流水解释虚拟 DOM 原理

1. state 数据
2. jsx 模板
3. 数据 + 模板 结合，生成虚拟 DOM
4. 用虚拟 DOM 生成真实 DOM，渲染挂载显示
5. state 变化
6. 数据 + 模板 生成新的虚拟 DOM**（极大提升性能）**
7. 使用 **diff 算法 **比较原始虚拟 DOM 和新的虚拟 DOM 的区别，找到区别内容**（极大提升性能）**
8. 直接操作 DOM，改变区别内容

### diff 策略

1. Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
2. 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
3. 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。

基于策略一，React 对树的算法进行了简洁明了的优化，即对树进行分层比较，两棵树只会对同一层次的节点进行比较。

React 通过 updateDepth 对 Virtual DOM 树进行层级控制，只会对相同颜色方框内的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。

## 表单

### 受控组件

如果一个表单元素的值是由 React 来管理的，那么它就是一个受控组件。

##### 文本框

文本框包含类型为 `text` 的 `input` 元素和 `textarea` 元素。

受控原理为，通过表单元素的 `value` 设置表单元素的值，通过 `onChange` 事件监听变化，并同步到 `state` 中。

```jsx
class MyComponent extends React.Component {
  construtor(props) {
    ...
    this.state = {
      name: ''
    }
  }
  handleChange(event) {
    const target = event.target;
    this.setState({
      name: target.value 
    });
  }
  render() {
    return (
      <input type='text' value={this.state.name} onChange={this.handleChange} />
    )
  }
}
```

##### 列表

React 中 `select` 的处理方式是通过在 `select` 上定义 `value` 属性来决定哪一个 `option` 元素属于选中状态。

```jsx
render() {
	return (
		<select value={this.state.value} onChange={this.handleChange}>
    	<option value='...'></option>
      <option value='...'></option>
      <option value='...'></option>
    </select>
  )
}
```

##### 复选框和单选框

复选框是类型为 `checkbox` 的 `input` 元素，单选框是类型为 `redio` 的 `input` 元素。React 控制的是 `checked` 属性。

```jsx
render() {
	return (
		<input 
    	type='checkbox'
      name='react'
      value='react'
      checked={this.state.react}
      onChange={this.handleChange}
    />
  )
}
```

### 非受控组件

非受控组件表单元素的状态由表单元素自己管理，可以使用 `ref` 来获取属性的值。

```jsx
render() {
	return (
		<from onSubmit={this.handleSubmit}>
    	<input defaultValue='something' type='text' ref={(input) => this.input=input} />
    </from>
  )
}
```

`ref` 是一个函数，函数中把 `input` 赋值给了 `this.input`

使用非受控组件设置默认值时用 `defaultValue` 设置，单选框复选框可以用 `defaultChecked` 设置

非受控组件破坏了 React 对组件状态的管理，建议尽量不使用

## 错误处理

React 16 提供了一种友好的错误处理方法——错误边界，定义了一个 `componentDidCatch` 的方法用于处理错误。

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(err, info) {
    this.setState({ hasError: true });
    console.log(err, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>error</h1>;
    }
    return this.props.children;
  }
}
```

## portals 弹窗

React 16 的 portals 特性让我们可以把组件渲染到当前组件树以外的 DOM 节点上，其实现依赖一个新的 API：`ReactDOM.createPortal(child, container)`。

`child`：可以被渲染的 React 节点

`container`：一个 DOM 元素，child 将挂载在这

```jsx
class Modal extends React.Component {
  constructor(props) {
    super(props);
    // 根节点下创建 div
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  }

  componentWillUnmount() {
    document.body.removeChild(this.container);
  }

  render() {
    return ReactDOM.createPortal(
      <div className='modal'>
        <span className='close' onClick={this.props.onClose}>
          &times;
        </span>
        <div className='content'>
          {this.props.children}
        </div>
      </div>,
      this.container
    )
  }
}
```

## Redux

### 使用

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import TodoList from './TodoList.js';
import stroe from './store/index';

ReactDOM.render(
  	// 把store注入进组件
	<Provider store={store}>
  	<TodoList />
  </Provider>,
  document.getElementById('root')
)
```

```jsx
// todolist.js
import React, { Component } from 'react';
import { connect } from 'react-redux';

class TodoList extends Component {
  render() {
    return (
      <div>
        <input
          value={this.props.inputValue}
          onChange={this.props.changeInputValue}
        />
      </div>
    )
  }
}

// 把状态树中的状态映射进组件的props
const mapStateToProps = (state) => {
  return {
    inputValue: state.inputValue
  }
}

// 把Dispatch方法映射为组件中props的方法
const mapDispatchToProps = (dispatch) => {
  return {
    changeInputValue(e) {
      const action = {
        type: 'change_input_value',
        value: e.target.value
      }
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

```jsx
// store.js
import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(
  reducer,
  // chrome Redux
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
```

```jsx
// reducer.js
const defaultState = {
  inputValue: ''
};

export default (state = defaultState, action) => {
  if(action.type === 'change_input_value') {
    const newState = JSON.parse(JSON.stringify(state));
    newState.inputValue = action.value;
    return newState;
  }
  return state;
}
```

`createStore(reducer)`：创建 store

`store.getState()`：获取 store 的值

`store.dispatch(action)`：分发 action。这是触发 state 变化的惟一途径。

`store.subscribe(listener)`：添加一个变化监听器。每当 dispatch action 的时候就会执行

### 工作流

React Components ==> Action Creators ==> Store ==> Reducers ==> Store ==> React Components

1. React Components 传递给 Action Creators 要获取的数据（Action Creators 就是一个描述“发生了什么”的普通对象）
2. Action Creators 创建一个指令 dispatch 告诉 store 要获取的数据
3. store 询问 Reducers 如何获取数据
4. Reducers 告诉 store 如何获取数据
5. store 获取数据后返回给 React Components

### 拆分 reducer

使用 combineReducers，合并 reducer ，方便代码维护

```js
import { combineReducers } from 'redux';
import headerReducer from '../common/header/store/reducer';

export default combineReducers({
  header: headerReducer
})
```

