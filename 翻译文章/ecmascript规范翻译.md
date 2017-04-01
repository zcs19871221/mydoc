# 8 Types
[原文](http://www.ecma-international.org/ecma-262/5.1/#sec-8)
这篇规范文档的每一个算法中的操作的值都关联一种类型。这些类型都会在这一章节定义。类型被划分成Ecmascript语言使用类型和标准使用类型两类。

ecmascript语言类型关联的类型就是ecmascript程序中使用的类型。包括null，undefined，Boolean，String，Number和Object六种。

标准使用类型关联的是元数据，在算法中使用为了描述Ecmascript语言结构和Ecmascript的类型。标准使用类型是`Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, and Environment Record. `标准使用类型是标准独有类型不用关联到Ecmascript的具体实现。标准类型的值用来描述ecmascript表达式的中间值，但是并不会保存在ecmascript的实际对象中。

在这个标准中，符号`Type(x)`是 `x的类型`的简写，而类型具体指的就是下面定义的ecmascript语言类型和规范类型。

## 8.7 The Reference Specification Type
[原文](http://www.ecma-international.org/ecma-262/5.1/#sec-8.7)
引用类型用来解释类似delete，typeof和分配的行为。举个例子，分配运算符左侧
的操作数期望用来产生一个引用。赋值的行为，有可能被解释成截然不同，根据分析赋值符左侧操作数的句法形式。函数调用被允许返回索引。

一个引用是一个解析的名称绑定。一个引用由三部分组成，base值，引用名称和布尔值的严格标识。base值有可能是undefined,object,boolean,stirng,number或者一个`environment record`。一个值为undefined的base显示这个引用不可以解析成一个绑定。引用名称是字符串类型。

下面的抽象运算方法仅在规范中使用来访问引用的组件：
GetBase(V). 返回引用V的base值。
GetReferencedName(V). 返回引用V的引用名称
IsStrictReference(V).返回引用的严格标识。
HasPrimitiveBase(V). 如果base值是Boolean，String或者Number的话返回true。
IsPropertyReference(V). 返回true如果basevalue是一个对象或者HasPrimitiveBase(V)是true。否则返回false。
IsUnresolvableReference(V). 返回true，如果base值是undefined或者false。



