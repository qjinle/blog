---
title: React相关库
lang: zh-CN
---

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

