# webpack动态导入和require.context分析及注意事项

## 实验webpack版本
4.19.0

## tldr;
1. 动态导入语法必须是字符串拼接，不能传入函数。

    正确：import('./src' + args + '.index')
    错误：import(someFn())

2. 动态导入变量必须以`./` 或者`webpack设置的alias`开始进行字符串拼接。

    import('./src' + args + '/index.js')
    或
    import('Src/' + args + '/index.js') Src是一个alias地址

3. `import('./src' + args + '/index.js')`动态导入中的args变量在打包阶段只是一个占位符的作用，等价于查找./src/*/index.js中
4. `require.context(目录,是否递归搜索,筛选器)`参数只有静态常量有效

## 动态导入import和require.context的基本概念
### 作用于两个阶段
1. 打包编译时候进行词法分析，决定哪些文件要打包，拆分还是合并。
2. 程序运行时使用第一阶段打好的模块。

### 在编译阶段都会打包非注释部分
不管程序里有没有实际调用了动态导入或require.context部分的代码，只要这部分代码
被webpack发现，只要不被注释，webpack都会按照语法执行打包。因为这是编译阶段语法分析的结果。

## 动态导入
`import('./src' + args + '/index.js')`
遇到import是变量拼接的语法，就会把匹配的文件分别作为一个独立chunk进行打包。
### 编译阶段
1. 根据语法拆分多个独立包
2. 变量只是类似占位符的作用

打包过程发生在编译阶段，webpack看不懂类似`import(someFunction())`这种语法，因为在编译阶段不知道someFunction()是什么，
webpack只认识这种语法`import('./app' + xx + '/store/index.js')`，webpack的理解就是
把变量替换成占位符，把匹配这个模式`./app/*/store/index.js`的文件分别打成chunk，然后程序运行的时候，再根据变量生成的路径，匹配对应chunk块。

3. 有效的变量拼接开头
    1. 以webpack配置的alias开头

            alias: {
                Root: 'e:/xx',
            }
            import('Root/' + args + 'index.js)

    2. 以./开头的语法
        `import('Root/' + args + 'index.js)`
    3. 诸如`../`和`绝对路径`开头都无效。

## require.context
语法`require.context(目录,是否递归目录, 文件筛选条件)`所有参数必须是直接字符串，变量无效。

会在目录里进行递归或非递归的按照筛选条件筛选，把符合条件的文件单独打包成一个文件。
形如：

    var map = {
        "./game/index.js": "./src/domain/game/index.js",
        "./index.js": "./src/domain/index.js"
    };
    function webpackContext(req) {
        var id = webpackContextResolve(req);
        return __webpack_require__(id);
    }
    function webpackContextResolve(req) {
        var id = map[req];
        if(!(id + 1)) { // check for number or string
            var e = new Error("Cannot find module '" + req + "'");
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        }
        return id;
    }
    webpackContext.keys = function webpackContextKeys() {
        return Object.keys(map);
    };
    webpackContext.resolve = webpackContextResolve;
    module.exports = webpackContext;
    webpackContext.id = "./src/domain sync recursive \\/index\\.js$";

