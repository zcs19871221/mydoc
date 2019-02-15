# 其他
1. react内部怎么改变元素都没关系，但是实际渲染的时候，会把真正要改变的dom元素找出来，只改变需要改变的dom元素。
# jsx相关
1. jsx是js语言的一种拓展用来表现html。
2. jsx表达式解释后返回的是一个js对象。
3. jsx中html标签的属性和html有区别，使用骆驼形式写法`tabindex becomes tabIndex.`
4. 以html形式写jsx和通过React.createElement是一样的。
5. jsx中的js表达式用{}包装，字符串可以直接写attr="attr"

# 元素
1. 元素都是不可变对象，只能通过render改变。但是建议只定义一个render

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
3. 事件函数中的this必须手动绑定，默认是undefined; 常见做法是在class中命名公用方法，然后在constructor中命名this.fn = fn.bind(this);这样绑定到this。更好的方法是使用箭头函数，自动绑定this到环境this。

# jsx语法中的逻辑和嵌套
可以在component中使用js语法来决定render哪些元素，也可以在jsx表达式中直接使用&&和三目表达式实现逻辑判断。最好用{hasXX && XX}的方式，不会影响组件的相对位置，其他组件不会从新渲染。

## 如何渲染列表元素
1. 直接在{}表达式中输出一个列表就行了，每一个项目是一个元素。
2. 必须在每一个列表项目中设置一个属性key相对他的兄弟元素独一无二的值，是为了react使用。（为了复用，最好是根据内容决定的id，这样即使位置改变也不会有问题）
3. 在{}内可以用任意表达式。
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

# 关于更新引用对象，比如列表中的对象属性
1. 如果直接更改state而不是用不要setState可能会有问题：
比如更改后，没有立即调用setState（因为是异步的），而是随后别其他的调用，有可能被刷掉。

# 如何决定是props还是state
1. 从父组件传递的props不会是state
2. 随时间不改变的不是state
3. 可以根据其他state计算出来的不是state

# 如何决定一个state是属于子元素还是父元素
1. 辨识出每个要基于这个state渲染的组件
2. 找出从层级结构上属于上面找出的所有组件的父元素的组件。
3. 这个共同拥有组件者或者更高层级的拥有这个state。
4. 如果你找不到一个合理的拥有它的组件，那么就创建一个新的拥有者组件，并且放到第一步找到的组件的层级上面。
Identify every component that renders something based on that state.
Find a common owner component (a single component above all the components that need the state in the hierarchy).
Either the common owner or another component higher up in the hierarchy should own the state.
If you can't find a component where it makes sense to own the state, create a new component simply for holding the state and add it somewhere in the hierarchy above the common owner component.

# jsx语法
1.jsx元素不能使用表达式，可以使用大写的变量

    const SpecificStory = components[props.storyType];
     return <SpecificStory story={props.story} />;

2. props默认值是true

3. jsx中的字符串会做trim，去除空白行，首尾的换行，文字中的换行会看做空格。
4. {}设置函数可以作为函数参数传递props.childen
  
    function Repeat(props) {
      let items = [];
      for (let i = 0; i < props.numTimes; i++) {
        items.push(props.children(i));
      }
      return <div>{items}</div>;
    }

    function ListOfTenThings() {
      return (
        <Repeat numTimes={10}>
          {(index) => <div key={index}>This is item {index} in the list</div>}
        </Repeat>
      );
    }
5. false, true, null, or undefined这几个值在{}输出的时候不会渲染。但是0会

# ref控制原生dom
通过设置标签属性ref,设置一个回调：elem => {}回调的第一个参数就是元素。还可以通过在父组件中设置回调并传递的方式把dom元素保存在父组件中。

# defaultValue多用于非控制组件设置初始值（非控制组件就是不设置value和回调的函数，用ref原生控制dom）

# react核心
react的核心就是每次render全部的dom。这样简单但是对性能要求高。
但是从一棵树转变成另一棵树的复杂度是o(n3)，通过算法从n3的复杂度降低到了o(n).
基于这样的假设：
1. 同样类的两个组件创建相同的树，不同类的组件创建不同的树
2. 在整个渲染过程中给元素创建一个唯一值。

所以这样做比较好：
1. 如果两次渲染过程中改变了一个组件的类，那么就会不太好
2. 给元素一个稳定不变，唯一的Id可以提高效率。key="xxx".但如果key不是唯一值的话，会有问题。

