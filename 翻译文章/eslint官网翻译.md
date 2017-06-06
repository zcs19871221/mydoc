# 配置ESLINT
ESLINt是彻底的可配置的，你可以通过一下两种方式配置：
1. 配置注释-使用js注释直接写
2. 配置文件-使用JS，JSON，YAML文件来描述配置信息给整个目录和它的子目录使用。配置文件可以定义成[.eslintrc.*](http://eslint.org/docs/user-guide/configuring#configuration-file-formats)的文件形式或者通过在`eslintConfig `配置项定义，两种方式都可以。或者通过[命令行](http://eslint.org/docs/user-guide/command-line-interface)方式

## 定义解析选项
默认支持es5，可以修改成其他版本的es或者选择jsx。
注意这个jsx并不代表支持react。因为react的jsx语法eslint不支持。
如果要检测react的jsx语法请使用[eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)

本配置使用定义在`.eslintrc.*`文件中的`parserOptions`项。
* ecmaVersion-支持3,5,6,7,8。默认支持5。
* souceType-默认是script，可选model如果你使用es的module语法。
* ecmaFeatures
    * globalRetur-允许在全局范围内使用return
    * impliedStrict-在全局使用严格模式（如果选择的es版本是5或以上）
    * jsx-jsx开启
    * experimentalObjectRestSpread-支持实验性质的[object rest/spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread)特性（**重要**：这是一个实验性质的特性，将来有可能会大变。所以建议不要使用它，除非你能承受将来当语法改变时候你代码的维护代价）

使用例子：

    {
        "parserOptions": {
            "ecmaVersion": 6,
            "sourceType": "module",
            "ecmaFeatures": {
                "jsx": true
            }
        },
        "rules": {
            "semi": 2
        }
    }
parseOption用来定义解析的前提，默认下所有都是false。
## 指定解析器
默认使用[ESpree](https://github.com/eslint/espree)解析，你可以使用符合以下需求的解析器来替换默认的解析器：
1. 必须是能本地安装的npm模块
2. 必须export出一个parse()方法
3. 必须生成Esprima-compatible AST and token objects
并且就算符合这些条件，也不一定在eslint就好用。。
目前兼容eslint的解析器有两个：
* Esprima
* Babel-Eslint-Babel解析器封装的用以兼容eslint

** 指定解析环境
* browser - 浏览器全局变量
* node - nodejs全局变量和nodejs作用域
* commonjs - commonJs全局变量和commonJs作用域。
* shared-node-browser - 浏览器和node环境都可以用。
* es6 - 除了模块外支持所有es6语法。（如果ecmaVersion选择es6了那么这个自动选中)
* worker - web worker全局变量。
* amd - defines require() and define() as global variables as per the amd spec.
* mocha - adds all of the Mocha testing global variables.
* jasmine - adds all of the Jasmine testing global variables for version 1.3 and 2.0.
* jest - Jest global variables.
* phantomjs - PhantomJS global variables.
* protractor - Protractor global variables.
* qunit - QUnit global variables.
* jquery - jQuery global variables.
* prototypejs - Prototype.js global variables.
* shelljs - ShellJS global variables.
* meteor - Meteor global variables.
* mongo - MongoDB global variables.
* applescript - AppleScript global variables.
* nashorn - Java 8 Nashorn global variables.
* serviceworker - Service Worker global variables.
* atomtest - Atom test helper globals.
* embertest - Ember test helper globals.
* webextensions - WebExtensions globals.
* greasemonkey - GreaseMonkey globals.
这些选项不是互斥的，你可以同时选择多个。
可以通过在你的js文件里增加注释指定当前环境，注释如下：
`/* eslint-env node, mocha */`

## 指定全局
