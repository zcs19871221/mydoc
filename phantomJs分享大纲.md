    phantomjs.exe --output-encoding=GBK --ignore-ssl-errors=true --ssl-protocol=any --debug=true
1. 什么是phantomJs
    PhantomJS是一个无界面的,可脚本编程的WebKit浏览器引擎.PhantomJs提供javascriptAPI,支持网页导航, 截图, 以及dom操作.是一个基于BSD协议的开源软件.
    基于qtWebkit

2. 历史和版本情况
    作者是个在美国工作的印度尼西亚人
    第一个发布的版本在2011年的1月23号,最新版本是2.1,在16年的1月23日发行.

2. 主要用途(介绍以及实例演示)
    1. 无界面测试
        1.操作测试
            打开163.news.com,找到头条新闻,点击后进行截图.
    2. 页面截图
        1. 像素对比
    3. 页面自动化操作
        1.我们自己的抓取程序分析(把这个讲清楚了得了)
    4. 网络性能监控
        
        
3. compare项目中是怎么实现的,细节,亮点
4. phantomJS的一些坑和问题
    1.debug麻烦
    2.有的语法错误不抛出错误(有的open方法就是不抛出错误,死那儿)
    3.render截图是同步阻塞的,如果在加载页面时候截图会影响页面加载,并且有的时候(尤其是dom没有完全加载的时候)截不出来图
    4.文档不全,甚至有的api列出来了实际没实现...renderBuffer没有实现
5. 基于phantomJs的产品
    CasperJS
    YSlow
6. 参考资料
http://davidaq.com/share/technique/2016/08/23/phantomjs-in-action-for-fe-monitor.html

http://fex.baidu.com/blog/2015/07/front-end-test/

http://imweb.io/topic/55e46d8d771670e207a16bdc

https://www.zhihu.com/question/29922082
