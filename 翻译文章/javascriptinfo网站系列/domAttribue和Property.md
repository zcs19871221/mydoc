原地址
http://javascript.info/dom-attributes-and-properties

# Attribute(特性)和property(属性)
当浏览器载入页面，会读取（或者说parse）html文本，并根据文本生成Dom对象。对于元素节点来说，大多数标准attribute会自动变成dom属性。

举个例子，标签`<body id="page">`会变成dom元素`body.id="page"`

但是attribute属性与dom属性不是一一对应的。在这章里，我们会专注于区分这两个概念，来看看他们怎么工作，什么时候他们一样，什么时候不一样。

## TLDr;
1. dom
    1. dom是js对象
    2. dom属性可以是任意js类型，大小写敏感。
        1.（可以设置任何属性，并且读出来的也不一定是字符串，比如checkbox.checked是布尔）
        2. 比如dom.style是对象
    3. 可以改变父级dom对象的prototype，会影响所有子集（给Element添加prototype方法）
2. attribute
    1. 是html的属性。标准的html attributes会自动转换成dom属性。
    2. htmlattributes不区分大小写。只能设置成字符串。
    3. 可以通过hasAttribute,setAttribute,getAttribute,removeAttribute方法处理attributes
    4. outerHTML会显示所有attributes，包括我们设置的attribute
    5. element.attribute是所有attribute的集合，包括value和name属性的对象。
3. attribute和dom property的转换关系：
    1. 对于标准属性，两者是双向同步的，但是有一些特例：
        1. value，改变attributes会改变property，但是反之不会。这样可以利用attributes设置propery来回复初始值。
    2. 有些标准属性，两者是双向同步的，但是类型或显示不同
        1. style,propery是对象，attributes是字符差。
        2. checked,propery是布尔，attributes是字符差。
        3. href，propery永远显示完整地址，即使attributes是相对地址或hash（会根据attributes做一些转换）
    2. 对于非标准attribut，不会转换成dom属性。但是可以通过data-*来设置。data-*是给用户预留的非标准属性，防止用户自定义的attributes和以后标准新加的标准属性冲突。可以通过dom的dataset property属性读取用户自定义attributes。如果data-a-b的话，就用驼峰实dataset.aB

## Dom属性
我们已经看到了上面的内置dom属性。有许多。但是这个并不会限制我们，还不够。我们可以自己田间。

Dom节点就是一个普通的js对象。我们可以改变他们。

举个例子，我们创建一个新属性在`document.body`中：

    document.body.myData = {
        name: 'Caesar',
        title: 'Imperator'
    };

    alert(document.body.myData.title); // Imperator

我们可以自己添加方法：

    document.body.sayHi = function() {
        alert(this.tagName);
    };

    document.body.sayHi(); // BODY (the value of "this" in the method is document.body)

我们还可以修改内置的prototypes属性，比如`Element.prototype`并通过给Element添加新方法实现对所有元素添加方法：

    //给父类Element的prototype添加方法，等于给所有子类添加
    Element.prototype.sayHi = function() {
        alert(`Hello, I'm ${this.tagName}`);
    };

    document.documentElement.sayHi(); // Hello, I'm HTML
    document.body.sayHi(); // Hello, I'm BODY

因此，Dom属性和方法就像其他的标准js对象一样。
* 他们可以有任何值
* 他们是大小写敏感的(`elem.nodeType`, not `elem.NoDeTyPe`)

# html Attribute
html语言中，标签可以有很多attributes。当浏览器读了html文本并根据这个dom创建标签的时候，他会认出标准的htmlattribute并且根据他们创建dom属性。

因为当一个标签有id或者其他标准attribute时候，对应的dom属性被创建。但是非标准的attribute并不会发生：

    <body id="test" something="non-standard">
        <script>
            alert(document.body.id); // test
            // non-standard attribute does not yield a property
            alert(document.body.something); // undefined
        </script>
    </body>

要注意一个attribute对于一种元素来说标准的，对另一种元素来说可能不是。比如`type`attribute对于<input>来说是标准属性，但是对于<body>来说不是。在相应的元素类的规范中描述了标准属性

    <body id="body" type="...">
    <input id="input" type="text">
    <script>
        alert(input.type); // text
        alert(body.type); // undefined: DOM property not created, because it's non-standard
    </script>
    </body>

因此，如果一个元素是非标准的，将不会产生对应的DOm属性。但是，我们有方法来访问这些attributes：

* `elem.hasAttribute(name)` - 检查是否存在
* `elem.getAttribute(name)` - 获取值
* `elem.setAttribute(name)` - 设置值
* `elem.removeAttribute(name)` - 去掉值

这些方法与html中写的一致。

我们还可以使用`elem.attributes`来读取所有属性：一个内置的attr类实例的集合，有name和value属性。

例子是读取一个非标准attribute：

    <body something="non-standard">
    <script>
        alert(document.body.getAttribute('something')); // non-standard
    </script>
    </body>

htmlattributes有以下特征：
* 大小写不敏感
* 总是字符串

例子：

    <body>
        <div id="elem" about="Elephant"></div>

        <script>
            alert( elem.getAttribute('About') ); // (1) 'Elephant', reading

            elem.setAttribute('Test', 123); // (2), writing

            alert( elem.outerHTML ); // (3), see it's there

            for (let attr of elem.attributes) { // (4) list all
            alert( attr.name + " = " + attr.value );
            }
        </script>
    </body>

