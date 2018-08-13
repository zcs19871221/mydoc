## 格式化代码
prettier vscode插件，比vscode自带的alt + shift + f好用。主要是能把单行的拆分成多行。

## 在vscode里面debugchrome（是否有用存疑）
1. 安装chrome debugger插件
2. 在vscode的launch.json中插入

        {
        "version": "0.2.0",
        "configurations": [{
            "name": "Chrome",
            "type": "chrome",
            "request": "launch",
            "url": "http://localhost:3000",
            "webRoot": "${workspaceRoot}/src",
            "sourceMapPathOverrides": {
            "webpack:///src/*": "${webRoot}/*"
            }
        }]
        }
