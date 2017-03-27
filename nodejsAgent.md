# nodejs源代码
源代码位置：lib/_http_agent.js
​    
    //当有套接字(socket空闲时触发)
    self.on('free', function(socket, options) {
      var name = self.getName(options);
      debug('agent.on(free)', name);
      /*agent.requests是一个未分配套接字请求队列，这个name应该是域名
      当目前有未分配套接字的请求的时候，把这个套接字直接分给这个请求。然后就完事了*/
      if (socket.writable &&
          self.requests[name] && self.requests[name].length) {
        self.requests[name].shift().onSocket(socket);
        if (self.requests[name].length === 0) {
          // don't leak
          delete self.requests[name];
        }
      } else {
        //如果当前没有等待的请求的话
        // If there are no pending requests, then put it in
        // the freeSockets pool, but only if we're allowed to do so.
        var req = socket._httpMessage;
        //判断是不是keepalive为true
        if (req &&
            req.shouldKeepAlive &&
            socket.writable &&
            self.keepAlive) {
          var freeSockets = self.freeSockets[name];
          var freeLen = freeSockets ? freeSockets.length : 0;
          var count = freeLen;
          //agent.sockets是当前正在用的套接字队列，这里就是获取所有套接字：正在用的+空闲的
          if (self.sockets[name])
            count += self.sockets[name].length;
          //如果总数大于设置的maxSockets或者空闲数目大于设置的maxFreeSockets，那么干掉这个套接字
          if (count > self.maxSockets || freeLen >= self.maxFreeSockets) {
            socket.destroy();
          // 否则调用socket.setKeepAlive，内部机制就是调用系统层tcp的keepalive机制。把这个socket从当前使用的socket队列移出，放入freeSockets队列。
          } else {
            freeSockets = freeSockets || [];
            self.freeSockets[name] = freeSockets;
            socket.setKeepAlive(true, self.keepAliveMsecs);
            socket.unref();
            socket._httpMessage = null;
            self.removeSocket(socket, options);
            freeSockets.push(socket);
          }
        } else {
          //如果没设置keepalive为true的话，有空闲的socket就销毁。
          socket.destroy();
        }
      }
    });

# 总结一下，只要用了agent，
  1. 当socket空闲下来，只要有未分配的请求，都会进行复用，不管设置没设置keepalive。
  2. 如果当前没有未分配的请求
      1. 如果设置了keepalive，会根据maxSockets和freeSockets参数判断是否把这个socket暂存到freeSockets队列等待以后使用，并开启操作系统的TCP的keepalive功能。
      2. 如果没设置keepalive，这个空闲的socket直接干掉


# 测试代码
server.js是服务端代码，send是客户端。当服务端设置

server.js

    var http = require("http");
    var server = http.createServer( (req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      //故意延迟返回以模拟请求队列的排队
      setTimeout(function() {
        res.end('okay');
      }, 1000)   
    });
    server.listen(9980);
    server.on("connection", function(socket) {
        console.log("connection");
    })
    server.on("close", function() {
        console.log("close");
    })
    setInterval(function() {
        server.getConnections(function(err, num) {
            console.log("当前连接" + num);
        });
    }, 1000);

send.js

    const 
        http = require("http");
    let
        settings = {
            eachTimeSendNum: 20,
            sendInterval: 500,
            isKeepAlive: false,
            maxSockets: 5,
            maxFreeSockets: 5
        }, 
        agent = new http.Agent({
            keepAlive: settings.isKeepAlive,
            maxSockets: settings.maxSockets,
            maxFreeSockets: settings.maxFreeSockets 
        }), 
        options = {
            hostname: "127.0.0.1",
            port: 9980,
            method: 'GET',
            agent: agent,
            path: "/"
        };
    function sendRequest() {
        let req = http.request(options, function (res) {
            res.on("data", (chunk) => {
                console.log(chunk.toString());
            });
            res.on("end", () => {     
            });
        });  
        req.end(); 
        req.on("socket", function(socket) {
            if (!socket.__isNew) {
                socket.on("connect", function _connect() {
                    console.log("connect");
                })
                socket.__isNew = true;
            }
        })
    }
    (function realSend() {
        for (var i = 0;i < settings.eachTimeSendNum; i++) {
            sendRequest();  
        }
        setTimeout(realSend, settings.sendInterval);
    }());
# 关于keepalive
[参考](tcp翻译.md)

