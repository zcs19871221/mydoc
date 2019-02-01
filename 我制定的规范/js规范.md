# JavaScript 代码规范

## 适应情况

使用 babel 编译，并且搭配 eslint-zcs-config

## 目录

1. [命名规范](#naming-convention)
2. [变量定义](#variables)
3. [对象](#objects)
4. [数组](#array)
5. [字符串](#string)
6. [函数](#function)
7. [箭头函数](#arrow-function)
8. [类](#class)
9. [模块](#module)
10. [解构](#destruct)
11. [迭代遍历](#iter)
12. [操作符](#operator)
13. [条件控制](#condition-control)
14. [注释](#comment)
15. [内置方法](#presetfunction)

## 命名规范

<a name="naming-convention"></a>

### 避免使用单字母，使用可读出来的，有含义的变量 eslint: [`id-length`](https://eslint.org/docs/rules/id-length)

> 为什么？我们花最多的时间是看，理解代码，通过变量名,函数名，函数参数快速理解代码含义是最好的，大大减少我们所花费的时间

    // Bad:
    const yyyymmdstr = moment().format('YYYY/MM/DD');
    const i = moment().format('YYYY/MM/DD');
    const locations = ['Austin', 'New York', 'San Francisco'];
    locations.forEach((l) => {
        doStuff();
        doSomeOtherStuff();
        // ...
        // ...
        // ...
        // l是干嘛用来着？
        dispatch(l);
    });
    // Good:
    const currentDate = moment().format('YYYY/MM/DD');
    const locations = ['Austin', 'New York', 'San Francisco'];
    locations.forEach((location) => {
        doStuff();
        doSomeOtherStuff();
        // ...
        // ...
        // ...
        dispatch(location);
    });

### 给所有数字，字符串常量使用变量表达

> 为什么？利于代码的可读性，而且方便进行搜索和替换。

    // Bad: 86400000代表什么含义？
    setTimeout(blastOff, 86400000);

    // Good：明确告诉你，这个表示一天
    const MILLISECONDS_IN_A_DAY = 86400000;
    setTimeout(blastOff, MILLISECONDS_IN_A_DAY);

### 不要添加无用的上下文说明

    // Bad:
    const Car = {
      carMake: 'Honda',
      carModel: 'Accord',
      carColor: 'Blue'
    };

    function paintCar(car) {
      car.carColor = 'Red';
    }
    // Good:
    const Car = {
      make: 'Honda',
      model: 'Accord',
      color: 'Blue'
    };

    function paintCar(car) {
      car.color = 'Red';
    }

### 使用主动语态，减少否定判断

> 为什么？读起来更直观，思考回路减少

    // bad
    myFunction.hasBeenCalled()
    User.create()
    firstRun = false;
    if (!isNotPresent()) {

    }

    // good
    myFunction.wasCalled()
    createUser()
    isFirstRun = false;
    if (isPresent()) {

    }

### 使用骆驼式命名变量、函数 eslint: [`camelcase`](https://eslint.org/docs/rules/camelcase.html)

### 用大驼峰式命名类 eslint: [`new-cap`](https://eslint.org/docs/rules/new-cap.html)

    // bad
    function user(options) {
      this.name = options.name;
    }

    const bad = new user({
      name: 'nope',
    });

    // good
    class User {
      constructor(options) {
        this.name = options.name;
      }
    }

    const good = new User({
      name: 'yup',
    });

### 变量中不要使用前置或后置下划线 eslint: [`no-underscore-dangle`](https://eslint.org/docs/rules/no-underscore-dangle.html)

> Why? JavaScript 没有私有属性或私有方法的概念。尽管前置下划线通常的概念上意味着“private”，事实上，这些属性是完全公有的，因此这部分也是你的 API 的内容。这一概念可能会导致开发者误以为更改这个不会导致崩溃或者不需要测试。 如果你想要什么东西变成“private”，那就不要让它在这里出现。
> 、

## 变量定义

<a name="variables"></a>

### 在使用前先定义，`class,const,let` [`no-use-before-define`](https://eslint.org/docs/rules/no-use-before-define)

### 不需要改变引用的变量永远使用`const`声明 eslint: [`prefer-const`](https://eslint.org/docs/rules/prefer-const.html), [`no-const-assign`](https://eslint.org/docs/rules/no-const-assign.html), [`no-undef`](https://eslint.org/docs/rules/no-undef)

> 保证你的引用不会因为意外重新赋值而改变引用对象，从而导致 bug 和调试困难

    // bad
    var a = 1;
    var b = 2;

    // good
    const a = 1;
    const b = 2;

### 必须改变引用的变量使用 `let` 而不是 `var` eslint: [`no-var`](https://eslint.org/docs/rules/no-var.html)

> 为什么？`let`是块级作用域而`var`是函数作用域

    // bad
    var count = 1;
    if (true) {
        count += 1;
    }

    // good, use the let.
    let count = 1;
    if (true) {
        count += 1;
    }

### 多个变量定义不要使用一个声明关键字（const，let）eslint: [`one-var`](https://eslint.org/docs/rules/one-var.html)

> 为什么？更容易添加新的定义语句，不用费心去在中间插入或者改变分号成逗号。或者出现写错逗号或分号造成的错误。而且在 debug 的时候，共用的声明会跳过 debug。

    // bad
    const items = getItems(),
        goSportsTeam = true,
        dragonball = 'z';

    // bad
    // (compare to above, and try to spot the mistake)
    const items = getItems(),
        goSportsTeam = true;
        dragonball = 'z';

    // good
    const items = getItems();
    const goSportsTeam = true;
    const dragonball = 'z';

### 把变量按照 const,let 的顺序分组

    // bad
    let i, len, dragonball,
        items = getItems(),
        goSportsTeam = true;

    // bad
    let i;
    const items = getItems();
    let dragonball;
    const goSportsTeam = true;
    let len;

    // good
    const goSportsTeam = true;
    const items = getItems();
    let dragonball;
    let i;
    let length;

### 不要过早定义变量，在需要的位置定义

    // bad - unnecessary function call
    function checkName(hasName) {
      const name = getName();

      if (hasName === 'test') {
        return false;
      }

      if (name === 'test') {
        this.setName('');
        return false;
      }

      return name;
    }

    // good
    function checkName(hasName) {
      if (hasName === 'test') {
        return false;
      }

      const name = getName();

      if (name === 'test') {
        this.setName('');
        return false;
      }

      return name;
    }

### 不要链式赋值 eslint: [`no-multi-assign`](https://eslint.org/docs/rules/no-multi-assign)

> 为什么？可能会意外的定义全局变量

    // bad
    (function example() {
      // JavaScript interprets this as
      // let a = ( b = ( c = 1 ) );
      // The let keyword only applies to variable a; variables b and c become
      // global variables.
      let a = b = c = 1;
    }());

    console.log(a); // throws ReferenceError
    console.log(b); // 1
    console.log(c); // 1

    // good
    (function example() {
      let a = 1;
      let b = a;
      let c = a;
    }());

    console.log(a); // throws ReferenceError
    console.log(b); // throws ReferenceError
    console.log(c); // throws ReferenceError

    // the same applies for `const`

### 删除无用的变量 eslint: [`no-unused-vars`](https://eslint.org/docs/rules/no-unused-vars)

> 为什么？无用的变量占用空间，而且容易造成混淆。记住，less code，less error。

    // bad

    var some_unused_var = 42;

    // Write-only variables are not considered as used.
    var y = 10;
    y = 5;

    // A read for a modification of itself is not considered as used.
    var z = 0;
    z = z + 1;

    // Unused function arguments.
    function getX(x, y) {
        return x;
    }

    // good

    function getXPlusY(x, y) {
      return x + y;
    }

    var x = 1;
    var y = a + 2;

    alert(getXPlusY(x, y));

    // 'type' is ignored even if unused because it has a rest property sibling.
    // This is a form of extracting an object that omits the specified keys.
    var { type, ...coords } = data;
    // 'coords' is now the 'data' object without its 'type' property.

## 函数

<a name="function"></a>

### 函数参数应该小于等于 2 个，如果实在不能减少，使用对象通过解构传参 eslint:todo

> 为什么？首先，越多的参数，测试起来就越复杂。其次，很多的参数，不利于你阅读这个函数。参数多，说明这个函数做了很多事，但是根据单一职责原则，一个函数应该只做一件事，这样更易读，修改起来影响也会小。因此如果参数超过 2 个，尝试把函数进行拆分重构。

    // bad
    function createMenu(title, body, buttonText, cancellable) {
      // ...
    }
    // Good:
    function createMenu({ title, body, buttonText, cancellable }) {
      // ...
    }
    createMenu({
      title: 'Foo',
      body: 'Bar',
      buttonText: 'Baz',
      cancellable: true
    });
    // maybe better
    function createMenuTitle(title) {}
    function createMenuBody(body) {}
    function createMenuButton(buttonText, cancellable) {}

### 保持函数在 20 行以内 eslint:todo

> 为什么？当你阅读长函数的时候，首先要花费更多的时间理解，当你修改的时候，可能会不小心修改这个函数中其他的功能点，因为函数可能做了不只一件事。保持单一职责原则，只做一件事，重构长函数成多个函数

### 尽量写纯函数，把不纯的部分提取出来，减少对作用域变量的引用

> 为什么？纯函数不会改变输入，无任何依赖，每次结果保持一致。因此它很方便迁移。你可以把一个纯函数用在各种不同业务下使用，其次，纯函数方便测试，如果

    // bad
    const someValue = 'someValue';
    function doSomeThing() {
        if (someValue) {
            // ....
        }
    }

    // good
    function doSomeThing(someValue) {
        if (someValue) {
            // ....
        }
    }

### 使用函数表达式语法而不要用函数声明 eslint: [`func-style`](https://eslint.org/docs/rules/func-style)

> 为什么？函数声明会提升（未定义可使用，原理就是在 js 编译阶段，声明语句已经加载到内存中，初始化不能）。会造成很多没有定义函数，就开始使用函数的代码。这会损害可读性和可维护性：使用表达式语法，定义在使用之前，如果你发现一个函数很大，逻辑很复杂，干扰了你理解剩下的文件，那么你会把这个文件抽离出一个独立的模块，但是如果用了函数声明悬置，你可能就发现不到问题，不会去重构它。另外在定义函数表达式的时候，要为这个函数实际命名，并且和赋值的表达式名称不同，这样的目的就是当函数抛出错误的时候，会定位到原始的函数名，否则就是匿名函数，而且根据这个和赋值表达式不一样的函数，你可以快速定位到错误，而不会去找调用的表达式名称。

    // bad，声明悬置
    function foo() {
      // ...
    }

    // bad，因为这个函数没有.name属性，抛出错误是匿名函数，不利于定位
    const foo = function () {
      // ...
    };

    // good，函数名应该是唯一的，详细的，赋值的变量应该是短小的。这样报错的时候，可以一下
    // 根据函数名定位实际发生错误的函数（如果两个名字一样，就不好定位）
    const short = function longUniqueMoreDescriptiveLexicalFoo() {
      // ...
    };

### 自执行函数用括号整体括起来 eslint: [`wrap-iife`](https://eslint.org/docs/rules/wrap-iife.html)

> 为什么？自执行函数是一个独立的单元，用括号把整体部分括起来（函数开头到执行括号后面）表达了他是独立元素的含义。在到处都是模块的现代环境下，你几乎用不着自执行函数。

    // immediately-invoked function expression (IIFE)
    (function () {
    console.log('Welcome to the Internet. Please follow me.');
    }());

### 永远不要在非函数块（if，whilte，等）中定义函数。使用表达式函数。 eslint: [`no-loop-func`](https://eslint.org/docs/rules/no-loop-func.html)

### 永远不要把参数命名为 arguments。

    // bad
    function foo(name, options, arguments) {
      // ...
    }

    // good
    function foo(name, options, args) {
      // ...
    }

### 永远不要用 arguments，用 rest 运算符... eslint: [`prefer-rest-params`](https://eslint.org/docs/rules/prefer-rest-params)

    // bad
    function concatenateAll() {
      const args = Array.prototype.slice.call(arguments);
      return args.join('');
    }

    // good
    function concatenateAll(...args) {
      return args.join('');
    }

### 使用默认参数语法而不是改变函数参数（eslint:todo 所有参数默认值检查）

    // really bad
    function handleThings(opts) {
      // 这样会改变参数的值，而且如果opts是null或0这种非undefined的值，有可能会导致bug
      opts = opts || {};
      // ...
    }

    // still bad
    function handleThings(opts) {
      if (opts === void 0) {
        opts = {};
      }
      // ...
    }

    // good
    function handleThings(opts = {}) {
      // ...
    }

> 为什么？因为调用函数的参数有多个的时候，只有最后一个是可以省略的

    // bad
    function handleThings(opts = {}, name) {
      // ...
    }

    // good
    function handleThings(name, opts = {}) {
      // ...
    }

### 永远不要使用函数构造函数来创建新函数 eslint: [`no-new-func`](https://eslint.org/docs/rules/no-new-func)

    // bad
    var add = new Function('a', 'b', 'return a + b');

    // still bad
    var subtract = Function('a', 'b', 'return a - b');

### 永远不要突变参数 eslint: [`no-param-reassign`](https://eslint.org/docs/rules/no-param-reassign.html)

    // bad
    function f1(obj) {
      obj.key = 1;
    }

    // good
    function f2(obj) {
      const key = Object.prototype.hasOwnProperty.call(obj, 'key') ? obj.key : 1;
    }

### 永远不要从新分配参数

> 为什么？从新分配参数会导致意外的行为，尤其是方位 arguments 对象的时候。而且会导致性能问题，尤其是 v8 引擎。

    // bad
    function f1(a) {
      a = 1;
      // ...
    }

    function f2(a) {
      if (!a) { a = 1; }
      // ...
    }

    // good
    function f3(a) {
      const b = a || 1;
      // ...
    }

    function f4(a = 1) {
      // ...
    }

### 使用拓展操作符...传递参数调用，不使用 apply eslint: [`prefer-spread`](https://eslint.org/docs/rules/prefer-spread)

> 为什么？更简洁，并且不需要提供上下文

    // bad
    const x = [1, 2, 3, 4, 5];
    console.log.apply(console, x);

    // good
    const x = [1, 2, 3, 4, 5];
    console.log(...x);

    // bad
    new (Function.prototype.bind.apply(Date, [null, 2016, 8, 5]));

    // good
    new Date(...[2016, 8, 5]);

### 不要保存 this 的索引。使用箭头函数或 bind 方法

    // bad
    function foo() {
      const self = this;
      return function () {
        console.log(self);
      };
    }

    // bad
    function foo() {
      const that = this;
      return function () {
        console.log(that);
      };
    }

    // good
    function foo() {
      return () => {
        console.log(this);
      };
    }

## 箭头函数

<a name="arrow-function"></a>

### 当你必须使用匿名函数，使用箭头函数 eslint: [`prefer-arrow-callback`](https://eslint.org/docs/rules/prefer-arrow-callback.html), [`arrow-spacing`](https://eslint.org/docs/rules/arrow-spacing.html)

    // bad
    [1, 2, 3].map(function (x) {
      const y = x + 1;
      return x * y;
    });

    // good
    [1, 2, 3].map((x) => {
      const y = x + 1;
      return x * y;
    });

## 对象

<a name="object"></a>

### 使用字面量语法创建对象。 eslint: [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand.html)

    // bad
    const item = new Object();

    // good
    const item = {};

### 如果需要设置动态属性，在创建对象的时候设置

> 为什么？在同一个地方设置对象的所有属性，方便查找和维护。

    function getKey(k) {
      return `a key named ${k}`;
    }

    // bad
    const obj = {
      id: 5,
      name: 'San Francisco',
    };
    obj[getKey('enabled')] = true;

    // good
    const obj = {
      id: 5,
      name: 'San Francisco',
      [getKey('enabled')]: true,
    };

### 使用 es6 的简写方式定义属性函数 eslint: [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand.html)

    // bad
    const atom = {
      value: 1,

      addValue: function (value) {
        return atom.value + value;
      },
    };

    // good
    const atom = {
      value: 1,

      addValue(value) {
        return atom.value + value;
      },
    };

### 使用 es6 的简写方式定义属性

    const lukeSkywalker = 'Luke Skywalker';
    // bad
    const obj = {
        lukeSkywalker: lukeSkywalker,
    };

    // good
    const obj = {
        lukeSkywalker,
    };

### 把你的简写属性放到前面

> 为什么？这样快速告诉维护人员，哪些属性用到了简写

    const anakinSkywalker = 'Anakin Skywalker';
    const lukeSkywalker = 'Luke Skywalker';
    // bad
    const obj = {
      episodeOne: 1,
      twoJediWalkIntoACantina: 2,
      lukeSkywalker,
      episodeThree: 3,
      mayTheFourth: 4,
      anakinSkywalker,
    };

    // good
    const obj = {
      lukeSkywalker,
      anakinSkywalker,
      episodeOne: 1,
      twoJediWalkIntoACantina: 2,
      episodeThree: 3,
      mayTheFourth: 4,
    };

### 只在属性有无效字符时候使用引号包裹 eslint: [`quote-props`](https://eslint.org/docs/rules/quote-props.html)

> 为什么？因为无引号主观上更容易读，提高了语法高亮的样式，并且更容易被 js 引擎优化。

    // bad
    const bad = {
      'foo': 3,
      'bar': 4,
      'data-blah': 5,
    };

    // good
    const good = {
      foo: 3,
      bar: 4,
      'data-blah': 5,
    };

### 不要在自定义对象上直接调用`Object.prototype`方法，比如`hasOwnProperty`,`propertyIsEnumerable`,`isPrototypeOf` eslint: [`no-prototype-builtins`](https://eslint.org/docs/rules/no-prototype-builtins)

> 为什么？因为原生方法有可能被自定义方法覆盖，比如有一个对象有这个属性{hasOwnProperty: false},或者对象本身是 null 对象。

    // bad
    console.log(object.hasOwnProperty(key));

    // good
    console.log(Object.prototype.hasOwnProperty.call(object, key));

    // best
    const has = Object.prototype.hasOwnProperty; // 在一个模块里缓存方法的索引，然后引用使用
    /* or */
    import has from 'has'; // https://www.npmjs.com/package/has
    // ...
    console.log(has.call(object, key));

### 使用扩展运算符进行浅复制，不要用`Object.assign`。

> 为什么？Object.assign 的语法是 Object.assign(target, src1, src2..srcn)。会对 target 造成突变，改变 target 属性。

    // very bad
    const original = { a: 1, b: 2 };
    const copy = Object.assign(original, { c: 3 }); // 突变了`original`对象 ಠ_ಠ
    delete copy.a; // so does this

    // bad
    const original = { a: 1, b: 2 };
    const copy = Object.assign({}, original, { c: 3 }); // copy => { a: 1, b: 2, c: 3 }

    // good
    const original = { a: 1, b: 2 };
    const copy = { ...original, c: 3 }; // copy => { a: 1, b: 2, c: 3 }

    const { a, ...noA } = copy; // noA => { b: 2, c: 3 }

### 使用.语法访问常量属性

    const luke = {
        jedi: true,
        age: 28,
    };

    // bad
    const isJedi = luke['jedi'];

    // good
    const isJedi = luke.jedi;

### 使用[]访问变量属性

    const luke = {
        jedi: true,
        age: 28,
    };

    function getProp(prop) {
        return luke[prop];
    }

    const isJedi = getProp('jedi');

## 数组

<a name="array"></a>

### 使用字面量语法定义数组

    // bad
    const items = new Array();

    // good
    const items = [];

### 使用 `push` 方法添加数组元素，而不是直接索引赋值

### 使用拓展运算符`...`复制数组

    // bad
    const len = items.length;
    const itemsCopy = [];
    let i;

    for (i = 0; i < len; i += 1) {
      itemsCopy[i] = items[i];
    }

    // good
    const itemsCopy = [...items];

### 使用拓展运算符`...`把一个可迭代对象转换成数组而不是 `Array.from`

    const foo = document.querySelectorAll('.foo');

    // good
    const nodes = Array.from(foo);

    // best
    const nodes = [...foo];

### 使用 `Array.from` 把一个数组类对象转换成数组

    // bad
    const baz = [...foo].map(bar);

    // good
    const baz = Array.from(foo, bar);

### 使用 `Array.from` 做 map 遍历，不要用...运算符，会产生中间数组

    // bad
    const baz = [...foo].map(bar);

    // good
    const baz = Array.from(foo, bar);

### 在数组方法回调中使用 return 返回。eslint: [`array-callback-return`](https://eslint.org/docs/rules/array-callback-return)

    // good
    [1, 2, 3].map((x) => {
      const y = x + 1;
      return x * y;
    });

    // good
    [1, 2, 3].map(x => x + 1);

    // bad - no returned value means `acc` becomes undefined after the first iteration
    [[0, 1], [2, 3], [4, 5]].reduce((acc, item, index) => {
      const flatten = acc.concat(item);
      acc[index] = flatten;
    });

    // good
    [[0, 1], [2, 3], [4, 5]].reduce((acc, item, index) => {
      const flatten = acc.concat(item);
      acc[index] = flatten;
      return flatten;
    });

    // bad
    inbox.filter((msg) => {
      const { subject, author } = msg;
      if (subject === 'Mockingbird') {
        return author === 'Harper Lee';
      } else {
        return false;
      }
    });

    // good
    inbox.filter((msg) => {
      const { subject, author } = msg;
      if (subject === 'Mockingbird') {
        return author === 'Harper Lee';
      }

      return false;
    });

## 字符串

<a name="string"></a>

### 使用单引号扩字符串 eslint: [`quotes`](https://eslint.org/docs/rules/quotes.html)

> 为什么？单引号的敲键盘成本更低

    // bad
    const name = "Capt. Janeway";

    // bad - template literals should contain interpolation or newlines
    const name = `Capt. Janeway`;

    // good
    const name = 'Capt. Janeway';

### 超过 100 字的字符串不要用多行连接

> 为什么？让字符串折行费力而且不利于代码搜索

    // bad
    const errorMessage = 'This is a super long error that was thrown because \
    of Batman. When you stop to think about how Batman had anything to do \
    with this, you would get nowhere \
    fast.';

    // bad
    const errorMessage = 'This is a super long error that was thrown because ' +
      'of Batman. When you stop to think about how Batman had anything to do ' +
      'with this, you would get nowhere fast.';

    // good
    const errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';

### 当需要程序动态创建字符串时候，使用模板字符串而不要用+连接 eslint: [`prefer-template`](https://eslint.org/docs/rules/prefer-template.html) [`template-curly-spacing`](https://eslint.org/docs/rules/template-curly-spacing)

> 为什么？模板字符串给你更好的可读性，更精确的语法，包含换行和占位符

    // bad
    function sayHi(name) {
      return 'How are you, ' + name + '?';
    }

    // bad
    function sayHi(name) {
      return ['How are you, ', name, '?'].join();
    }

    // bad
    function sayHi(name) {
      return `How are you, ${ name }?`;
    }

    // good
    function sayHi(name) {
      return `How are you, ${name}?`;
    }

### 永远不要在字符串里用 eval，导致了很多安全性问题。eslint: [`no-eval`](https://eslint.org/docs/rules/no-eval)

### 非必须情况，不要使用转义符号 eslint: [`no-useless-escape`](https://eslint.org/docs/rules/no-useless-escape)

> 为什么？转义符号影响可读性，他们只应该在必要时出现

    // bad
    const foo = '\'this\' \i\s \"quoted\"';

    // good
    const foo = '\'this\' is "quoted"';
    const foo = `my name is '${name}'`;

## 类

<a name="class"></a>

### 永远使用 class 不要用 prototype 定义类

    // bad
    function Queue(contents = []) {
      this.queue = [...contents];
    }
    Queue.prototype.pop = function () {
      const value = this.queue[0];
      this.queue.splice(0, 1);
      return value;
    };

    // good
    class Queue {
      constructor(contents = []) {
        this.queue = [...contents];
      }
      pop() {
        const value = this.queue[0];
        this.queue.splice(0, 1);
        return value;
      }
    }

### 使用 extends 实现继承

    // bad
    const inherits = require('inherits');
    function PeekableQueue(contents) {
      Queue.apply(this, contents);
    }
    inherits(PeekableQueue, Queue);
    PeekableQueue.prototype.peek = function () {
      return this.queue[0];
    };

    // good
    class PeekableQueue extends Queue {
      peek() {
        return this.queue[0];
      }
    }

### 方法返回 this 来实现链式调用

    // bad
    Jedi.prototype.jump = function () {
      this.jumping = true;
      return true;
    };

    Jedi.prototype.setHeight = function (height) {
      this.height = height;
    };

    const luke = new Jedi();
    luke.jump(); // => true
    luke.setHeight(20); // => undefined

    // good
    class Jedi {
      jump() {
        this.jumping = true;
        return this;
      }

      setHeight(height) {
        this.height = height;
        return this;
      }
    }

    const luke = new Jedi();

    luke.jump()
      .setHeight(20);

### 如果有需要，写构造函数，否则不要写，默认会有 eslint: [`no-useless-constructor`](https://eslint.org/docs/rules/no-useless-constructor)

    // bad
    class Jedi {
      constructor() {}

      getName() {
        return this.name;
      }
    }

    // bad
    class Rey extends Jedi {
      constructor(...args) {
        super(...args);
      }
    }

    // good
    class Rey extends Jedi {
      constructor(...args) {
        super(...args);
        this.name = 'Rey';
      }
    }

### 避免重复的方法 eslint: [`no-dupe-class-members`](https://eslint.org/docs/rules/no-dupe-class-members)

    // bad
    class Foo {
      bar() { return 1; }
      bar() { return 2; }
    }

    // good
    class Foo {
      bar() { return 1; }
    }

    // good
    class Foo {
      bar() { return 2; }
    }

## 模块

<a name="module"></a>

### 从一个模块引用的内容永远写到一起 eslint: [`no-duplicate-imports`](https://eslint.org/docs/rules/no-duplicate-imports)

    // bad
    import foo from 'foo';
    // … some other imports … //
    import { named1, named2 } from 'foo';

    // good
    import foo, { named1, named2 } from 'foo';

    // good
    import foo, {
      named1,
      named2,
    } from 'foo';

### 不要导出可变的引用 eslint: [`import/no-mutable-exports`](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-mutable-exports.md)

> 为什么? 变化通常都是需要避免，特别是当你要输出可变的绑定。

    // bad
    let foo = 3;
    export { foo }

    // good
    const foo = 3;
    export { foo }

### 如果只有一个导出语句，使用默认导出而不是命名导出 eslint: [`import/prefer-default-export`](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md)

> 为什么？鼓励把功能拆分的更细（单一职责），每个文件只做一件事，这样有更好的可读性和可维护性。

    // bad
    export function foo() {}

    // good
    export default function foo() {}

### 把所有 import 语句统一放到非 import 语句的上面 eslint: [`import/first`](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md)

### import 的默认导出名应该和 export 定义的默认导出名完全一致

    // file 1 contents
    class CheckBox {
      // ...
    }
    export default CheckBox;

    // file 2 contents
    export default function fortyTwo() { return 42; }

    // file 3 contents
    export default function insideDirectory() {}

    // in some other file
    // bad
    import CheckBox from './checkBox'; // PascalCase import/export, camelCase filename
    import FortyTwo from './FortyTwo'; // PascalCase import/filename, camelCase export
    import InsideDirectory from './InsideDirectory'; // PascalCase import/filename, camelCase export

    // bad
    import CheckBox from './check_box'; // PascalCase import/export, snake_case filename
    import forty_two from './forty_two'; // snake_case import/filename, camelCase export
    import inside_directory from './inside_directory'; // snake_case import, camelCase export
    import index from './inside_directory/index'; // requiring the index file explicitly
    import insideDirectory from './insideDirectory/index'; // requiring the index file explicitly

    // good
    import CheckBox from './CheckBox'; // PascalCase export/import/filename
    import fortyTwo from './fortyTwo'; // camelCase export/import/filename
    import insideDirectory from './insideDirectory'; // camelCase export/import/directory name/implicit     "index"
    // ^ supports both insideDirectory.js and insideDirectory/index.js

### export default 的名称应该和文件名一致

## 解构

<a name="destruct"></a>

### 使用解构来获取对象属性 eslint: [`prefer-destructuring`](https://eslint.org/docs/rules/prefer-destructuring)

    // bad
    function getFullName(user) {
        const firstName = user.firstName;
        const lastName = user.lastName;

        return `${firstName} ${lastName}`;
    }

    // good
    function getFullName(user) {
        const { firstName, lastName } = user;
        return `${firstName} ${lastName}`;
    }

    // best
    function getFullName({ firstName, lastName }) {
        return `${firstName} ${lastName}`;
    }

### 使用数组解构来获取值

    const arr = [1, 2, 3, 4];

    // bad
    const first = arr[0];
    const second = arr[1];

    // good
    const [first, second] = arr;

### 返回多个值时候，使用对象包装多个值，而不要用数组

> 为什么？你可以随时在返回值里添加新的属性，改变顺序，但是如果你用数组，位置是固定的（对象更好拓展）

    // bad
    function processInput(input) {
      // then a miracle occurs
      return [left, right, top, bottom];
    }

    // the caller needs to think about the order of return data
    const [left, __, top] = processInput(input);

    // good
    function processInput(input) {
      // then a miracle occurs
      return { left, right, top, bottom };
    }

    // the caller selects only the data they need
    const { left, top } = processInput(input);

## 迭代遍历

<a name="iter"></a>

### 禁止使用 for in，因为会遍历原型链，造成意外问题 [`no-restricted-syntax`](https://eslint.org/docs/rules/no-restricted-syntax)

## 操作符

<a name="operator"></a>

### 使用===和!== eslint: [`eqeqeq`](https://eslint.org/docs/rules/eqeqeq.html)

### 不要使用一元自增自减运算符（++， --）. eslint [`no-plusplus`](https://eslint.org/docs/rules/no-plusplus)

    // bad

    let array = [1, 2, 3];
    let num = 1;
    num++;
    --num;

    let sum = 0;
    let truthyCount = 0;
    for(let i = 0; i < array.length; i++){
      let value = array[i];
      sum += value;
      if (value) {
        truthyCount++;
      }
    }

    // good

    let array = [1, 2, 3];
    let num = 1;
    num += 1;
    num -= 1;

    const sum = array.reduce((a, b) => a + b, 0);
    const truthyCount = array.filter(Boolean).length;

### 使用操作符做幂运算

    // bad
    const binary = Math.pow(2, 10);

    // good
    const binary = 2 ** 10;

## 条件控制

<a name="condition-control"></a>

### 条件判断写清具体条件，不要使用默认的逻辑

> 为什么？类似 if || && 操作符有一套自己的 true 或 false 判断条件：对象永远为 true，null、undefined、0、+0、-0、 NaN，空字符串（长度为 0）都判断是 false。所以写清比较的条件，防止判断结果和自己的意图不符

    // bad
    if (isValid === true) {
      // ...
    }

    // good
    if (isValid) {
      // ...
    }

    // bad
    if (name) {
      // ...
    }

    // good
    if (name !== '') {
      // ...
    }

    // bad
    if (collection.length) {
      // ...
    }

    // good
    if (collection.length > 0) {
      // ...
    }

### 在 switch 语句中使用大括号括起 case 和 default 部分的代码 eslint: [`no-case-declarations`](https://eslint.org/docs/rules/no-case-declarations.html)

> 为什么？在每一个 case 和 default 中声明的变量都在一个作用域，为了防止别的 case 和 default 代码段的干扰，使用 {}分割每一个作用域

    // bad
    switch (foo) {
      case 1:
        let x = 1;
        break;
      case 2:
        const y = 2;
        break;
      case 3:
        function f() {
          // ...
        }
        break;
      default:
        class C {}
    }

    // good
    switch (foo) {
      case 1: {
        let x = 1;
        break;
      }
      case 2: {
        const y = 2;
        break;
      }
      case 3: {
        function f() {
          // ...
        }
        break;
      }
      case 4:
        bar();
        break;
      default: {
        class C {}
      }
    }

### 不要嵌套条件运算符，复杂的拆解出来 eslint: [`no-nested-ternary`](https://eslint.org/docs/rules/no-nested-ternary.html)

    // bad
    const foo = maybe1 > maybe2
      ? "bar"
      : value1 > value2 ? "baz" : null;

    // split into 2 separated ternary expressions
    const maybeNull = value1 > value2 ? 'baz' : null;

    // better
    const foo = maybe1 > maybe2
      ? 'bar'
      : maybeNull;

    // best
    const foo = maybe1 > maybe2 ? 'bar' : maybeNull;

### 避免无用的三目运算符 eslint: [`no-unneeded-ternary`](https://eslint.org/docs/rules/no-unneeded-ternary.html)

    // bad
    const foo = a ? a : b;
    const bar = c ? true : false;
    const baz = c ? false : true;

    // good
    const foo = a || b;
    const bar = !!c;
    const baz = !c;

### 不要使用短路运算符控制执行

    // bad
    !isRunning && startRunning();

    // good
    if (!isRunning) {
        startRunning();
    }

## 注释

<a name="comment"></a>

### 如果不能持续维护注释，请不要写注释

> 错误的注释比没有注释更糟，应该从代码的命名和结构上下功夫提高可读性

### 不要注释代码，删除他们

> 占据空间，混淆视听

### 使用/\*\* \*\*/来注释多行

### 使用//注释单行，在行的上边。如果注释的上边有代码，空一行

    // bad
    const active = true;  // is current tab

    // good
    // is current tab
    const active = true;

    // bad
    function getType() {
      console.log('fetching type...');
      // set the default type to 'no type'
      const type = this._type || 'no type';

      return type;
    }

    // good
    function getType() {
      console.log('fetching type...');

      // set the default type to 'no type'
      const type = this._type || 'no type';

      return type;
    }

    // also good
    function getType() {
      // set the default type to 'no type'
      const type = this._type || 'no type';

      return type;
    }

### 注释开头空一格 eslint: [`spaced-comment`](https://eslint.org/docs/rules/spaced-comment)

    // bad
    //is current tab
    const active = true;

    // good
    // is current tab
    const active = true;

    // bad
    /**
     *make() returns a new element
     *based on the passed-in tag name
     */
    function make(tag) {

      // ...

      return element;
    }

    // good
    /**
     * make() returns a new element
     * based on the passed-in tag name
     */
    function make(tag) {

      // ...

      return element;
    }

## 内置方法

<a name="presetfunction"></a>

### 使用 Number.isNaN 不要用全局的 isNaN

> 为什么？因为全局的 isNaN 会强制转换成数字，会造成误判。

    // bad
    isNaN('1.2'); // false
    isNaN('1.2.3'); // true

    // good
    Number.isNaN('1.2.3'); // false
    Number.isNaN(Number('1.2.3')); // true

### 使用 Number.isFinite，不要用全局的 isFinite

> 为什么？因为全局的 isNaN 会强制转换成数字，会造成误判。

    // bad
    isFinite('2e3'); // true

    // good
    Number.isFinite('2e3'); // false
    Number.isFinite(parseInt('2e3', 10)); // true

## 参考资料

[AirBnb 规范](https://github.com/airbnb/javascript)

[命名规范](https://medium.com/javascript-scene/elements-of-javascript-style-caa8821cb99f)

[干净代码指导](https://github.com/ryanmcdermott/clean-code-javascript/blob/master/README.md)

[代码的整洁之道](https://github.com/ShawnLeee/the-book/blob/master/clean%20code-%E4%BB%A3%E7%A0%81%E6%95%B4%E6%B4%81%E4%B9%8B%E9%81%93%20%E4%B8%AD%E6%96%87%E5%AE%8C%E6%95%B4%E7%89%88-%E5%B8%A6%E4%B9%A6%E7%AD%BE.pdf)
