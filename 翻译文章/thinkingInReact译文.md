# Thinking in React[原文地址](https://facebook.github.io/react/docs/thinking-in-react.html)
在我们看来，React是使用javascript构建大型，高性能的web应用程序的首选方法。它在FaceBook和Instagram中有非常良好的拓展表现。

React最伟大的部分之一是它促使你思考如何创建应用程序。在这篇文档中，我们将使用React创建一个可搜索的产品数据表格，并引导你完成整个的思维过程。

## Start With A MoCk
想象我们已经有一个jSON APi，以及从设计师获取的mock数据。mock数据如下：
![](https://facebook.github.io/react/img/blog/thinking-in-react-mock.png)

我们的JSON API返回的数据类型看上去像这样：

    [
      {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
      {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
      {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
      {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
      {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
      {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
    ];


## 第一步：把UI打散成一个组件树
第一件你要做的事就是根据mock的数据画出每个组件的盒子模型并且定义它们的名称。如果你和一个设计师合作，他们没准已经完成了这项工作，和他们谈谈！它们的Photoshop层的命名没准最后会用于你的React组件名称。

但是你该如何定义一个组件呢？就使用和你创建新函数和新对象一样的方法：[单一职责原则](https://en.wikipedia.org/wiki/Single_responsibility_principle)。就是一个组件应该只做一件事情。如果它的业务不断拓展，那么应该把这个组件解构成更小的组件。

如果你经常展示一个给用户呈现JSON数据模型，你会发现如果你的模型构建正确的话，你的UI（这里就是你的模块结构）就会很好的和json数据映射上。这是因为UI和数据模型本来就遵循相同的信息架构，这意味着分割你的UI成组件比较容易。
! [](https://facebook.github.io/react/img/blog/thinking-in-react-components.png)

我们会发现有5个组件在我们的例子里。
1. `FilterableProductable`:包含整个例子代码。
2. `SearchBar`:接收用户输入。
3. `ProducTable`:展示并基于用户输入筛选数据。
4. `ProductCategoryRow`:展示每一个分类的头部。
5. `ProductRow`:展示每个产品列。

如果你观察`ProductTable`,你会发现这个表头（包含名称和价格两个标签）不是它自己的组件。这是一个个人偏好选择，两种方式都有争论。在这个例子里，我们保留这部分在ProductTable组件里，因为它是ProductTable-渲染数据集的一部分职责。但是，如果这个表头变的特别负责，那么就值得创建一个它自己的`ProductTableHeader `组件。

既然我们已经确定了组件，我们来安排他们的层级关系。如下图：

        FilterableProductTable
            SearchBar
            ProductTable
                ProductCategoryRow
                ProductRow

## 第二步：创建一个react静态版本
既然你已经有了你的组件树，是时候实现你的app了。最简单的方式是构建第一个版本：只使用你的数据模型和渲染ui但是不添加交互。这是最好的解构因为构建一个静态版本需要打很多代码代而不用过多思考，添加交互正好相反：少量代码，大量思考。

创建你的app的静态版本来渲染你的数据模型。你将要构建组件：能复用其他组件并且使用props传递数据。props是一种从父组件向子组件传递数据的方式。如果你熟悉state的概念，在创建静态版本的时候不要用state。state是专门用来实现交互的，随着时间改变的数据。

你可以构建组件从顶端到底端或从底端到顶端。（从树的根节点构建或者从树的叶子节点构建）。在简单的例子中，从顶到底简单些，在大项目中，从低到顶简单些而且也容易写测试用例。

在这一步的最后，你会有一个可复用的渲染数据的组件库。只包含render方法。组件树的顶端（FilterableProductTable）将会使用你的数据模型作为prop。如果你改变你的底层的数据模型，UI就会改变。这将使你很容易看到你的UI是怎么更新的并且在哪儿更新因为没有复杂的交互发生。React的单向数据流保证一切模块化并且性能块。

## 第三步：识别能代表UI的最小（但完整）的state集合
你必须考虑你的app需要的可变对象state的最小集合。关键是DRY原则：Don not repeat your self。最小化原则就是一切其他状态都能根据你选择的最小集合推算出。比如说，如果你做todolist，就保持一个todoitems即可，而不要设置长度count。因为长度可以根据todoitems推算出。
考虑到我们的例子，我们有：
** 产品的原始列表
** 用户输入的搜索项
** checkbox的值
** 筛选后的产品列表
我们判断下哪些可以作为状态。就问三个问题：
1. 是否从父元素传递或者通过props传递？如果是，就不是state
2. 是否随着时间改变而值不变？如果是，就不是state
3. 你能根据其他的状态计算出来吗？如果是，不是状态
产品的原始列表通过props传递，因此不是state。筛选后的产品列表可以根据产品列表和搜索项计算出，不是状态。
因此用户输入的搜索项和checkbox值是状态。

## 第四部 识别你的状态应该在哪个模块
你应用的每个状态：
** 识别每个基于该状态渲染某些东西的组件
** 找到一个常用的所有者组件（一个独立组件在所有组件之上）
** 公共所有者或者其他组件中层次较高的应该拥有状态

