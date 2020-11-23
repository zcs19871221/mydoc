# 如果可以，尽量不使用 getDerivedStateFromProps(componentWillReceiveProps)

地址：https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
这样数据源不单一，容易出问题（确实）

## 概述

当设计一个组件的时候，最重要的是决定他的数据是受控的（数据全部通过 props 传递）还是非受控的（有 state 存在，父组件不能完全通过 props 控制）。

不要试图镜像一个状态，要让组件变成受控组件，并在某个父组件的状态下合并两个不同的值。

举个例子，一个 input 输入框，需要接收一个初始值，并记录用户随时编辑的值。你不应该通过 props 接收这个值后，然后在 state 里再维护一个 draft 状态。你应该在父组件的 state 里同时维护一个 draftValue 值和 committedValue 值来直接控制子组件。这样可以让数据流向更明确和可预测。

对于一个非受控组件，如果你要根据一个 props 的变化重置自己的状态的话，你有以下选择：

推荐：使用 react 的 key 属性来完全重置内部状态。

可选方案 1： 在 getDerivedStateFromProps 对特定属性进行比对，然后更新 state
可选方案 2：设置一个改变特定属性 state 的接口函数，然后父组件通过 ref 方法获取到这个接口，然后通过这个接口直接改变子组件的 state。

# 写 todolist 的问题记录

1. 一开始分离用例时候不够细，导致设计的 action 或者 reducer 或者 selector 的数据不全，一开始的用例分离必须十分细致。
2. 在写好 selector 和 action 链接到 connect 的时候，容易出错。在父组件向子组件传递 props 时候容易出错。
3. 组件越纯越好，只有 props 和最小化的 state，不要在顶部引入 connect 的组件,selector 等。可以先通过高阶组件传递预定义的 props，然后通过 connect 传递需要的 action 和 state 数据。
4. 不要把组件不关心的 props 给这个组件以用来传递给子组件。如果子组件需要数据的话直接使用 connect 链接数据到这个组件。（有人认为通过顶层统一传递好，但是这样看起来就乱，不好，而且 react 作者也觉着按需 connect 可以）

# 选择器

## 把 selector 和 reducer 写在一块，default 导出 reducer，name 导出 selector

好处：

1. 这样改变了 reducer 结构，可以立刻改变对应 selector
2. 这样只有这个文件知道 reducer 的真实结构，其他的文件都不知道 reducer 的结构。

## selector 如何提升性能

1. 缓存的条件是所有参数不变，形如 createSelector(A,B,C,D,...., mergeFunc)这样的，只要保证最终合并方法钱的 A,B,C,D 等选择器的值都和之前的不变，那么 mergeFunc 就不会执行，直接返回。
2. 因此，选择器的书写原则是
   1. 把类似 filter,map 这种会完全生成新对象的方法包装到 createSelector 中，让他依赖一个前置的选择器，比如一个固定 list，这样当这个 list 不变的时候，就不会执行自己的 filter,map 方法，不会造成组件的刷新。
   2. connect 中每一个属性用 createSelector 包装，禁止直接返回数组或对象，这样防止从新渲染。

# immutable 的问题

1. 使用 toJS 方法每次都创建不同的元素，这样如果在 connect 方法里面的话，会导致每次都渲染。
2. 解决方法是在 connect 的组件上再套一层高阶组件，在这里对 props 执行 toJS 方法，这样当 immutable 不变的时候，不需要执行 toJS 方法

# store 存储的数据类型不要有复杂的类对象

好处是：

1. 可以方便存到 localstorage
2. 可以方便从后端获取数据
   因为这两个地方只能存放最简单的 json 数据，如果你使用 moment 这种复杂对象直接保存到
   store 中，你在从 1 或者 2 获取数据的时候需要额外的进行数据转换。（不能直接 parse）

坏处是：

1. 获取数据后，使用前需要类型转换
2. 保存到 store 前要转换成 json 数据。

# fetch 数据时候，使用 then 的第二个参数处理网络请求失败，而不要在 catch 处理

因为 catch 的时候，你的错误可能包含 action,reducer 中的代码计算错误，这样两种错误就混淆了。
