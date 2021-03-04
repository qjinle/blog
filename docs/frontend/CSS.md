---
title: CSS
lang: zh-CN
---

## 布局

### 盒子模型的宽度

offsetWidth = 内容宽度 + 内边距 + 边框 （无外边距）

`box-sizing: border-box;` 设置后，offsetWidth  = width

### BFC

BFC，Block formmat context，块级格式化上下文。它是一块 **独立** 的区域，内部元素的渲染不会影响边界以外的元素。BFC 的意思是形成一个范围，让内部元素不能脱离这个范围

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

### flex 布局

父项常见属性：

- flex-direction：设置主轴的方向
- justify-content：设置主轴上的子元素排列方式
- flex-wrap：设置子元素是否换行
- align-content：设置侧轴上的子元素的排列方式（多行）
- align-items：设置侧轴上的子元素排列方式（单行）
- flex-flow：复合属性，相当于同时设置了 flex-direction 和 flex-wrap

子项常见属性：

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

### viewport

viewport 也叫 **视口**，可以通过 meta 标签来控制它，在移动端可以分为 **布局视口（layout viewport）**、**视觉视口（visual viewport）**和 **理想视口（ideal viewport）**

```html
<meta name="viewport" content="width=device-width">
```

设置 `width = device-width` 的目的正是为了 **使布局视口的宽度刚好匹配上视觉视口的宽度**

#### 布局视口

上面设置的 width 就是布局视口的宽度，布局视口指的是 **页面实际布局所占用的区域**，也就是 CSS 可以绘制的区域

`document.documentElement.clientWidth` 可以用来获取布局视口的宽度

#### 视觉视口

视觉视口指的是 **用户设备实际的可见区域**，也就是浏览器的宽高

`window.innerWidth` 和 `window.innerHeight` 可以用来获取视觉视口的宽高

![](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/%E8%A7%86%E5%8F%A3%E6%AF%94%E8%BE%83.png)

#### 理想视口

当视觉视口和布局视口大小不一样时，就会出现不符合预期的展示效果，实际上，很多时候，布局视口本身的宽度都是无法和视觉视口完全匹配的

理想视口随即诞生，它指的是 **布局视口最理想的尺寸**，也就是整个页面刚好全部覆盖手机屏幕的尺寸（这个尺寸不用我们计算，厂商根据手机屏幕尺寸大小，会提供一个最符合这个屏幕尺寸页面设计方案，我们只需通过上面那行代码即可）

### 媒体查询

媒体查询可以 **根据不同屏幕大小展示不同的样式**

- `@media` 是媒体查询属性的标识
- `screen` 指的是媒体类型
- `max-width` 是对最大宽度的限制，比如屏幕不大于 320px 时，采纳对应样式规则
- `min-width` 是对最小宽度的限制，比如屏幕不小于 768px 时，采纳对应样式规则

```css
@media screen and (max-width: 320px) {
    div {
     width: 160px;
    }
}

@media screen and (min-width: 768px) {
    div {
     width: 300px;
    }
}
```

### rem 和 em

#### rem

rem 指的是 **相对于HTML根元素的字体大小**（font-size）来计算的长度单位

```css
html { 
  font-size: 100px; 
}
```

那么就有如下换算：

```
1rem = 100px
```

#### em

em 指的是 **相对于当前元素的字体大小**（font-size）来计算的长度单位

```css
div {
  font-size: 20px;
  padding: 10em; /*200px*/ 
  width: 20em; /*400px*/ 
}
```

#### rem 实现响应式

该方式核心思路是以 rem 作为布局单位，根据设备屏幕大小的不同，动态地修改根元素的 font-size，相当于间接地修改了页面中所有元素的大小，进而实现了响应式布局

```js
function refreshRem() {
    // 获取文档对象(根元素）
    const docEl = doc.documentElement;
    // 获取视图容器宽度
    const docWidth = docEl.getBoundingClientRect().width;
    // rem 取值为视图容器宽度的十分之一大小
    const rem = width / 10;
    // 设置 rem 大小
    docEl.style.fontSize = rem + 'px';
}
// 监听浏览器窗口大小的变化
window.addEventListener('resize', refreshRem);

// 载至 flexible.js （手淘前端团队整合的一套相当成熟的移动端自适应解决方案库）
```

### vw 和 vh

- **vw** --- `1vw` 等于 `1%` 的 `viewport` 宽
- **vh** --- `1vh` 等于 `1%` 的 `viewport` 高

不同手机设备的 `viewport` 都是有差异的，通常不会给元素一个固定像素的宽高，所以需要一个相对于 `viewport `的单位，也就是 `vw` 和 `vh`

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

## 常见问题

### 清除浮动

```css
/* 手写 clearfix */
.clearfix:after {
	content: '';
	display: table;
	clear: both;
}
```

### 