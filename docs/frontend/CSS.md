---
title: CSS
lang: zh-CN
---

## CSS 选择器

选择器是 CSS 规则的一部分且位于 CSS 声明块前

### 简单选择器

- **通用选择器** | 星号 --- `*`
  - 可以选择在一个页面中的所有元素
  - 使用时小心，因为它适用于所有的元素，在大型网页利用它可以对性能有明显的影响：**网页可以显示比预期要慢**
- **类型选择器** | type selector --- `div`
  - 选择的是元素中的 `tagName` （标签名）属性
- **类选择器**｜class selector --- `.class-name`
  - 以 `.` 开头以及类后面的类名组成的选择器
  - 文档中的多个元素可以具有相同的类名，而单个元素可以有多个类名（可以用空格做分隔符来制定多个 class）
- **ID 选择器**｜id selector --- `#id`
  - 以 `#` 开头加上 ID 名选中一个 ID
  - 这个是严格匹配的，唯一的
- **属性选择器**｜attribute selector --- `[attr=value]`
  - 根据元素的 **属性和属性值** 来匹配元素
  - 通用语法由方括号 `([])` 组成，其中包含属性名称，后跟可选条件以匹配属性的值
  - **存在和值属性选择器**
    - 这些属性选择器尝试匹配精确的属性值
    - `[attr]` --- 该选择器选择包含 attr 属性的所有元素，不论 attr 的值为何
    - `[attr=val]` --- 该选择器仅选择 attr 属性被赋值为 val 的所有元素
    - `[attr~=val]` --- 该选择器仅选择 attr 属性的值中有包含 val 值的所有元素
  - **子串值属性选择器（伪正则选择器）**
    - `[attr|=val]` --- 选择 attr 属性的值以 val（包括 val）或 val- 开头的元素
    - `[attr^=val]` --- 选择 attr 属性的值以 val 开头（包括 val）的元素
    - `[attr$=val]` --- 选择 attr 属性的值以 val 结尾（包括 val）的元素
    - `[attr*=val]` --- 选择 attr 属性的值中包含字符串 val 的元素
- **伪类** --- `:hover`
  - 匹配处于确定状态的一个或多个元素，多半是交互和效果元素，比如被鼠标指针悬停的元素
  - **链接/行为**
    - `:any-link` --- 可以匹配任何的超链接
    - `:link` --- 还没有访问过的超链接
    - `:link :visited` --- 匹配所有被访问过的超链接
    - `:hover` --- 用户鼠标放在元素上之后的状态，之前是只能对超链接生效，但是现在是可以在很多元素中使用了
    - `:active` --- 之前也是只对超链接生效的，点击之后当前的链接就会生效
    - `:focus` --- 就是焦点在这个元素中的状态，一般用于 `input` 标签，其实任何可以获得焦点的元素都可以使用
    - `:target` --- 链接到当前的目标，这个不是给超链接用的，是给锚点的 `a` 标签使用的，就是当前的 HASH 指向了当前的 `a` 标签的话就会激活 `target` 伪类
  - **树结构**
    - `:empty` --- 这个元素是否有子元素
    - `:nth-child()` --- 是父元素的第几个儿子（child），可以在括号里写奇 `event` 偶 `odd`，也可以写 `4N+1` 匹配整数形态 
    - `:nth-last-child()` --- 与 `nth-child` 一样，只不过从后往前数
    - `:first-child :last-child :only-child`
  - **逻辑型**
    - `:not()` --- 选择匹配非指定元素
- **伪元素** --- `::before`
  - 实际上是支持使用单冒号的，但提倡双冒号这个写法
  - 如果不选择它们，这个地方就不存在这个元素
  - `::before` --- 在元素的内容的前面插入一个伪元素，需要 `content` 属性，类似真正的 DOM 元素
  - `::after` --- 在元素的内容的后面插入一个伪元素，需要 `content` 属性，类似真正的 DOM 元素
  - `::first-letter` --- 选择元素内容第一个字母，可做相应的处理
  - `::first-line` --- 选择排版之后的 `line`，可做相应的处理

### 复杂选择器（组合器）

在 CSS 中，组合器允许您将多个选择器组合在一起，这允许您在其他元素中选择元素，或者与其他元素相邻

- **后代选择器** --- `.class-name1 .class-name2`
  - 允许选择嵌套在前一个元素中的某个元素（可以是子元素，或者孙子元素）
- **父子选择器** --- `.father>.son`
  - 允许选择一个元素，该元素是前一个元素的直接子元素
