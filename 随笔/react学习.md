# 其他
1. react内部怎么改变元素都没关系，但是实际渲染的时候，会把真正要改变的dom元素找出来，只改变需要改变的dom元素。
# jsx相关
1. jsx是js语言的一种拓展用来表现html。
2. jsx表达式解释后返回的是一个js对象。
3. jsx中html标签的属性和html有区别，使用骆驼形式写法`tabindex becomes tabIndex.`
4. 以html形式写jsx和通过React.createElement是一样的。

# 元素
1. 元素都是不可变对象，只能通过render改变。但是建议只用一次render

# 组件
组件把元素切分成一个一个独立，可复用的UI。
1. 组件类似于面向方法编程中的纯函数，Props（属性）是不可改变的。
2. 组件必须以大写开头，以区分组件和普通的html元素。因为当我们写一个jsx元素的时候，如果遇上自定义的tag标签，就认为是一个组件。大写的可以很好的区分。
3. 组件必须返回一个独一无二的根元素以方便复用。
4. 组件可以以两种方式定义
    1. 普通函数
    2. 类继承方式
5. 对于大项目来说，组件越小颗粒越好，便于复用。solid中的i原则。
6. 组件props的参数名称命名要基于组件自己的考虑而命名而不要基于调用这个组件的上下文来命名。

# 组件状态和周期函数

class x extends React.Component {
    componentDidMount() {

    }
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
    render() {
        return 
    }

}
0. 组件通过`class A extends React.component`的方法实现更多的方法。（相比较用简单函数）
1. 组件的构造函数必须执行`super(props);`
1. class类型组件的调用过程
        1. 页面通过`ReactDom.reander`调用组件
        2. 执行组件的构造函数，初始化state，props
        3. 执行组件的方法，`render`
        4. 插入到页面后，执行`componentDidMount`钩子函数
        5. 如果组件内部通过`setState`方法改变state的值，那么内部会检测到，自动调用render方法更新页面元素。
        6. 当页面的组件从dom中移除，执行`componentWillUnmount`方法。
1. 状态`this.state`和props不同，是一个可变的对象。
2. 只有在组件的构造函数中允许直接赋值this.state = xxx;除此以为要使用.setState方法，这样组件监听到state改变会重新渲染页面。
3. setState方法有可能是异步的，因为内部可能会合并多个setState方法的调用。所以如果在setState中直接使用state的值可能不正确（真正执行的时候state已经变了）

# jsx事件
1. 事件名称是骆驼命名，基于[w3c标准](https://www.w3.org/TR/DOM-Level-3-Events/)
2. 必须使用preventDefault来取消默认，return false不可以。
3. 事件函数中的this必须手动绑定，默认是undefined; 常见做法是在class中命名公用方法，然后在constructor中命名this.fn = fn.bind(this);这样绑定到this。

# jsx语法中的逻辑和嵌套
可以在component中使用js语法来决定render哪些元素，也可以在jsx表达式中直接使用&&和三目表达式实现逻辑判断。

## 如何渲染列表元素
1. 直接在{}表达式中输出一个列表就行了，每一个项目是一个元素。
2. 必须在每一个列表项目中设置一个属性key相对他的兄弟元素独一无二的值，是为了react使用。
3. 在{}可以用任意表达式。
## jsx中如何处理input，select等form元素以及模拟双向绑定。
### 单向数据输出
1. input,textarea设置value={this.state.xx}
2. select在select标签上设置value={this.state.xx},默认value相等的选中

### dom反馈数据
1. 设置onchange事件，在事件里调用this.setState({xx:event.target.value})
2. 定义一个onchange事件函数，通过name属性动态设置需要的值。而且setState是你改哪儿，只更新对应的dom。

        const name = target.name;
        this.setState({
          [name]: value
        });

### 子组件共享状态
1. 父组件传递state和回调函数作为子组件的props，这样当子组件更新的时候，调用父组件的函数更新父组件的state属性，然后setState后，子组件也刷新，重新接受props
2. 如果想要共享状态，最好是把共享状态提升到父组件，数据流遵循从上到下的规范较好。
3. 比起双向绑定的好处是更不容易出错，查找问题更简单，只需一个一个组件往上找即可。缺点就是要写多一些的样板代码。

## props.children属性
组件的子元素相当于props.children

    <FancyBorder color="blue">
      【props.children
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
      】
    </FancyBorder>
