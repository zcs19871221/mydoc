# webpack源代码解读(一)
## 起因
webpack是一个非常好用的工具，webpack的广泛使用正是前端工程化普及的最好证明。
在项目中，我搭建了自己的webpack脚手架，当我自己配置webpack的动态导入的时候，对于chunkId，moduleId，context等概念不是很理解。
为了更好的使用webpack，决定对webpack的源代码一探究竟。

## 阅读的步骤
我曾经读过公司内部自己开发的小型spa框架（集成了jquery的一些常用dom操作，一些常用js方法，promise和仿照requireJs的模块化工具），也读过一些underscore和jquery源代码，通过自己的研究和查阅别人的经验，结合webpack源代码，我的阅读代码步骤如下：

1. 选择源代码
    1. git clone下github上源代码 https://github.com/webpack/webpack.git。
    2. git log查看版本信息。
    3. git checkout到最原始的版本。
2. 寻找源代码入口
    步骤一般是
    1. 首先阅读readme文件
    2. 查看package.json中的bin和main字段，（启动脚本和入口文件）
    3. 浏览整个目录结构

    查看readme.md，可以看到用法是执行webpack命令，对应package.json中的bin配置我们知道这个webpack命令等价于执行node bin/webpack.js，然后查看webpack.js文件，可以看到调用了lib/webpack.js中的方法。

    然后再看，可以看到目录结构中有一个example，打开一看，有build.js,example.js两个文件，打开build.js文件，可以看到通过node启动了一个webpack子进程。

3. debug源代码
我们看到例子中使用build.js进行打包
在build.js中，使用node开了一个子进程调试。
这样的话，使用vscode debug的话，有两种方式
    1. 使用vscode的attach模式，先以debug模式启动目标程序，然后再在vscode里启动debug。
    在build.js中"node  ../bin/webpack.js "中添加--inspect-brk，变成"node --inspect-brk ../bin/webpack.js"，这样就表示以debug模式启动，并且会在第一行中断。然后vscode中添加debug配置如下：

            {
                "type": "node",
                "request": "attach",
                "name": "Attach by Process ID",
                "port": 9229
            }
        port对应上边的debugport，默认是9229.
    2. 直接使用vscode启动程序，配置如下：

            {
                "type": "node",
                "request": "launch",
                "name": "debugWebpack",
                "program": "${workspaceFolder}/bin/webpack.js",
                "console": "integratedTerminal",
                "cwd": "${workspaceFolder}",
                "args": [
                    "${workspaceFolder}/example/example.js",
                    "${workspaceFolder}/output/output.js"
                ]
            }

然后使用vscode调试代码。

# 阅读的方式

  要阅读一个东西，最好是对他有一定的了解，最起码是用过，要不直接读代码会和看天书一样。
  我个人总结了四个步骤。

1. 由简到繁
直接在github上找到最原始版本开始读，读懂一个版本后，再通过git比较随手的提交，循序渐进的读后提交的版本。

2. 由点连成线
 一开始都是从入口函数开始读，每个函数先大略看一下知道是干嘛的，然后看调用了哪些函数。将这些一个个函数连接起来，画成简单的程序调用图

3. 由粗到细
  当有了程序调用图后，我们就对整个代码有了一个总体的认识，然后依次解读每个函数。

4. 要有所思考
  当读到一些看不懂或精妙的地方，我们要反复研究为什么要这么做，有什么好处，把这个模式记录下来，争取用到以后当中。
  比如，在这个程序中，通过不停的把上一级传递到的回调进行包装并传给子函数的方式，实际上就是一种代理模式，精简了代码。

但是有时候最重要的其实是坚持，就是不懂的地方一遍一遍看，如果坚持下来总是会有收获。

