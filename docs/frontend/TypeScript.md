---
title: TypeScript
lang: zh-CN
---

## 基础类型

### 布尔值

最基本的数据类型就是简单的 true/false 值，在 JavaScript 和 TypeScript 里叫做 `boolean`

```ts
let isDone: boolean = false;
```

### 数字

和 JavaScript 一样，TypeScript 里的所有数字都是浮点数。 这些浮点数的类型是  `number`。 除了支持十进制和十六进制字面量，TypeScript 还支持 ES6 中引入的二进制和八进制字面量

```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

### 字符串

TypeScript 使用  `string` 表示文本数据类型。 和 JavaScript 一样，可以使用双引号（ `"`）或单引号（`'`）表示字符串

```ts
let name: string = "bob";
name = "smith";
```

还可以使用*模版字符串*，它可以定义多行文本和内嵌表达式

```ts
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;
```

### Null 和 Undefined

TypeScript里，`undefined` 和 `null` 两者各自有自己的类型分别叫做 `undefined` 和 `null`

```ts
let u: undefined = undefined;
let n: null = null;
```

默认情况下 `null` 和 `undefined` 是所有类型的子类型。 就是说你可以把  `null` 和 `undefined` 赋值给 `number` 类型的变量

```ts
let num: number = undefined;
```

### any

可以使用 `any` 来定义还不清楚要定义的类型的变量

```ts
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;
```

### 联合类型

```ts
let numberOrSrting: number | string = 234;
numberOrSrting = 'abc';
```

### 数组

TypeScript 像 JavaScript 一样可以操作数组元素。 有两种方式可以定义数组

 第一种，可以在元素类型后面接上 `[]`，表示由此类型元素组成的一个数组：

```ts
let list: number[] = [1, 2, 3];
```

第二种方式是使用数组泛型，`Array<元素类型>`：

```ts
let list: Array<number> = [1, 2, 3];
```

### 元组 Tuple

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

可以定义一对值分别为 `string` 和 `number` 类型的元组。

```ts
let x: [string, number];
x = ['hello', 10]; // OK
x = [10, 'hello']; // Error
```

### 类型别名

可用 `type` 来命名一个类型

```ts
type NameResolver = () => string
type NameOrResolver = string | NameResolver
function getName(n: NameOrResolver): string {
  if (typeof n === 'string') {
    return n
  } else {
    return n()
  }
}
```

### 类型断言

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 

类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用

类型断言有两种形式，一种是用 `as` 语法

```ts
function getLength(input: string | number) : number {
  const str = input as String
  if (str.length) {
    return str.length
  } else {
    const number = input as Number
    return number.toString().length
  }
}
```

另一种是 `<>` 语法

```ts
function getLength(input: string | number) : number {
  if((<string>input).length) {
    return (<string>input).length
  } else {
    return input.toString().length
  }
}
```

## 接口

TypeScript 的核心原则之一是对值所具有的结构进行类型检查

接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约

```ts
interface Person {
  readonly id: number; // 只读属性
  name: string;
  age?: number; // 可选属性
}
let jinle: Person = {
  id: 0,
  name: "jinle",
}
jinle.id = 1; // error
```

### 类类型

TypeScript 能够用接口来明确的强制一个类去符合某种契约

```ts
interface Radio {
  switchRadio(): void;
}
class Car implements Radio{
  switchRadio() {

  }
}
```

## 类

```ts
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name
  }
  run() {
    return `${this.name} is running`
  }
}
```

### 继承

类从基类中继承了属性和方法，也可以重写方法

```ts
class Cat extends Animal {
  constructor(name) {
    super(name)
    console.log(this.name)
  }
  run() {
    return 'Meow, ' + super.run() 
  }
}
```

### 修饰符

#### 公共 public

标记为 `public` 的成员可以自由访问，默认标记 `public`

```ts
class Animal {
  public name: string;
  public constructor(name: string) {
    this.name = name
  }
  public run() {
    return `${this.name} is running`
  }
}
```

#### 私有 private

当成员被标记成 `private`时，它就不能在声明它的类的外部访问（包括子类）

```ts
class Animal {
  private name: string;
  constructor(name: string) {
    this.name = name
  }
}
new Animal("Dog").name; // error
```