- **相邻兄弟选择器** --- `.left+.right`
  - 允许选择一个元素，它是前一个元素的直接兄弟元素（具有相同父元素，并且紧挨着）
- **通用兄弟选择器** --- `.left~.right`
  - 允许您选择前一个元素的兄弟元素（相同父元素）

> 注：相邻兄弟选择器和通用兄弟选择器只会 **向后** 选择，DOM结构靠前的兄弟元素不在选择范围内

### 优先级

CSS 优先级可以分级别：**!important > 行内样式 > ID 选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性**

同一级别中后写的会覆盖先写的样式

#### 权重计算

CSS 优先级还可以由一个权重决定（`[0,0,0,0]`）

四个级别按顺序分别对应：

- 行内选择符
- ID 选择符
- 类选择符、属性选择符、伪类选择符
- 元素选择符、伪元素选择符

需要注意以下几点：

- !important 的优先级是最高的，但出现冲突时则需比较权重
- 优先级相同时，则采用就近原则，选择最后出现的样式
- 继承得来的属性，其优先级最低

## 盒模型

### 标准盒模型

![](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/%E6%A0%87%E5%87%86%E7%9B%92%E6%A8%A1%E5%9E%8B.jpg)

标准盒模型 `width = content` `height = content`

可通过设置 CSS ：`box-sizing: content-box`

### IE 盒模型

![](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/IE%E7%9B%92%E6%A8%A1%E5%9E%8B.jpg)

IE 盒模型 `width = content + padding + border` `height = content + padding + border`

可通过设置 CSS ：`box-sizing: border-box`

### JS 获取宽高

1. `div.style.width/height` --- 获取元素内联样式设置的宽高（如果元素样式在 style 标签或外联 CSS 文件则无法获取）
2. `div.currentStyle.width/height` --- 获取页面渲染完成后的结果（只支持 IE 浏览器）
3. `window.getComputedStyle(div).width/height` --- 和 2 相同，兼容性好一点
4. `div.getBoundingClientRect().width/height` --- 根据元素在视窗口的绝对位置来获取
5. `div.offsetWidth/offsetHeight` --- 获取宽高，兼容性最好，最常用

### 外边距合并

所谓外边距合并，指的是`margin` 合并，外边距合并只针对块级元素，而且是顶部或底部的外边距，可用 BFC 解决

## 布局

### 文档流

文档流：内联元素默认从左到右流，遇到阻碍或者宽度不够自动换行，继续按照从左到右的方式布局。块级元素单独占据一行，并按照从上到下的方式布局

**脱离文档流：**

1. `float: left`
2. `position: absolute`
3. `position: fixed`

### BFC

BFC，Block formmat context，块级格式化上下文

**具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性**

**BFC 的意思是形成一个范围，让内部元素不能脱离这个范围**

#### 触发条件

- 浮动元素：`float` 除 `none` 以外的值
- 绝对定位元素：`position` 为 `absolute` 或 `fixed`
- `overflow` 不是 `visible`（`hidden`、`auto`、`scroll`） （可用 `overflow: hidden;` 清除浮动）
- `display` 是 `flex`、`inline-block` 或者 `table-cell`

#### 应用

1. **阻止外边距（margin）会发生重叠**，可以将其放在不同的 BFC 容器中
2. **BFC 可以包含浮动元素（清除浮动）**
   1. 浮动的元素会脱离普通文档流
   2. 触发容器的 BFC，那么容器将会包裹着浮动元素
3. **BFC 可以阻止元素被浮动元素覆盖**，可在被覆盖元素中加入 `overflow: hidden`（用来实现两列布局）

### 浮动

**浮动元素：** 浮动元素同时处于常规流内和流外的元素

- 块级元素认为浮动元素不存在
- 浮动元素会影响行内元素的布局
- 浮动元素会通过影响行内元素间接影响了包含块的布局

#### 浮动闭合

浮动元素并不能撑起包含块，通过以下方法将包含块撑开称为 **浮动闭合**

1. 设置 **BFC**

2. 设置 **伪元素**

   ```css
   .clearfix::after {
       content: '';
       display: block;
       clear: both;    
   }
   ```

3. **包含块自己也浮动**（不推荐）

### Flex 布局

Flex 是 Flexible Box 的缩写，意为 **弹性布局**，用来为盒状模型提供最大的灵活性

> 注：设为 Flex 布局以后，子元素的 `float`、`clear `和 `vertical-align` 属性将失效

#### Flex 容器