# 程序调用图
![](https://raw.githubusercontent.com/zcs19871221/mydoc/master/image/webpack%E5%8E%9F%E5%A7%8B%E7%89%88%E6%9C%AC%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E5%9B%BE.png)

# 基本概念
## module： 模块，一个模块就是一个文件
## chunk：代码段，一个chunk就是一个入口文件所依赖到的所有模块的集合。
## deptree:一个依赖树，记录了所有需要的信息。


	var depTree = {
        //包含所有的模块，键是文件绝对路径
		modules: {
            "e:\test\webpack\example\example.js": {
                //id是唯一的模块id，数字，从0开始,新模块加1
                id: depTree.nextModuleId++,
                //chunkid是唯一的代码段id，从0开始，有chunkId表示这个chunk是以这个模块为入口
                //也有可能是null，说明后来这个chunk为空
                chunkId: 0,
                //这个模块属于哪些chunk（代码段）
                chunks: [chunkId1, chunkId2]
                //filename是文件绝对路径
                filename: "e:\test\webpack\example\example.js",
                //requires是本文件引用的所有同步依赖
                requires: [        
                    {
                        //代码在第几列
                        column:8
                        //代码在第几行
                        line:1
                        //引用名字是什么
                        name:"a"
                        //依赖的名称在整个代码中的开始和结束位置
                        nameRange:Array(2) [16, 18],
                        //模块id
                        id: 0
                    },
                    {
                        column:8
                        line:2
                        name:"b"
                        nameRange:Array(2) [39, 41]，
                        //模块id
                        id: 
                    }
                ],
                //async是这个文件的动态引入块（一个动态引入块就是一段require.ensure()代码）
                async: [
                    {
                        //如果有chunkId，表示这段chunk的开始位置就是这段动态引入的代码
                        chunkId: 2
                        column:0,
                        line:3,
                        //注意这里是namesRange，上面是nameRange，在最终输出文件的时候，需要把require的文件名都替换成id，如果有namesRange那么替换的是chunkId，nameRange替换的是模块id
                        namesRange:Array(2) [61, 65],
                        //这个代码段依赖的文件
                        requires: [
                            {
                                name: "c",
                                id:
                            },
                            {
                                column:11,
                                line: 4,
                                name: "b", 
                                nameRange: [101, 103] 
                            },
                            {
                                column:12,
                                line: 5,
                                name: "d", 
                                nameRange: [134, 136] 
                            }
                        ]
                    }
                ],
                //文件源代码
                source: ""
            }
        },
        //包含所有模块，键是模块id，值和上边一样，是一个速查的对象
		modulesById: {},
        //代码段信息,键是代码段id
		chunks: {
            chunkId: {
                //代码段唯一id，以0开始
                id: 0,
                //代码段入口（同步引用的就是入口文件，异步的话是对应模块中的async对象）
                context: chunkStartpoint，
                // 表示这个代码段包含哪些模块（文件），key是模块id
                // include表示需要处理的
                // in-parent表示这个模块有重复的，在他的父亲chunk中有，这个不做处理
                modules: {
                    moduleId: "include"
                },
                // 有parents属性，说明这个chunk是在别的chunk里面因为动态引入而生成的，表示哪些chunk动态引入过这个chunk
                parents: [chunkId1, chunkId2],
                // 当这个代码段的modules中没有include的值时候，表示这个代码段是空的，设置为true
                empty: true或者没定义
                //表明有chunk和本chunk有相同的有效模块
                equals: chunkId
            }
        },
        //键是一个chunk所属的有效modules的key排序后的字符串,
        //用于检测是否有不同chunk拥有相同的模块。
		chunkModules: {
            "0 1 2"
        } // used by checkObsolete
	}
# 具体函数分析
## buildDeps
最核心的函数，创建依赖树。构建依赖树的模块，然后构建依赖树的代码段。然后对代码段做去空，去重等处理。

## addModule
调用resolve方法寻找文件位置，然后在回调addModule_a1中创建并添加模块信息。

## resolve
  解析文件，仿照commonJs规范，
  首先判断是否是第三方模块（根据有无地址），如果不是模块，首先按照同名文件找，然后按照文件名加后缀（默认"js", "web.js"）找，如果没找到，
  按照文件夹找，如果package.json存在，寻找main字段的文件，否则寻找目录下index文件。

## addModule_a1
定义模块相关的依赖树信息.

首先读取文件内容，然后调用parse进行词法分析。parse的部分没有细看，有兴趣的同学可以仔细研究下
解析出来所有的依赖信息，
结构如下：
{
    //解析的文件中所有同步的依赖
    requires: [
        {
            //代码在第几列
            column:8
            //代码在第几行
            line:1
            //引用名字是什么
            name:"a"
            //依赖的路径在整个代码中的开始和结束位置
            nameRange:Array(2) [16, 18]
        },
        {
            column:8
            line:2
            name:"b"
            nameRange:Array(2) [39, 41]
        }
    ],
    //解析的文件中所有异步块：使用require.ensure语法的函数（通过jsonP技术动态引入的部分，代码中对应require.ensure的部分)
    asyncs: [
        {
            column:0,
            line:3,
            //ensure第一个参数的起始位置
            namesRange:Array(2) [61, 65],
            requires: [
                {
                    name: "c",
                },
                {
                    column:11,
                    line: 4,
                    name: "b", 
                    nameRange: [101, 103] 
                },
                {
                    column:12,
                    line: 5,
                    name: "d", 
                    nameRange: [134, 136] 
                }
            ]
        }
    ]
}
asyncs中有可能嵌套asyncs和requires，递归检索出这个文件中依赖的所有文件，如果依赖的文件为0，直接执行回调。
否则对每个依赖文件调用addModule方法，在回调里判断剩余处理模块是不是0，如果是0或报错，调用回调。否则回调里就设置对应模块的id。

## buildDeps_a1
构建依赖树，调用addChunk创建所有的代码段，然后遍历所有的代码段，
依次做removeParentsModules去掉动态引入的代码段的重复模块。

## addChunk
设置代码段数据结构
	var chunk = {
        //代码段唯一id，以0开始
		id: depTree.nextChunkId++,
        //代码段包含的模块
		modules: {},
        //代码段上下文（同步的上下文就是入口模块，如果动态引入的就是asyncs中的对象)
		context: chunkStartpoint
	};
如果是入口模块的话，设置入口模块的chunkId属性为id。调用addModuleToChunk把所有模块添加到chunk，包括入口模块。

模块中所有require里都是模块，async都是require.ensure的函数段，一个async就有可能生成一个chunk。构建chunk就是从入口模块中遍历自己所有的require和async以及这些中的require和async。把模块都取出来放到chunk中（chunk中的modules对象），如果是async，就创造一个新的chunk，把他自己引用的放到这个chunk中。

## addModuleToChunk
设置chunk信息到module，同时添加module信息到chunk。
就是在module中设置chunks告诉模块被哪些代码段使用，
在chunk中设置module告诉chunk包含哪些文件。
并遍历模块的require引用，调用addModuleToChunk。
如果有async属性，也就是动态引入的话，认为这个是新的一段代码段，如果该模块没有chunkId属性的话(就是非入口)，调用addChunk创造新的chunk。把所属的chunkid添加到新chunk的parents数组中。


## removeParentsModules
如果一个chunk有parents属性，表示这个chunk有被其他的chunk动态引入过，那么如果这个chunk包含的module在引用他的chunk中存在过，
那么就把这个module的值设置成in-parent.表示重复，后续将不会被处理。

## removeChunkIfEmpty
遍历一个chunk的modules，看是否不存在modules是include的，如果不存在，表示这个chunk为空，把入口模块的chunkId设置成null，
把chunk的empty设置成true。

## checkObsolete
查看是否有重复的chunk

## webpack_a1
遍历所有的chunks，根据chunk数量，配置来获取不同的模板写入到文件中，并输出统计信息。
如何写，
遍历deptree的chunks，然后遍历chunks的所有modules，把每个modules中的require替换成require(moduleId)的形式，异步的替换成
require(chunkId)的形式
然后把每个chunk输出成{
    moduleid: function(module, exports, require) {

        源代码的形式
    }
}

## writeChunk
遍历chunk下拥有的module，然后把这些module的源代码中的require中的路径替换（调用writeSource方法），最后把源代码包装成形如：
1: function(module, exports, require) {

    //源代码
} 这样的一个对象.
对象的键是模块id，值是一个有三个参数的函数，函数体就是替换后的源代码。


## writeSource
以模块为单位，
处理了三种情况：
1. 普通require 
2. require.ensure的动态导入
3. require("./aaa" + dir)这种的context的（这个是下个版本实现的功能）
普通require就是替换require中的地址为模块id

require.ensure替换ensure中的第一个参数为chunkId。

context的替换分两部分，第一部分把require替换成require(模块id)第二部分是吧"./aaa"替换成"./"
变成require(1)("./" + dir),这样当require(1)的时候，这个1的模块的source就是处理context时候生成的
function(name) {
    var map = {
        "./a.js": moduleId
    }
    return require(map[name]);
}
实际上上下文是一个该目录下所有文件的映射，根据地址映射到模块id，然后根据需求返回require。

最终源代码的替换实际操作是把所有的需要替换的弄成一个数组对象，包含开始位置，结束位置和替换内容。
然后从后往前用字符串连接方式替换: source.substr(0, start) + value + source.substr(end)，
从后往前不会改变前面的相对位置。


# 总结
见图片
![webpack第一版打包过程.png](https://raw.githubusercontent.com/zcs19871221/mydoc/master/image/webpack%E7%AC%AC%E4%B8%80%E7%89%88%E6%89%93%E5%8C%85%E8%BF%87%E7%A8%8B.png)


# 相关资源

项目地址：https://github.com/zcs19871221/webpack-1/tree/read 我fork的webpack原始版本。增加了一些注释

# 下一步计划看有关context的提交，希望能多交流



# webpack源代码解读(二)

这次我们选用提交分支14b42ac18b4d7a2e48bb99d559e268dcd6b82f1d 
因为这个分支的提交信息有context这一重要的概念。

首先我们和上一个代码版本（最早的版本）进行比较，可以发现lib库中主要更改了
lib/parse.js 
lib/buildDeps.js 
lib/resolve.js 
lib/writeSource.js

我们按照之前了解的顺序依次研究，
## parse.js
首先是parse.js,把require中的变量拼接的固定部分取出来了，形成一个context属性。
对应代码在parse.js的178行：
context属性如下：

    var newContext = {
        //require中的静态字符串部分
        name: dirname,
        require: true,
        //第一个元素是name属性的静态字符串在文件中的位置
        replace: [[108, 139], remainder],
        calleeRange: expression.callee.range,
        line: expression.loc.start.line,
        column: expression.loc.start.column
    };


我们可以分析出，context是require中由静态字符和变量组合而成的require形式。

## resolve.js修改
增加了resolve.context函数，判断是否存在且是目录。

## buildDeps.js修改
在buildDeps文件中的addModule函数中，添加组件的时候，会把这个模块所有的context取出来，调用addContextModule，
addContextModule会创建一个新的模块，这个模块的requires里包含所有context目录下的文件所创建成的模块。
然后把这个新的模块添加到拥有这个context模块的模块的require中。

addContextModule中的参数context, contextModuleName分别代表这个context的文件夹地址和context中require的文件名静态字符串，
然后调用resolve.context组装出context和contextModuleName组装成的最终目录。
然后在这个目录递归遍历所有文件，把所有文件添加到组件，最后构建好的contextModule如下：

E:\test\webpack\examples\require.context\templates(是require中的静态地址最终拼接出的绝对目录) : {
    requireMap: {
        //键是该目录下相对地址，值是模块id
        "./a.js": 2,
        "./test/c.js": 3
    },
    source: "写入一个函数，传入的是name，写入requireMap变量，返回requireMap[name]
}

## writeSource.js文件


## 理解最后输出的文件架构
架构如下：
function(document) {
    return functon(module) {

        //保存所有的模块暴露出的exports对象
        var installedModule = {
            moduleId: {
                exports: {

                }
            }
        }

        //用来标记chunks以及它的加载情况
        //键是chunkId，值是加载的后的回调函数，这里0:1表示第一个chunk永远是已加载的。
        var installedChunks = {0:1}

        //遵循commonJs规范，如果没缓存，执行，返回module.exports
        //否则直接读缓存，返回module.exports 
        //module.exports = exports（变量）
        var require方法


        //实际上是一个jsonP方法，ensure的参数是模块id，根据installedChunks看是否加载，如果没加载，
        //设置installedChunks[chunkId] = [ensure函数中的回调函数].
        //然后通过添加<script>的方法请求对应chunk的js文件(chunkId开头)。对应的js文件使用webpackJson来处理。
        require.ensure

        //动态加载后的处理，第一个参数是chunkId，第二个是一个模块对象，key是模块id，value是包装后的源代码。
        //会把第二个参数里的模块统统添加到所有的模块对象中。然后调用installedChunks[chunkId]中的回调。这时候回调里头
        //require的模块因为刚才的步骤已经从chunk中赋值过来了。
        webpackJson


    }

}()({
    // 这里module === installedModule[模块Id] 
    // exports === installedModule[模块Id].exports
    // require是上边的预设方法
    模块Id: function(module, exports, require) {

        //替换requir后的源代码
    }
})
















  