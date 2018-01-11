# 通用配置
1. 在用户设置中设置一个全局的launch.json作为默认的配置
2. launch.json共同
* type 默认是node，根据拓展不同使用php或go
* request launch或attach
* name 名称
3. debug相关用户配置
* preLaunchTask 启动前执行的任务名称，这个名称对应在task.json中
* internalConsoleOptions 控制debug的时候是否可见调试控制板
* debugServer 仅用于调试扩展作者：连接到指定的端口，而不是启动调试适配器
# 变量替换
* ${workspaceFolder} 在vscode中打开文件夹路径
* ${workspaceFolderBasename} 在VS Code中打开没有任何斜杠的文件夹的名称
* ${file} 当前打开的文件
* ${relativeFile} 相对于`workspaceFolder`打开的文件
* ${fileBasename} 文件名称
* ${fileBasenameNoExtension} 没有后缀的文件名
* ${fileDirname} 打开文件所属的目录
* ${fileExtname}  文件后缀
* ${cwd} 当前目录
* ${lineNumber} 当前文件中选择的行号

# 直接运行不debug
快捷键 ctrl + f5

# vscode内置配置和内置命令

* ${config:Name} - example: ${config:editor.fontSize}
* ${command:CommandID} - example: ${command:explorer.newFolder}

# debug混合模式，并行开启多个debug程序

    {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "launch",
                "name": "Server",
                "program": "${workspaceFolder}/server.js",
                "cwd": "${workspaceFolder}"
            },
            {
                "type": "node",
                "request": "launch",
                "name": "Client",
                "program": "${workspaceFolder}/client.js",
                "cwd": "${workspaceFolder}"
            }
        ],
        "compounds": [
            {
                "name": "Server/Client",
                "configurations": ["Server", "Client"]
            }
        ]
    }

# 断点
1. 重置所有断点命令可以让断点回到初始设置的位置，可以应对懒加载的代码，以及断点错位的情况
2. 断点的条件可以是表达式，也可以是命中次数。
3. 使用`shift+f9`来打列断点。这对于最小化都到一列的代码非常有用
4. 使用函数名断点，当不知道代码位置但是知道函数名的时候，点击断点的加号，添加函数断点，输入函数名即可。
5. 变量可以通过Set Value 在调用堆栈改变值。


原文地址：https://code.visualstudio.com/docs/nodejs/nodejs-debugging

# 在vscode中debugnodejs
vscode编辑器内置的调试器支持nodejs运行环境，并且可以debug包括JavaScript，typeScript和其他转换成成js的语言。


