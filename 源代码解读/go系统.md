架构
1. 核心使用go集成部署系统。
[官网](https://www.gocd.io/)
[介绍1](http://blogs.360.cn/360cloud/2014/05/13/%E6%8C%81%E7%BB%AD%E4%BA%A4%E4%BB%98%E5%B7%A5%E5%85%B7thoughtworks-go%E9%83%A8%E7%BD%B2step-by-step/)
[介绍2](http://www.cnblogs.com/huang0925/p/3535165.html)
简单来说，go类似一个工作流工具，专注于软件的集成部署
2. 自定义服务器
原来是cgi程序(应该用perl写的),现在晓全给改成了node服务器。为了实现自定义。
3. 部署脚本
在go的配置文件<pipeline></pipeline>中定义，分三步publish2static，publish2live和rollback。
分别在页面进行操作时候，调用同名的perl脚本。
新版本改成了js的程序。
4. go页面的hack
  把go的主页面修改了下，增加了一个js，增加了一些自定义的配置。
这个js会把一些自定义的配置ui写到页面上，在页面上执行这些自定义操作的时候，会发起jsonP请求自定义服务器上的接口。