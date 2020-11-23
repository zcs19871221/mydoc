1.  dns 解析
    浏览器 dns 缓存
    os dns 缓存（hosts）
    路由器 dns 缓存
    请求 dns 服务器
    返回 ip 地址
2.  tcp
    三次握手
3.  http 响应

    1. 状态码

       1xx：信息
       2xx：成功
       3xx：重定向
       4xx：客户端错误
       5xx：服务器错误

    2. http 响应头
    3. http 响应体

4.  浏览器渲染

    1. 过程
       1. 解析 html -> dom 树
          1. 自上而下
          2. 图片 外链 css 在解析时候开始下载并异步处理
          3. 字节-字符-令牌-节点-dom
       2. 解析 css -> css 规则树
       3. 结合 dom 和 css 树，生成渲染树
       4. 布局/reflow
       5. paint
       6. gpu 显示在屏幕上
    2. 关于阻塞

       1. 无阻塞：解析 html 的时候，所有的外链下载都是并行的，下载不会阻塞。
       2. 阻塞

          1. js：渲染过程中遇到 js，会等待下载完成并执行完成。
             解决方式：
             1. 无依赖的 js：defer，async 或通过 createElement 2
             2. 有依赖的 js，标签放底部。至少不会阻塞基本 dom 和样式的执行。
          2. css：渲染过程中遇到 css，会等待下载完成并执行。
             解决方式： 1. 切分 css 2. 添加媒体查询和媒体类型


    3. 执行 js 后，dom 树有可能
       js -> style -> reflow -> repaint -> compose

       其中消耗资源从高到低是 reflow > repaint > compose

       reflow 触发条件：
       dom 操作
       display:none;

       2. 可能导致的因素：js 强制计算操作
       3. 优化方法(https://developers.google.com/web/fundamentals/performance/rendering/?hl=zh-cn)
          js: 1. requestAnimationFrame 2. webworker 3. microtask 4. dev tools 评估 5.批量变更样式 6.批量修改 dom，一次挂载
          css 1. 降低选择器复杂性 2. 减少必须计算其样式的元素数量（Bem)

          避免避免强制同步布局：在js操作未结束前，强制执行布局，而不是按照浏览器默认，执行完js后统一执行布局。

          2. 缓存 css 数据，防止在 loop 中连续查询
          仅合成操作 1. 坚持使用 transform 和 opacity 属性更改来实现动画。 2. 使用 will-change 或 translateZ 提升移动的元素。 3. 避免过度使用提升规则；各层都需要内存和管理开销。
          debonce