#### 受保护 protected

`protected` 修饰符与 `private` 修饰符的行为很相似，但有一点不同， `protected` 成员在派生类中仍然可以访问

构造函数也可以被标记成 `protected`。 这意味着这个类不能在包含它的类外被实例化，但是能被继承

```ts
class Animal {
  protected name: string;
  protected constructor(name: string) {
    this.name = name;
  }
}
class Dog extends Animal {
  private type: string;
  constructor(name, type) {
    super(name);
    this.type = type;
  }
  public whatIsType() {
    return `${this.name} is a ${this.type}`;
  }
}

const animal = new Animal("maomao"); // error
const laifu = new Dog("laifu", "erha");
console.log(laifu.whatIsType());
console.log(laifu.name); // error
```

#### 只读 readonly

`readonly` 关键字将属性设置为只读的，只读属性必须在声明时或构造函数里被初始化

```ts
class Animal {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const dog = new Animal("dog");
console.log(dog.name);
dog.name = "cat"; // error
```

### 静态属性

静态属性存在于类本身上面而不是类的实例上

```ts
class Animal {
  name: string;
  static categoies: string[] = ['mammal', 'bird']
  constructor(name: string) {
    this.name = name
  }
}
console.log(Animal.categoies)
```

## 函数

```ts
// 函数声明
function add(x: number, y: number, z: number = 10): number {
	return x + y + z
}
let result = add(2, 3, 5)
```

## 枚举

使用枚举我们可以定义一些带名字的常量

使用枚举可以清晰地表达意图或创建一组有区别的用例

TypeScript 支持数字的和基于字符串的枚举

### 数字枚举

当不指定值时，默认从 0 开始递增，当然也可以指定值

```ts
enum Direction {
    Up, // 0
    Down, // 1
    Left, // ...
    Right
}
```

### 字符串枚举

在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化

```ts
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

## 泛型

泛型可以用来创建可重用的组件，一个组件可以支持多种类型的数据

```ts
function echo<T>(arg: T): T {
  return arg
}

const result = echo(123) // number
const result = echo('str') // string
const result = echo(true) // boolean
```

我们给 identity 添加了类型变量 `T`。`T` 帮助我们捕获用户传入的类型（比如：`number`），之后我们就可以使用这个类型，之后我们再次使用了 `T` 当做返回值类型

**不同于使用 `any`，泛型不会丢失信息**

### 泛型约束

想要限制函数去处理任意带有`.length` 属性的所有类型。 只要传入的类型有这个属性，我们就允许，就是说至少包含这一属性。 为此，我们需要列出对于 T 的约束要求

```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

**定义一个接口来描述约束条件**

1. 创建一个包含 `.length` 属性的接口
2. 使用这个接口和 `extends` 关键字来实现约束

```ts
interface IWithLength {
  length: number
}

function echoWithLength<T extends IWithLength>(arg: T): T {
  console.log(arg.length)
  return arg
}

const str = echoWithLength('str')
const obj = echoWithLength({ length: 10, width: 10})
const arr = echoWithLength([1, 2, 3])
const num = echoWithLength(123) // error
```

### 泛型类

泛型类使用 `<>` 括起泛型类型，跟在类名后面

```ts
class Queue<T> {
  private data = [];
  push(item: T) {
    return this.data.push(item)
  }
  pop(): T {
    return this.data.shift()
  }
}

const queue = new Queue<number>()
queue.push(1)
console.log(queue.pop().toFixed())

const queue2 = new Queue<string>()
queue2.push('str')
console.log(queue2.pop().length)
```

### 泛型接口

把泛型参数当作整个接口的一个参数，这样我们就能清楚的知道使用的具体是哪个泛型类型

```ts
interface KeyPair<T, U> {
  key: T;
  value: U;
}
let kp1: KeyPair<number, string> = { key: 123, value: "str" }
let kp2: KeyPair<string, number> = { key: 'test', value: 123 }

interface IPlus<T> {
  (a: T, b: T) : T
}
function plus(a: number, b: number): number {
  return a + b;
}
function connect(a: string, b: string): string {
  return a + b
}
const a: IPlus<number> = plus
const b: IPlus<string> = connect
```