# 如何增加性能
1. 通过设置shouldComponentUpdate方法，返回true或者false决定是否更新组件。
2. 不继承Component而是继承PureComponent的话，会自动检查state和props，如果相等就不会进行渲染。但是这样如果更新数组或对象的话，是不会比较出来的。所以要使用immutable库或者Object.assign({}, oldObject);或者[].slice方法改变引用，让程序认为是完全改变了，好触发render方法。

# api相关
render是纯函数。交互最好放到其他周期函数中。
componentWillMount设置setState不会触发重新渲染。
componentDidMount适宜执行读取数据，初始化网络请求。设置setState会触发重新渲染。

顺序
componentWillMount componentWillUpdate render mountDom componentDidMount

# 除了aria-*和data-*属性外，其他所欲属性都变成驼峰命名
dom属性：
checked
htmlFor
selected
style：对象

    accept acceptCharset accessKey action allowFullScreen allowTransparency alt
    async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge
    charSet checked cite classID className colSpan cols content contentEditable
    contextMenu controls coords crossOrigin data dateTime default defer dir
    disabled download draggable encType form formAction formEncType formMethod
    formNoValidate formTarget frameBorder headers height hidden high href hrefLang
    htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label
    lang list loop low manifest marginHeight marginWidth max maxLength media
    mediaGroup method min minLength multiple muted name noValidate nonce open
    optimum pattern placeholder poster preload profile radioGroup readOnly rel
    required reversed role rowSpan rows sandbox scope scoped scrolling seamless
    selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step
    style summary tabIndex target title type useMap value width wmode wrap

# react事件
默认对象属性

    boolean bubbles
    boolean cancelable
    DOMEventTarget currentTarget
    boolean defaultPrevented
    number eventPhase
    boolean isTrusted
    DOMEvent nativeEvent
    void preventDefault()
    boolean isDefaultPrevented()
    void stopPropagation()
    boolean isPropagationStopped()
    DOMEventTarget target
    number timeStamp
    string type

# react的事件回调结束后会回收，因此异步方法不能再次访问event对象除非调用event.persist()

# react默认事件捕获于冒泡阶段，如果想在捕获阶段的话，添加Capture用使用onClickCapture

# react-router
    <Route path="/user/:username" component={User}/>
    const User = ({ match }) => {
      return <h1>Hello {match.params.username}!</h1>
    }
如果component中是函数的话，每次匹配都会进行渲染，就会创建一个新的组件。

# 我的ajax和组件组织
1. 所有ajax请求封装在ajaxHoc高阶组件中。
2. 给ajaxHoc高阶组件传递ajaxConfig和resCb，ajaxConfig当不同的时候，调用ajax请求。当ajax数据返回的时候，调用resCb处理数据，传递给下面的组件。resCb返回值必须是对象，如果没有resCb的话，默认放到下面组件的ajaxData属性中。
3. 高阶组件初始化一次后，一直使用。再次触发请求根据props的ajaxConfig是否相同和reLoad判断。
3. 对于table和filter结合的情况：
    1. 只设置最小化的state
    2. 设置ajaxHoc的config为一个定制，只根据需要触发的时候，改变config值，发送请求。
    2. 设置触发ajax请求函数：根据当前state计算提供给ajaxHoc组件的ajaxConfig，全新的config，然后设置state为isSearching = true。这样在更新的时候，HOC组件发现config变了，自动发送请求。
    3. 把table包装在WrapTable组件中，做一些通用处理。

# react组件开发心得
1. 确定输入props
2. 查看可能的交互
3. 根据交互决定状态state
4. 根据交互决定输出-对其他组件的反馈（其他组件通过props传递的回调函数）
5. 确定props,state的类型
6. 确定props的默认值
7. 确定state的初始化值
    1. state在constructor中初始化
    2. state在componentWillReceiveProps中是否要初始化值

# react渲染相关
1. 渲染的props尽量不要用箭头函数，因为每次从新渲染组件的时候，箭头函数都会变，相当于传递给子组件的props都会变。都会重新渲染。

比较下面方式1和方式2，方式一每次都会传一个全新的onClick进去,即使是基本组件,也会重新渲染.而如果用方式2,只要e不变,就不会从新渲染.
react每次渲染都会记忆,并比较.

      {
          list.map(e => {
            <!-- 方式1 -->
            return <div onClick={() => {
              alert(e);
            }}></div>
            <!-- 方士2 -->
            return <Each data={e}>
          })
      }
      class Each extends React.Component {
        static propTypes = {
          data: e
        }
        onClick=() => {
          alert(this.props.data);
        }
        render() {
          return (<div onClick={onClick}>{e}</div>)
        }
      }

