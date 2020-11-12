---
title: CSS
lang: zh-CN
---

## 布局

#### 盒子模型的宽度

​	offsetWidth = 内容宽度 + 内边距 + 边框 （无外边距）

​	`box-sizing: border-box;`设置后，offsetWidth  = width

#### margin 纵向重叠

​	相邻元素的 margin-top 和 margin-bottom 会发生重叠，空白内容也会重叠

#### margin 负值

​	margin-top 和 margin-left 负值，元素向上、向左移动 

​	margin-right 负值，右侧元素左移，自身不受影响 

​	margin-bottom 负值，下方元素上移，自身不受影响

#### BFC

​	BFC，Block formmat context，块级格式化上下文。它是一块独立的区域，内部元素的渲染不会影响边界以外的元素。BFC 的意思是形成一个范围，让内部元素不能脱离这个范围。

​	形成BFC的常见条件：

- float 不是 none 

- position 是 absolute 或者 fixed 

- overflow 不是 visible （可用 `overflow: hidden;` 清除浮动）

- display 是 flex 或者 inline-block

#### float 布局

​	圣杯布局和双飞翼布局

- 圣杯布局和双飞翼布局的目的：
  - 三栏布局，中间一栏最先加载和渲染（内容最重要）
  - 两侧内容固定，中间内容随着宽度自适应 
  - 一般用于PC网页
- 如何实现圣杯布局和双飞翼布局
  - 使用float布局
  - 两侧使用margin负值，以便和中间内容横向重叠
  - 防止中间内容被两侧覆盖，一个用padding一个用margin

#### 手写清除浮动clearfix

```css
/* 手写 clearfix */
.clearfix:after {
	content: '';
	display: table;
	clear: both;
}
```

#### flex 布局

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

#### absolute 和 relative

​	relative 依据自身定位

​	absolute 依据最近一层的定位元素定位

#### 居中对齐

​	水平居中：

- inline 元素： text-align: center 
- block 元素： margin：auto 
- absolute元素：left: 50% + margin-left 负值

​	垂直居中：

- inline 元素：line-height 的值等于height值 
- absolute 元素：top: 50% + margin-top 负值(需要知道子元素的宽高) 
- absolute 元素：left: 50% + top: 50% + transform: translate(-50%, -50%) 
- absolute 元素：top left bottom right = 0 + margin: auto

## 图文样式

#### line-height 继承

- 写具体数值，如 30px 则继承该值
- 写比例，如 1.5 或 2 那就继承这个比例 
- 写百分比，如200%，则继承计算（font-size * line-height）出来的值（考点）

## 响应式

#### rem

​	rem是一个长度单位，相对于html根元素的font-size的值

#### 如何实现

​	媒体查询屏幕宽度，设置不同的html的font-size