采用 Flex 布局的元素，称为 **Flex 容器**，它的所有子元素自动成为容器成员，称为 **Flex 项目**

容器默认存在两根轴：水平的主轴 和 垂直的交叉轴（项目默认沿主轴排列）

#### 容器属性

- `flex-direction` --- **设置主轴的方向**
  - `row`（默认值） --- 主轴为水平方向，起点在左端
  - `row-reverse` --- 主轴为水平方向，起点在右端
  - `column` --- 主轴为垂直方向，起点在上沿
  - `column-reverse` --- 主轴为垂直方向，起点在下沿
- `flex-wrap` --- **设置子元素是否换行**
  - 默认情况下，项目都排在一条线
  - `nowrap`（默认） --- 不换行
  - `wrap` --- 换行，第一行在上方
  - `wrap-reverse` --- 换行，第一行在下方
- `flex-flow` --- `flex-direction` 属性和 `flex-wrap` 属性的简写形式，默认值为 `row nowrap`
- `justify-content` --- **设置主轴上的子元素排列方式**
  - `flex-start`（默认值） --- 左对齐
  - `flex-end` --- 右对齐
  - `center` --- 居中
  - `space-between` --- 两端对齐，项目之间的间隔都相等
  - `space-around` --- 每个项目两侧的间隔相等（项目之间的间隔比项目与边框的间隔大一倍）
- `align-items` --- **设置交叉轴上的子元素排列方式（单行）**
  - `flex-start` --- 交叉轴的起点对齐
  - `flex-end` --- 交叉轴的终点对齐
  - `center` --- 交叉轴的中点对齐
  - `baseline` --- 项目的第一行文字的基线对齐
  - `stretch`（默认值） --- 如果项目未设置高度或设为 auto，将占满整个容器的高度
- `align-content` --- **设置多根交叉轴线上的子元素的排列方式（多行）**，如果项目只有一根轴线，该属性不起作用
  - `flex-start` --- 与交叉轴的起点对齐
  - `flex-end` --- 与交叉轴的终点对齐
  - `center` --- 与交叉轴的中点对齐
  - `space-between` --- 与交叉轴两端对齐，轴线之间的间隔平均分布
  - `space-around` --- 每根轴线两侧的间隔都相等（轴线之间的间隔比轴线与边框的间隔大一倍）
  - `stretch`（默认值） --- 轴线占满整个交叉轴

#### 项目属性

+ `order` --- **定义项目的排列顺序。**数值越小，排列越靠前，默认为 0
+ `flex-grow` --- **定义项目的放大比例**，默认为`0`，即如果存在剩余空间，也不放大
  + 如果所有项目的 `flex-grow` 属性都为 1，则它们将等分剩余空间
+ `flex-shrink` --- **定义了项目的缩小比例**，默认为1，即如果空间不足，该项目将缩小
  + 如果所有项目的 `flex-shrink` 属性都为 1，当空间不足时，都将等比例缩小
  + 如果一个项目的 `flex-shrink` 属性为 0，其他项目都为 1，则空间不足时，前者不缩小
+ `flex-basis` --- **定义了在分配多余空间之前，项目占据的主轴空间**，它的默认值为 `auto`，即项目的本来大小
  + 可以设为跟 `width` 或 `height` 属性一样的值，则项目将占据固定空间
+ `flex` --- `flex-grow`、`flex-shrink` 和 `flex-basis` 的简写，默认值为 `0 1 auto`
  + 该属性有两个快捷值：`auto`（`1 1 auto`）和 `none`（`0 0 auto`）
  + 建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值
+ `align-self` --- **控制项目自己在侧轴的排列方式**，可覆盖 `align-items` 属性，默认为 `auto`

### 两栏布局

1. **浮动布局**

   `float + margin-left` 或者 `float + overflow: auto`

   ```html
   <style>
     .aside {
       width: 30vw;
       height: 100vh;
       float: left;
       background: blue;
     }
     .main {
       margin-left: 30vw;
       /* 或者换成 overflow: auto，使其成为BFC */
     }
   </style>
   <body>
     <div class="aside"></div>
     <div class="main">
       <div class="content"></div>
     </div>
   </body>
   ```

2. **flex 布局**

   ```html
   <style>
     .container {
       display: flex;
     }
     .aside {
       flex: 0 0 25vw;
       /* or width: 25vw;  */
     }
     .main {
       flex: 1;
       /* 等于flex-grow: 1; */
     }
   </style>
   <body>
     <div class="container">
       <div class="aside"></div>
       <div class="main"></div>
     </div>
   </body>
   ```

