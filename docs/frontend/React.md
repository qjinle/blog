---
title: React
lang: zh-CN
---

#### props 和 state 

props 和 state 变化都会触发组件重新渲染

props 和 state 更新都是异步的

props 对组件来说时只读的，通过父组件传值，只能在父组件修改

state 是组件内部维护的状态，是可变的

## 组件

### 组件 state

组件 state 一般代表一个组件 UI 呈现的完整状态集，数据一般为：

1. 渲染组件时使用到的数据来源
2. 用作组件 UI 展现的判断依据

> 如果变量通过其他状态或属性计算得到，不推荐定义为一个 state
>
> 如果变量在 render 中没有使用，不推荐定义为一个 state，更适合为一个普通属性

#### 修改 state 的一些坑

state 直接修改不会触发 render，正确用法为 setState()

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

### 组件通信

#### 父子组件通信

父组件通过 props 传递数据给子组件

子组件通过调用父组件传递的 props 上的函数，实现向父组件通信

#### 非父子组件通信

可以借助 context（慎用，会使数据流混乱），情况复杂用 Redux

##### context

Context 设计目的是为了共享那些对于一个组件树而言是**全局**的数据，例如当前认证的用户、主题或首选语言。可以避免通过中间组件传递 props。

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

### 组件和服务端通信

一般在 componentWillMount 和 componentDidMount 中发送 ajax 请求通信

componentDidMount 会更优选：

1. componentDidMount 保证获取数据时组件以及处于挂载状态，操作 DOM 比较安全
2. 组件服务端渲染时，componentDidMount 调用一次，componentWillMount 调用两次，可以避免多余的数据请求

在组件更新阶段，组件以 props 中某个属性作为请求参数时，可用 componentWillReceiveProps 来与服务端通信，通过判断新老 props 是否相同来判断是否发送请求

## Refs

何时使用 refs：

- 管理焦点，文本选择或媒体播放
- 触发强制动画
- 集成第三方 DOM 库

```jsx
class App extends React.Component {
    constructor(props) {
        super(props)
        // 创建
        this.myRef = React.createRef()
    }

    handleClick = () => {
        this.myRef.current.focus()
    }

    render() {
        return (
            <div>
            	// 绑定
                <input type="text" ref={this.myRef} />
                <button onClick={this.handleClick}>点我</button>
            </div>
        )
    }
}
```

## 事件处理

事件命名采用驼峰命名法（onclick 写成 onClick）

#### this 指向

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

## 组件生命周期

组件从创建到销毁成为生命周期，分为三个阶段：挂载、更新、卸载。

类组件才有生命周期方法，函数组件没有生命周期方法。

### 挂载阶段

此阶段组件创建、初始化，并挂载到 DOM 中。

##### constructor

组件使用 ES6 `class` 构造时先调用的方法，一般用于初始化组件的 `state` 以及绑定事件处理方法等。

##### componentWillMount

被挂载到 DOM 前调用（只有一次），比较少用。方法中调用 `this.setState` 不会引起组件渲染。

##### render（必要的）

根据组件的 `props` 和 `state` 返回一个 React 元素，用于描述组件的 UI（注意：render 不负责渲染，渲染由 React 自身负责）。`render` 是一个纯函数，不能调用 `this.setState`，这会改变组件状态。

##### componentDidMount

组件被挂载到 DOM 后调用（只有一次），可以获取 DOM 节点，常用于依赖 DOM 节点的操作，向服务器发起请求等。方法中调用 `this.setState` 会引起组件渲染。

### 更新阶段

组件挂在后，`props` 和 `state` 可以引起组件更新，`props` 由渲染该组件的父组件引起（调用 `render` 方法），`state` 是由 `this.setState` 来引起更新的。

##### componentWillReceiveProps(nextProps)

此方法在 `props` 引起组件更新时被调用，`this.setState` 不会触发该方法。

`nextProps` 时父组件传递给当前组件的新的 `props`，可能与当前组件的 `props` 相等，因此往往需要比较  `nextProps` 和 `this.props` 来决定是否执行 `props` 发生变化后的逻辑。

#####  shouldComponentUpdate(nextProps, nextState)

此方法决定组件是否继续执行更新过程。方法返回 `true` 则继续，放回 `false` 则停止更新过程。一般通过比较 `nextProps`、`nextState` 和当前组件的 `props`、`state` 来决定返回值。

可以减少组件不必要的渲染，从而优化性能。

##### componentWillUpdate(nextProps, nextState)

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

## 表单

#### 受控组件

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

#### 非受控组件

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