请注意：
1. `getAttribute('About')` 第一个字母是大写的，但仍然获得about属性，attribute不区分大小写
2. 我们可以给attributes设置任何value，但是value都会被转换成string。
3. 所有属性（包括我们设置的）都会在outHTML中可见。
4. attribute属性是所有attributes的集合，每个对象有value和name方法。

# attribute和dom property同步
当一个标准的attributes改变，相对应的dom属性会自动改变,反之亦然。除了一些特例。

比如下面的id，就是双向同步的：

    <input>

    <script>
    let input = document.querySelector('input');

    // attribute => property
    input.setAttribute('id', 'id');
    alert(input.id); // id (updated)

    // property => attribute
    input.id = 'newId';
    alert(input.getAttribute('id')); // newId (updated)
    </script>

但是有一些特例，比如`input.value`只从attributes->property，不从property->value

    <input>

    <script>
    let input = document.querySelector('input');

    // attribute => property
    input.setAttribute('value', 'text');
    alert(input.value); // text

    // NOT property => attribute
    input.value = 'newValue';
    alert(input.getAttribute('value')); // text (not updated!)
    </script>

在上面的例子中，
* 改变attribute的value，会导致dom property改变
* 但是改变dom property不能改变attribute

这个特征实际上很有用。因为用户可能改变`value`,如果我们想恢复初始值，使用attribute的value就可以。

## dom元素是有类型的

Dom属性并不总是字符串。比如，`input.checked`是布尔：

    <input id="input" type="checkbox" checked> checkbox

    <script>
    alert(input.getAttribute('checked')); // the attribute value is: empty string
    alert(input.checked); // the property value is: true
    </script>

比如，`style`attribute是字符串，但是`style`property是对象：

    <div id="div" style="color:red;font-size:120%">Hello</div>

    <script>
    // string
    alert(div.getAttribute('style')); // color:red;font-size:120%

    // object
    alert(div.style); // [object CSSStyleDeclaration]
    alert(div.style.color); // red
    </script>

甚至一个dom属性是字符串，他的表现也有可能和attributes不同！

比如，`href`的dom属性永远是完整Url，即使attributes包含相对地址或者仅仅是`#hash`

    <a id="a" href="#hello">link</a>
    <script>
    // attribute
    alert(a.getAttribute('href')); // #hello

    // property
    alert(a.href ); // full URL in the form http://site.com/page#hello
    </script>

## 非标准attributes，dataset
当写html是，我们用了大量标准属性。但是非标准或者用户定义？首先让我们看看是否要使用它们，为什么？

有些时候非标准属性用于传递自定义数据从html到js，或者为js标记html元素。

    <!-- mark the div to show "name" here -->
    <div show-info="name"></div>
    <!-- and age here -->
    <div show-info="age"></div>

    <script>
    // the code finds an element with the mark and shows what's requested
    let user = {
        name: "Pete",
        age: 25
    };

    for(let div of document.querySelectorAll('[show-info]')) {
        // insert the corresponding info into the field
        let field = div.getAttribute('show-info');
        div.innerHTML = user[field]; // Pete, then age
    }
    </script>

还可以用来样式化元素。

例如，这里为了订单状态，使用属性order-state：

    <style>
    /* styles rely on the custom attribute "order-state" */
    .order[order-state="new"] {
        color: green;
    }

    .order[order-state="pending"] {
        color: blue;
    }

    .order[order-state="canceled"] {
        color: red;
    }
    </style>

    <div class="order" order-state="new">
    A new order.
    </div>

    <div class="order" order-state="pending">
    A pending order.
    </div>

    <div class="order" order-state="canceled">
    A canceled order.
    </div>

为什么这个属性可能比像.order-state-new，.order-state-pending，order-state-cancelled这样的类更可取？

那是因为一个属性更方便管理。状态可以被改变为

    // a bit simpler than removing old/adding a new class
    div.setAttribute('order-state', 'canceled');

为了防止用户使用自定义的attributes在将来可能造成和新的标准attributes冲突，我们使用data-*来专门标记用户attributes

所有以“data-”开头的属性都保留给程序员使用。
它们在数据集属性中可用。
例如，如果一个elem有一个名为“data-about”的属性，它可以用elem.dataset.about。

    <body data-about="Elephants">
    <script>
    alert(document.body.dataset.about); // Elephants
    </script>

像数据订单状态这样的多字词属性是驼峰式的：dataset.orderState。
这是一个重写的“订单状态”的例子：

    <style>
    .order[data-order-state="new"] {
        color: green;
    }

    .order[data-order-state="pending"] {
        color: blue;
    }

    .order[data-order-state="canceled"] {
        color: red;
    }
    </style>

    <div id="order" class="order" data-order-state="new">
    A new order.
    </div>

    <script>
    // read
    alert(order.dataset.orderState); // new

    // modify
    order.dataset.orderState = "pending"; // (*)
    </script>


## 总结
* attribute- 写在html中的
* property- 用于jsdom中的

比较
        Properties	                    Attributes
类型	 任意值，标准属性标准中有定义	        字符串
命名  大小写敏感                       大小写不敏感

大多数情况下，dom属性就可以满足我们。我们只应该在需要确切的attributes时才使用：
* 我们使用一个非标准属性，但是可以用data-*时候，使用data-*
* 我们希望读取html中的写入值。dom属性的值和attribute有所不同，比如href我们需要原始的时候。