2. 关于列表迭代的key
key的作用就是在迭代中告诉组件，如果每次迭代key的值不变，就认为是同一个组件，
因此不用创建新的组件而是复用这个组件。
因此key要保证在迭代中的值稳定，而不是每次不一样。
因此使用key={i}就可以了，有的文章说使用全局唯一值，纯粹胡说八道。
最好的方法是保持key在当前列表中唯一（根据内容生成固定的key,相同内容生成同样的key），这样可以保证list的顺序就算变了，也不会重复渲染。


# react命名
当父组件向子组件setStaet类型函数的时候，
不要命名handleEventxxx的形式，因为这时候父组件并不知道子组件要怎么用，
父组件传递的只是功能性的函数，所以要命名：
changeXXX 或者setXXX之类的

只有到了最底层组件，涉及真正的事件(click,mouseenter)之类的时候，在子组件里，
命名函数handleClick(Event)XXX,然后在这里头再调用父组件的setXXX功能函数。

# 选择性渲染优化
永远不要下面这样,因为这样react每次变化会从新remount所有元素。
其实并不是会永远remout，而是根据节点的相对位置，比如下面的原来是
1-c1 2-c2 3-c3，变成了1-c2 2-c3，这样每个位置都变了，所以就会remount所有。
但是如果显示，隐藏的是c3，就不会从新渲染c1,c2.

    if (this.state.c1) {
      return (
        <div>
          <C1></C1>
          <C2></C2>
          <C3></C3>
        </div>
      );
    } else {
        return (
          <div>
            <C2></C2>
            <C3></C3>
          </div>
        );
    }

要这样：
        return (
          <div>
            {this.state.c1 && <C1></C1>}
            <C2></C2>
            <C3></C3>
          </div>
        );
或这样

        let c1 = null;
        if (this.state.c1) {
           c1 = C1;
        }
        return (
          <div>
            {c1}
            <C2></C2>
            <C3></C3>
          </div>
        );
因为react会认为这两种的c2和c3位置没有变化而不会触发从新渲染。
结论：永远不要使用多return语句在你的render方法里，而要使用嵌入的jsx表达式或者变量。
# 最佳实践
1. 除了涉及state，lifecycle，性能优化(尽量少用函数组件，用PureComponent替换，提升效率)
2. propTypes和defaultProps尽量早写，作为文档使用。
3. 类中的函数如果要绑定this的话，使用箭头函数的方式，因为箭头函数的this是所属环境的。这样省了绑定this了。

    handleSubmit = () => {

    }
4. 如果setState涉及旧state属性，使用函数
5. 在render中解构props，优点1.减少this.props的书写 2.减少对索引的搜索。

    const {
      model,
      title
    } = this.props

6. 防止传递新的闭包函数到子组件，因为每次都是一个新函数，会每次re-render
7. import时候上边是依赖的引用，换行分割依赖引用和本地引用
8. 组件接收超过两个props的话，分割换行展示
7. 人家的代码

        import React, { Component } from 'react'
        import { observer } from 'mobx-react'
        import { string, object } from 'prop-types'
        // 分割开本地引用和依赖引用
        import ExpandableForm from './ExpandableForm'
        import './styles/ProfileContainer.css'

        // Use decorators if needed
        @observer
        export default class ProfileContainer extends Component {
            state = { expanded: false }
            // Initialize state here (ES7) or in a constructor method (ES6)
            
            // Declare propTypes as static properties as early as possible
            static propTypes = {
                model: object.isRequired,
                title: string
            }

            // Default props below propTypes
            static defaultProps = {
                model: {
                id: 0
                },
                title: 'Your Name'
            }

            // Use fat arrow functions for methods to preserve context (this will thus be the component instance)
            handleSubmit = (e) => {
                e.preventDefault()
                this.props.model.save()
            }
            
            handleNameChange = (e) => {
                this.props.model.name = e.target.value
            }
            
            handleExpand = (e) => {
                e.preventDefault()
                this.setState(prevState => ({ expanded: !prevState.expanded }))
            }
            
            render() {
                // Destructure props for readability
                const {
                model,
                title
                } = this.props
                return ( 
                <ExpandableForm 
                    onSubmit={this.handleSubmit} 
                    expanded={this.state.expanded} 
                    onExpand={this.handleExpand}>
                    // 超过两个props的话，分割换行
                    <div>
                    <h1>{title}</h1>
                    <input
                        type="text"
                        value={model.name}
                        // onChange={(e) => { model.name = e.target.value }}
                        // Avoid creating new closures in the render method- use methods like below
                        onChange={this.handleNameChange}
                        placeholder="Your Name"/>
                    </div>
                </ExpandableForm>
                )
            }
        }