这个文档阐述了nodejsdebug的细节。一般的debug特征在[这里](https://code.visualstudio.com/docs/editor/debugging)描述

## 支持node类的运行环境
由于vscode的nodejs调试器通过有线协议和nodejs运行环境通信，因此vscode支持的运行环境由该环境是否支持有线协议来决定。

今日存在两种有线协议：
* __legacy__：v8最早的调试协议，现在被所有运行环境支持，但是很有可能在node8.x版本中去掉。
* __insperctor__：新的v8[观察者协议](https://chromedevtools.github.io/debugger-protocol-viewer/v8/)，通过在nodejs中设置`--inspect`标志来使用，支持版本是>=6.3.他解决了leagcty协议中的很多限制和扩展问题。

下面这些环境的支持情况：

Runtime	'Legacy' Protocol	'Inspector' Protocol
io.js	all	no
node.js	< 8.x	>= 6.3 (Windows: >= 6.9)
Electron	< 7.4	>= 7.4
Chakra	all	not yet

虽然vscodenode调试程序会自动选择最佳的协议。但是我们仍然决定采用‘悲观方法’，通过设置一个具体的启动配置`protocol`来设置协议属性和下面的值：

* `auto`:尝试自动检测目标环境所使用的协议。如果请求类型是`lanuch`或者`runtimeExecutable`没有设置，我们会根据可访问路径的node程序执行-v来决定。如果version大于8.0，新的insperctor协议会使用。如果请求类型是`attach`我们会尝试用新协议连接,
* `inspector`：强制使用inspector连接，支持版本是node>=6.9
* `legacy`：强制使用legacy连接，支持版本是node<8.0，electorn < 7.4

从vscode1.11开始，protocol的默认值是auto

如果你的运行环境两种协议都支持，最好用inspector，因为：
* debug大文件时更稳定。legacy会非常慢当在服务器和客户端之前发送大文件
* 如果你再app中使用es6 Proxy，当在nodev7+环境中使用inspector调试时不会崩溃
* 通过检查器协议进行调试可以处理一些棘手的源地图设置。如果在源映射文件中设置断点时遇到问题，请尝试使用检查器

## 启动配置属性
下面的属性在启动属性为`lauch`和`attach`的启动配置中可用：
* `protocol`-调试协议。
* `port`-可用的调试接口。更多请参考'附加到nodejs'和'远程调试nodejs'
* `address`-调试端口的Tcp/Ip地址。更多请看'附加到nodejs'和'远程调试nodejs'
* `restart` - 重启会话或终端。更多请看'自动重启debug会话'
* `timeout` - 当充气一个回话，多少毫秒后会放弃。更多请看'附加到nodejs'
* `stopOnEntry` - 当程序启动立刻关掉。
* `localRoot` - vscode的根目录。更多请看'远程调试nodejs'
* `remoteRoot` - node的根目录。更多请看'远程调试nodejs'
* `sourceMaps` - 资源映射可用（设置true）。更多看'资源映射'
* `outFiles` - 一组全局正则来查找js文件。更多看'资源映射'
* `smartStep` - 尝试自动跳过没有资源映射的文件。更多看'智能跳过'
* `skipFiles` - 自动跳过全局正则匹配的文件。更多看'跳过不感兴趣的代码'
* `trace` - 启用诊断输出。设置为"all"来输出详细。

下面的属性在启动属性为`lauch`启动配置中可用：
* `program` - nodejs调试的绝对路径。
* `args` - 传递给debug程序的参数。属性是数组，并且每个元素唯一
* `cwd`- 启动程序在这个目录下调试
* `runtimeExecutable` - 运行环境执行文件的绝对路径。默认是`node`更多看'支持npm和其他工具的启动配置'
* `runtimeArgs` - 给运行环境执行程序的可选参数。
* `env` - 可选环境变量。期望是一个字符串类型的key/value的列表。
* `envFile` - 环境变量的配置文件路径。
* `console` - 启动程序的控制台类型。比如`internalConsole`,`integratedTerminal`，`externalTerminal`。更多看'node控制台'

下面的属性在启动属性为`attach`启动配置中可用：
* `processId` - 调试器在发送一个USR1信号后，尝试附件在这个程序进程上。通过这个配置，debugger可以附件在一个已经运行的没有处在debug模式的程序上。当使用`processId`属性，调试端口会根据nodejs版本自动决定，不能明确设置。因此不用设置`port`属性。

## 针对常见情况启动配置片段
你可以使用智能提示来添加启动配置片段，针对常用nodejs情景。（就是预设配置）
* Launch Program: 启动一个nodejs程序在debug模式。预设程序会让你输入程序名字。
* Launch via Npm：通过npm调试脚本启动程序。如果你已经定义了一个npm调试脚本，你可以直接使用这个脚本。确认在npm脚本中使用的调试端口跟小程序中定义的一致。
* attach：附件一个本地正在运行的程序一个调试端口。确认准备调试的node程序以debug模式启动，并且调试端口和配置中的一致。
* 附加到远程程序：附加到由`address`属性指定的主机上运行的Node.js程序的调试端口。确认被调试程序已经使用debug模式启动，并且使用的debug端口和配置中的一致。为了帮助vscode映射本地工作文件和远程文件，需要设置正确的`localRoot`和`remoteRoot`属性
* 根据程序id附件：打开程序选择器来选择一个node或者gulp进程来debug。根据配置你甚至可以附加到一个非debug模式启动的node或gulp程序。
* nodemon Setup：使用nodemon老重启debug线程当js源文件改变的时候。确保你在全局安装了nodemon。请注意，终止调试会话只会终止程序调试，而不是nodemon本身。要终止nodemon，请在集成终端中按Control-C

## node控制台
默认情况下，nodejsdebug会话在内置的vscodeDebug控制台中。由于这个控制台不支持从输入中读取参数，你可以启用一个外部终端或者使用vscode集成终端，通过设置`console`属性：`externalTerminal` `integratedTerminal`

如果使用外部中断，你需要设置成:`terminal.external.windowsExe` `terminal.external.osxExec` `terminal.external.linuxExec`

## launch配置来支持npm和其他工具
* 任意PATH环境变量可访问的可执行程序（npm，mocha，gulp等）可以通过`runteimExecutable`属性和设置。可通过`runtimeArgs`传参。
* 如果您的npm脚本或其他工具隐式指定要启动的程序，则不必设置`program`属性。
* 如果你制定了一个debug端口通过`port`属性，vscode不会自动添加`--inspect-brk=nnnn`属性因为debug端口已经根据npm脚本定义了。







