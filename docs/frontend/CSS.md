---
title: CSS
lang: zh-CN
---

## 布局

### 盒子模型的宽度

​	offsetWidth = 内容宽度 + 内边距 + 边框 （无外边距）

​	`box-sizing: border-box;`设置后，offsetWidth  = width

### margin 纵向重叠

​	相邻元素的 margin-top 和 margin-bottom 会发生重叠，空白内容也会重叠

### margin 负值

​	margin-top 和 margin-left 负值，元素向上、向左移动 

​	margin-right 负值，右侧元素左移，自身不受影响 

​	margin-bottom 负值，下方元素上移，自身不受影响

### BFC

BFC，Block formmat context，块级格式化上下文。它是一块独立的区域，内部元素的渲染不会影响边界以外的元素。BFC 的意思是形成一个范围，让内部元素不能脱离这个范围

BFC 主要用于：

- 清除浮动
- 阻止 margin 发生重叠
- 阻止元素被浮动的元素覆盖

形成BFC的常见条件：

- float 不是 none 

- position 是 absolute 或者 fixed 

- overflow 不是 visible （可用 `overflow: hidden;` 清除浮动）

- display 是 flex、inline-block 或者 table-cell

### float 布局

​	圣杯布局和双飞翼布局

- 圣杯布局和双飞翼布局的目的：
  - 三栏布局，中间一栏最先加载和渲染（内容最重要）
  - 两侧内容固定，中间内容随着宽度自适应 
  - 一般用于PC网页
- 如何实现圣杯布局和双飞翼布局
  - 使用float布局
  - 两侧使用margin负值，以便和中间内容横向重叠
  - 防止中间内容被两侧覆盖，一个用padding一个用margin

### 手写清除浮动clearfix

```css
/* 手写 clearfix */
.clearfix:after {
	content: '';
	display: table;
	clear: both;
}
```

### flex 布局

​	父项常见属性：

- flex-direction：设置主轴的方向
- justify-content：设置主轴上的子元素排列方式
- flex-wrap：设置子元素是否换行
- align-content：设置侧轴上的子元素的排列方式（多行）
- align-items：设置侧轴上的子元素排列方式（单行）
- flex-flow：复合属性，相当于同时设置了 flex-direction 和 flex-wrap

​	子项常见属性：

+ flex：子项目占的份数
+ align-self：控制子项自己在侧轴的排列方式
+ order：定义子项的排列顺序（前后顺序）

## 定位

### absolute 和 relative

​	relative 依据自身定位

​	absolute 依据最近一层的定位元素定位

### 居中对齐

以下例子全为父元素（container）、子元素（center）

#### 绝对定位

1. **margin 置负**

   父元素相对定位，子元素绝对定位，**此方法需要准确知道子元素的宽高**

   ```css
   #container {
     position: relative;
   }
   
   #center {
     width: 200px;
     height: 200px;
     background-color: red;
     position: absolute;
     left: 50%;
     top: 50%;
     margin-left: -100px;
     margin-top: -100px;
   }
   ```

2. **margin: auto**

   1. 水平方向：

      `margin: 0 auto` 在任何情况下 auto 只会取两种值：

      1. 当元素的布局方式为 static/relative 且宽高已知时，**取父元素剩余空间宽度**
      2. 当元素的布局方式为 postion/absolute/fixed 或者 float/inline 或者宽高未知时，**取 0**

   2. 垂直方向：

      利用元素的 **流体特性**（当一个绝对定位元素，其对立定位方向属性同时有具体定位数值的时候）

      其可以使 **元素可自动填充父级元素的可用尺寸**

      当流体特性发生时，我们可以给水平/垂直方向的对立定位（left、right、top、bottom）各设定一个值，然后将水平/垂直方向的 margin 均设为 auto，这样一来，auto 就会自动平分父元素的剩余空间了

      ```css
      #center {
        background-color: red;
        width: 200px;
        height: 200px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      ```

3. **动画属性 transform**

   transform 是 css3 引入的一个动画属性，它允许我们对元素进行旋转、缩放、移动或倾斜，用 translate 可以移动元素

   ```css
   #center {
     position: absolute;
     left: 50%;
     top: 50%;
     transform: translate(-50%, -50%);
   }
   ```

#### flex 布局

直接设置父元素为 flex 布局，然后设置主轴（justify-content）和副轴（align-items）的排列方式为 center

```css
#container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### table 布局

设置父元素为 table-cell 布局，然后设置容器内部子元素布局方式，vertical-align 指定垂直居中，text-align 指定水平居中

将子元素的布局设为 inline-block

```css
#container {
	width: 400px;
	height: 400px;
	background-color: black;
	display: table-cell;
	vertical-align: middle;
	text-align: center;
}

#center {
	background-color: red;
	display: inline-block;
}
```

## 图文样式

### line-height 继承

- 写具体数值，如 30px 则继承该值
- 写比例，如 1.5 或 2 那就继承这个比例 
- 写百分比，如200%，则继承计算（font-size * line-height）出来的值（考点）

## 响应式

### rem

​	rem是一个长度单位，相对于html根元素的font-size的值

### 如何实现

​	媒体查询屏幕宽度，设置不同的html的font-size

## 工程化

### 预处理器

传统 CSS 的弊端：

- 宏观设计上：
  - 我们希望能优化 CSS 文件的目录结构，对现有的 CSS 文件实现复用
- 编码优化上：
  - 我们希望能写出结构清晰、简明易懂的 CSS，需要它具有一目了然的嵌套层级关系，而不是无差别的一铺到底写法
  - 我们希望它具有变量特征、计算能力、循环能力等等更强的可编程性，这样我们可以少写一些无用的代码
- 可维护性上
  - 更强的可编程性意味着更优质的代码结构
  - 实现复用意味着更简单的目录结构和更强的拓展能力

所以诞生了类似 Sass、Less 等的预处理器，他们带来的好处有：

- 嵌套代码的能力，通过嵌套来反映不同 css 属性之间的层级关系 
- 支持定义 css 变量
- 提供计算函数
- 允许对代码片段进行 extend 和 mixin
- 支持循环语句的使用
- 支持将 CSS 文件模块化，实现复用

### PostCss

PostCss 和预处理器不同于，预处理器处理的是 类CSS，而 PostCss 处理的就是 CSS 本身

PostCss 的主要工作是：

- 编译尚未被浏览器广泛支持的先进的 CSS 语法
- 自动为一些需要额外兼容的语法增加前缀
- 支持各种各样的扩展，极大地强化了 CSS 的能力

业务场景有：

- 提高 CSS 代码的可读性：PostCss 其实可以做类似预处理器能做的工作
- 当我们的 CSS 代码需要适配低版本浏览器时，PostCss 的 [Autoprefixer](https://github.com/postcss/autoprefixer) 插件可以帮助我们自动增加浏览器前缀
- 允许我们编写面向未来的 CSS：PostCss 能够帮助我们编译 CSS next 代码

### Webpack

**Webpack 在裸奔的状态下，是不能处理 CSS 的**，Webpack 本身是一个面向 JavaScript 且只能处理 JavaScript 代码的模块化打包工具，但 **在 loader 的辅助下是可以处理 CSS 的**

其中两个关键 loader 是 **css-loader** 和 **style-loader**

- css-loader --- 导入 CSS 模块，对 CSS 代码进行编译处理
- style-loader --- 创建 style 标签，把 CSS 内容写入标签

**css-loader 的执行顺序一定要安排在 style-loader 的前面**，因为要先编译后插入