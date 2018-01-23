# webpack源代码解读(一)
## 起因
webpack是一个非常好用的工具，webpack的广泛使用正是前端工程化普及的最好证明，为了更好的使用webpack并了解其内部构造，决定读一读源代码。

## 介绍
文章按照自己分析的实际过程撰写。

## 选择源代码
1. git clone下github上源代码。
2. git log查看版本信息。
3. git checkout到最原始的版本。

## 寻找源代码入口
根据自身的经验，步骤一般是
1. 首先阅读readme文件
2. 查看package.json中的bin和main字段，（启动脚本和入口文件）
3. 浏览整个目录结构

那么根据查看readme，可以看到Usage用法是执行webpack，对应package.json中的bin，我们知道webpack对应于node bin/webpack.js，然后查看webpack.js文件，可以看到调用了lib/webpack.js中的方法。

然后再看，可以看到目录结构中有一个example，打开一看，有build.js,example.js两个文件，打开build.js文件，我们可以看到是一个实例文件，这就是我们需要的。

## debug build/build.js
在build.js中，使用node开了一个子进程调试，这样debug不到，
为了debug build.js我需要在vscode中添加debug配置如下：

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

然后开始读代码

bin/webpack.js - 提取参数，传递结束的回调函数一直到底层（有错误输出错误，没错误输出stats信息）。调用lib/webpack.js
    -lib/webpack.js 
       包装回调callback参数给buildDeps
        -lib/buildDeps 
            创建depTree核心对象，保存读取的模块

                var module = depTree.modules[filename] = {
                    id: depTree.nextModuleId++,
                    filename: filename
                };
            	var depTree = {
                    //键是filename，值是module对象
                    modules: {},
                    //键是modulesId，值是module对象，同上，只不过是根据moduleId查找
                    modulesById: {},
                    chunks: {},
                    nextModuleId: 0,
                    nextChunkId: 0,
                    chunkModules: {} // used by checkObsolete
            }
            包装回调callback参数，给addModule
            -lib/addModule 封装传进来的回调: 有错误处理错误，处理结束后调用buildTree。
                包装回调callback参数，给resolve 
                回调：判断文件名是否已经处理过，如果处理过，直接取出depTree.modules[filename]。
                否则放到depTree.modules中，
                var module = depTree.modules[filename] = {
                    id: depTree.nextModuleId++,
                    filename: filename
                };
                执行fs.readFile获得文件内容，然后执行
                    -lib/parse.js解析源文件，调用esprima库的parse，然后分析语法树，最后弄出一个对象，
                    包含requires数组和asyncs数组。



                -lib/addModule中给resolve的回调：
                    如果失败，调用上级回调
                    如果depTree.modules中有文件名的缓存，直接把缓存的moduleid作为参数调用上级回调
                    如果没缓存，首先读文件，然后调用parse方法
                    parse出一个对象，里面包含require和async属性，每个属性是一个数组，包含这个文件中所有同步依赖和所有异步依赖的文件。
                    然后遍历parse出的对象中的requie和async中所有的依赖，把唯一的依赖放到
                    requires对象中。然后对每个依赖的文件递归调用addModule，生成每个模块id，模块id就是每个文件的id。


                -lib/resolve 
                    如果是相对，绝对路径，调用loadAsFile，回调函数是如果失败，那么执行loadAsDirectory
                    否则判断是node模块，调用loadNodeModules
                -loadAsFile
                    调用node的fs.stat，先尝试读取filename,如果失败，会读取extens数组的后缀，默认是.js,.web.js文件，如果后缀列表都失败，调用失败回调，会使用loadAsDirectory尝试调用文件夹。（这里的技巧就是在回调函数中再次调用方法，有的时候，回调的链式调用是必须的，比如propmise中，需要记住上一个promise的函数等，但大多数时候，是增加维护的复杂度）
                -loadAsDirectory
                读取目录里的package.json文件中的main字段，如果存在main字段，那么调用laodAsFile，fileName是main字段，如果不存在main字段，默认是index
                    

                    数据结构：
                    
                    {
                        key名是文件绝对路径,每个对象代表一个文件
                        modules: {
                            //动态引入的模块里面有由parse封装的位置信息
                            asyncs: [{
                                chunkId: 1,
                                chunks: [],

                            }],
                            //chunk的id，这个chunkId表示由一个入口文件所引用的所有文件的集合，
                            // 一个文件中动态引入的不算一个chunkId
                            chunkId: 0,
                            //代表这个模块属于哪些chunksId
                            chunks: [0],
                            filename: "e:\test\webpack\example\example.js",
                            //这个是模块id，和chunkId分开
                            id: 0,
                            //同步引用的模块，里面有由parse封装的位置信息
                            requires: [

                            ],
                            source: "var a = require('a');\r\nvar b"
                        },
                        //用来表示chunks，也就是由一个模块入口构成的集合
                        chunks: [{
                            context: {

                            },
                            //chunkId
                            id: 0 ,
                            modules: {
                                0: "include,
                                1: "include,
                                3: "include,
                            }
                        }],
                        //里头全是id，和modules一样，只不过key是moduleId
                        modulesById: {

                        }
                    }