### 三栏布局

1. **圣杯布局**

   1. middle、left、right 给浮动脱离文档流

   2. container 设置 BFC 撑开盒子，设置左右内边距预留位置

   3. left、right 给固定宽度，middle 设置 100% 宽度

   4. middle、left、right 设置相对定位

   5. left 设置 margin-left 和 left

   6. right 设置 margin-left 和 right

      ![](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/%E5%9C%A3%E6%9D%AF%E5%B8%83%E5%B1%80.png)

   ```html
   <style>
     .float {
       float: left; /* 三个都设置浮动，为了把left和right定位到左右部分 */
       position: relative;
       min-height: 300px;
     }
     .container {
       padding: 0;
       margin: 0;
       padding-left: 100px;
       padding-right: 200px;
       height: 100%;
       overflow: hidden; /*脱离文档流 BFC */
     }
     .middle {
       width: 100%;
       background-color: red;
     }
     .left {
       width: 100px;
       background-color: green;
       margin-left: -100%;
       left: -100px;
     }
     .right {
       width: 200px;
       background-color: blue;
       margin-left: -200px;
       right: -200px;
     }
   </style>
   <body>
     <div class="container">
       <div class="middle float"></div>
       <div class="left float"></div>
       <div class="right float"></div>
     </div>
   </body>
   ```

2. **双飞翼布局**

   1. middle、left、right 给浮动脱离文档流

   2. middle 设置 BFC 撑开盒子，设置 100% 宽度

   3. left、right 给固定宽度

   4. inner 设置左右外边距

   5. left 和 right 设置 margin-left

      ![](https://raw.githubusercontent.com/jinle0703/img-host/master/blog/%E5%8F%8C%E9%A3%9E%E7%BF%BC%E5%B8%83%E5%B1%80.png)

   ```html
   <style>
     .float {
       float: left; /* 三个都设置浮动，为了把left和right定位到左右部分 */
       min-height: 300px;
     }
     .middle {
       width: 100%;
       overflow: hidden;
     }
     .inner {
       margin-left: 100px;
       margin-right: 200px;
       min-height: 300px;
       background-color: red;
     }
     .left {
       width: 100px;
       background-color: green;
       margin-left: -100%;
     }
     .right {
       width: 200px;
       background-color: blue;
       margin-left: -200px;
     }
   </style>
   <body>
     <div class="middle float">
       <div class="inner"></div>
     </div>
     <div class="left float"></div>
     <div class="right float"></div>
   </body>
   ```

3. **flex 布局**

   ```html
   <style>
     .container {
       display: flex;
     }
     .left {
       width: 200px;
       background: red;
     }
     .main {
       flex: 1;
       background: blue;
     }
     .right {
       width: 200px;
       background: red;
     }
   </style>
   <body>
     <div class="container">
       <div class="left"></div>
       <div class="main"></div>
       <div class="right"></div>
     </div>
   </body>
   ```

## 定位

### position

CSS position 属性用于指定一个元素在文档中的定位方式，top、right、bottom、left 属性则决定了该元素的最终位置

#### static

**静态定位**，为 position 的默认值，指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置，此时 top、right、bottom、left 属性无效

#### relative

**相对定位**，元素先放置在未添加定位时的位置，再在不改变页面布局的前提下调整元素位置（因此会在此元素未添加定位时所在位置留下空白），简单来说就是 **保留文档流中位置，相对原位置定位**

#### absolute

**绝对定位**，不为元素预留空间，通过指定元素相对于 **最近的非 static 定位祖先元素的偏移**，来确定元素位置，**脱离文档流**

#### fixed

**固定定位**，不为元素预留空间，而是通过指定元素相对于 **屏幕视口（viewport）的位置** 来指定元素位置，**脱离文档流**

- 元素的位置在屏幕滚动时不会改变
- 打印时，元素会出现在的每页的固定位置
- fixed 属性会创建新的层叠上下文
- 当元素祖先的 transform 属性非 none 时，容器由视口改为该祖先

#### sticky

基本上是相对位置和固定位置的混合体，**允许被定位的元素表现得像相对定位一样，直到它滚动到某个阈值点为止，此后它就变得固定了**（它可用于使导航栏随页面滚动直到特定点，然后粘贴在页面顶部）

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
- 写百分比，如 200%，则继承计算（font-size * line-height）出来的值

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

PostCss是一个允许使用 JS 插件转换样式的工具

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
