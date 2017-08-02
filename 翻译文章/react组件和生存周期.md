# react组件和生存周期
[原文地址](https://facebook.github.io/react/docs/react-component.html)
![](./image/react-lifecycle.jpg)
只要看这张图就够了。第二行的行为是更新时候执行的函数，和第一行初始化是隔离的。就是第一行不会执行第二行的函数，反之亦然。
网络请求可在componentDidUpdate和componentDidMount里请求。
## TL;DR
1. render是纯函数，不要在里头更改state
2. constructor是初始化state的正确地方。
3. constructor的用途就是初始化state和使用bind绑定函数。
4. componentWillMount里可以同步修改state状态而不会重新渲染，因为render方法随后执行。
5. componentDidMount方法里可以执行Dom初始化操作和发ajax请求操作。
6. componentWillReceiveProps里执行当props改变，state随之改变的操作。
7. componentWillUnmount清空计时器，取消网络请求，清楚再DidMount里创建的元素。

组件能够把UI分割成独立的，可复用的小块，并且组件之间是完全隔绝的。`React.Component`由`React`提供.

## 总览
`react.Component`是一个抽象父类。很少直接使用`React.Component`.一般都会继承，并且定义一个`render()`方法。

一般如下定义一个组件为一个js类：

    class Greeting extends React.Component {
      render() {
        return <h1>Hello, {this.props.name}</h1>;
      }
    }

如果不使用Es6，使用`create-react-class`类。查看[不用es6如果使用react](https://facebook.github.io/react/docs/react-without-es6.html)来了解更多。

### 组件生存周期

每个组件有几个周期方法，你可以重定义这些方法来，在周期过程中执行自己的代码。前缀`will`的方法是在事件发生前执行，前缀`did`的方法是在事件结束后执行。

#### Mounting
这些方法在组件被创建并且插入到Dom中时执行：
* `constructor()`
* `componentWillMount()`
* `render()`
* `componentDidMount()`

#### Updating
props改变或者state改变会触发一次更新。下面这些方法将会在组件重新渲染时候执行：
* `componentWillReceiveProps()`
* `shouldComponentUpdate()`
* `componentWillUpdate()`
* `render()`
* `componentDidUpdate()`

#### Unmounting
这些方法在组件从DOm移除时执行：
* `componentWillUmount()`

### 其他的API
每个组件还提供其他API:
* `setState()`
* `forceUpdate()`

### 组件类属性
* `defaultProps`(props为空或者undefined时候默认值)
* `displayName`

### 实例属性
* `props`
* `state`

## 索引
### render()
        render()

`render()`方法是不可少的。

当调用时，它会检查`this.props`和`this.state`并且放回一个单独的React元素.这个元素既可以是原生dom组件，比如`<div>`也可以是其他你自定义的组件。

你也可以返回`null`或者`false`来表示你不想渲染任何东西。当返回`null`或者`false`，ReactDom.findDOmNode(this)将会返回`null`.

`render()`方法应该是纯函数(不改变任何值，只输出),就是说它不改变组件state，每次调用render返回结果都是一样的，并且render不直接和浏览器交互。如果你需要和浏览器交互，在`componentDidMount()`或其他生存周期函数里执行。保持render()纯粹将会让组件更容易理解。

    注意
    如果shouldComponentUpdate()方法返回false的话render()不会调用。

### Constructor()
    constructor(props)
在组件挂载之前执行constructor。当在React.component的子类中实现了constructor函数，你必须调用super(props)方法。否则，this.props将会是undefined。

constructor函数是初始化state的正确位置。如果你不初始化state并且使用bind绑定函数，那么你就不需要实现一个constructor函数。

基于props初始化state是可以的。这个有效的复制了props并且设置初始化state值为props的值。下面是例子：

    constructor(props) {
      super(props);
      this.state = {
        color: props.initialColor
      };
    }

注意这个模式，state不会随着任意props的更新而更新。通过[状态提升](https://facebook.github.io/react/docs/lifting-state-up.html)来保持props和state同步。

### componentWillMount()
    componentWillMount()

`componentWillMount()`在挂载到页面前立即调用。在render()方法调用之前执行，因此在这个方法里同步设置state不会触发一次重新渲染。避免在这个方法里订阅或执行有副作用的操作。

### componentDidMount()
    componentDidMount()

`componentDidMount()`在组件挂载之后立即执行。需要访问Dom节点的初始化操作应该在这里执行。如果你需要从远程获取数据，那么这个方法是实例化网络请求的好地方。在这里设置state将会触发重新渲染。

### componentWillReceiveProps()
    componentWillReceiveProps(nextProps)

`componentWillReceiveProps()`在一个挂载的组件接收新props之前调用。如果你需要更新state状态以响应props的更改，那么可以通过比较this.props和nextProps，并使用this.settate()执行状态转换。

注意就算props没有改变，React也会执行这个方法。因此你需要比较nextProps和this.props的值来决定是否props更改了。

React不会在mounting阶段时候调用这个方法。只有在组件的磨削props改变的时候才会调用这个方法，调用this.setState一般不会触发这个方法。

### shouldComponentUpdate()
    shouldComponentUpdate(nextProps, nextState)

使用shouldComponentUpdate()让React知道组件的输出是否不受当前state或props的影响。默认的行为是在state改变时重新渲染，最好依赖默认行为。

接收到新props或者新state准备渲染之前调用shouldComponentUpdate().默认返回是true。在初始化渲染或者使用forceUpdate()方法的时候不会调用这个方法。

如果返回false的话，当子组件的state变化的时候不会阻止子组件重新渲染。

如果这个函数返回false的话，后续的componetWillUpdate，render，ComponentDidUpdate方法不会调用。注意未来React没准会对待这个方法作为一个提示而不是直接的指示，没准以后即使返回false组件也会重新渲染。

如果你确定一个组件很慢的话，你可以继承React.PureComponent，实现了一个简单的shouldComponentUpdate方法来进行一个prop和state的浅比较。如果你要自己实现这个方法的话，比较this.props next.props this.state next.state然后返回true或者false。

### componentWillUpdate()
    componentWillUpdate(nextProps, nextState)

当新的props或者state接收的时候，componentWillUpdate(nextProps, nextState)在render执行前立刻调用。这个函数是一个在更新发生前的准备函数。这个函数不会在初始化渲染时候执行。

不能在这个函数里调用setState()。如果你的state要根据props改变而改变的话，在componentWillReceiveProps()执行。

### componentDidUpdate()
    componentDidUpdate(prevProps, prevState)

componentDidUpdate(prevProps, prevState)在更新后立刻调用。在初始化渲染的时候会执行。

是一个执行dom操作的地方。也可以执行网络请求。

### componentWillUnmount()
    componentWillUnmount()

componentWillUnmount()在组件卸载和销毁前立刻执行。在这里执行可能的清除方法。比如说无效化计时器，取消网络请求，或者清空我们在componentDidMount中创建的DOm元素。




