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
