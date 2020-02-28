# 0. 连接池配置对 http request 的影响

maxSockets 和 maxFreeSockets 对于每一个 host 都是独立的。
比如设置为 10 5，有两个域名。
那么最后有可能产生 20 个 socket，10 个 free 的。
两种情况：

        keepalive：true
          max sockets:允许建立的最多 tcp 链接(socket),压力大的情况下，全max数量可保持长连接。
          max freeSockets：允许空闲的 tcp 链接最大个数，比如没那么多请求，就关闭max - free数量的socket。但保持free数量socket长连接。

        keepalive：false
          有请求时，先查找establish状态的socket，如果有，复用establish状态的socket。establish最多
          是maxSockets值。
          如果没有establish，创建新的请求，创建数量不受maxSockets限制。发送完后，发送fin包结束链接。处于
          time_wati状态。等待四分钟后系统释放socket。
          (
          当sockets处于establish状态时候(已建立连接但没接受到或接受完数据),如果有新的请求，
          会复用这个sockets,不会创建新的sockets。复用的最大值是max sockets的值。
          当sockets接受完数据后，没有新的请求，那么就会发送fin包结束链接。处于time_wait状态。
          新的请求来创建新的链接，这个连接数不受max sockets影响。
          )

          当client的请求速率刚好小于服务器响应时间，导致time—wait缓慢增多，最容易导致端口溢出。（就是服务器response较快，当新的请求发起时，存在的请求已经结束，转为timewati，然后给新请求创建新的socket，导致端口溢出）

          解决方法：
            1. 设置keepalive true，
            2. 减少max socket数量

# 1. nodejs 使用 http request 不设置 keepalive 配置 请求 node server 的 tcp 链接状态

        agent发送请求，server响应请求。
        agent发送【结束包】，server响应结束包。
        server发送结束包，agent响应结束包。
        server接收结束包，server关闭。
        agent进入time_wait状态,默认等待2msl(默认1分钟)时间后关闭。
        因为网络的非可靠性，所以必须设置time_wait。这是tcp协议决定的时间

# 2. nodejs 使用 http request 设置 keepalive 配置 请求 node server 的 tcp 链接状态

    agent请求获得服务端数据后，默认不会发送【结束包】
    让agent和server的tcp链接长时间保持establish。

    保持free数量的socket长连接不关闭。如果请求的链接数对应当前free数的socket能满足，不创建新请求。
    如果不能，就创建到最大free数socket并保持长连接状态。
    如果最大free数还满足不了，创建新的tcp链接到max，使用完后这些非free的socket如果空闲就关闭。
    如果请求太多，就保持最多max数的socket复用，当空闲时候，关闭非free socket。

# 3. keepalive 的首次延迟发送嗅探包时间的影响？

# 4. 链接池（socket）和 keepalive 和 linux tcp 连接数的关系？

# 5. 为什么 nginx 链接设置 keepalive 会报错（疑似被 nginx 关闭链接，但是我这里保持），如果设置 300ms 的首次延迟呢？

# 6. 为什么 tomcat 不设置 keepalive 会报错？

# 关于 keepalive

[参考](tcp翻译.md)
