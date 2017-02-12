
let 
    url = require("url"),
    fs = require("fs"),
    zlib = require("zlib"),
    requireModel = {
        http: require("http"),
        https: require("https")
    },
    settings = {
        requestMaxsocket: 1000,
        reqTimeout: 1 * 1000,
    },
    iconv = require("iconv-lite"),
    retryMaxNum = 3,
    encodeURIStr = (function(){ 
        let regexs = new Array(new RegExp(',', 'g'), 
                          new RegExp('/', 'g'), 
                          new RegExp('\\?', 'g'), 
                          new RegExp(':', 'g'), 
                          new RegExp('@', 'g'), 
                          new RegExp('&', 'g'), 
                          new RegExp('=', 'g'), 
                          new RegExp('\\+', 'g'), 
                          new RegExp('$', 'g'), 
                          new RegExp('#', 'g') 
            ),
            replaces = new Array('%2C','%2F','%3F','%3A','%40','%26','%3D','%2B','%24','%23'); 
            len = regexs.length;
        return function(str) {
            for (let i = 0; i < len; i++){ 
                str = str.replace(regexs[i], replaces[i]); 
            } 
            return str; 
        }
    }());

let defaultafterHandle = [
    function(buf, resHeaders) {
        let 
            contentEncoding = resHeaders["content-encoding"] || resHeaders["Content-Encoding"];
        if (contentEncoding) {
            return new Promise(function(resolve, reject) {
                zlib.unzip(buf, function(err, buffer) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(buffer);
                  }
                });        
            })       
        } else {
            return buf;
        }
    },
    function(buf, resHeaders) {
        let 
            contenttype = resHeaders["Content-Type"] || resHeaders["content-type"],
            result = /;\s*charset=(.+)/.exec(contenttype);
        if (result && result.length >= 1) {
            let charset = result[1].trim();
            if (charset.toLowerCase() !== "utf-8") {
                return iconv.decode(buf, charset);
            }
        }
        return buf;
    }
];
function typeIs(input) {
    var tostring = Object.prototype.toString;
    var type = toString.call(input);
    return type.slice(1, type.length - 1).slice(7)
}
function parseUrl(inputUrl, method, data) {
    let
        urlObj = url.parse(inputUrl);
    urlObj.protocol = urlObj.protocol.replace(":", "");
    urlObj.port = parsePort(urlObj.port, urlObj.protocol);
    urlObj.port.query = parseQuery(urlObj.port.query);
    urlObj.path = insertData2Url(urlObj.path);
    return urlObj;
}

function insertData2Url(url, data, method) {
    if (method === "GET" && data) {
        let list = [],
            joinStr = "?";
        Object.keys(data).forEach(function(key) {
            list.push(encodeURIStr(key) + "=" + encodeURIStr(data[key]));
        })
        if (url.indexOf("?") > -1) {
            joinStr = "&";
        }
        url += joinStr + list.join("&");
    }
    return url;
}

function parsePort(originPort, protocol) {
    let port = originPort;
    if (port == undefined) {
        if (protocol === "http") {
            port = 80;
        } else if (protocol === "https") {
            port = 443;
        } else {
            throw new Error("端口不正确");
        }
    } 
    return port;
}
function parseQuery(query) {
    let
        reg = /([^=]*)=([^&]*)/g,
        result = "",
        queryObj = {};
    while(result = reg.exec(query)) {
        let key = result[1],
            value = result[2];
        queryObj[key] = value;
    }
    return queryObj;
}

function setHeader(header, hostname) {
    let _header = {
        "Connection":"keep-alive",
        "Host": hostname,
        "Accept": "text/html",
        "Accept-Charset": "utf-8"
    }
    if (header) {
        Object.keys(header).forEach(function(key) {
            if (key) {
                _header[key] = header[key];
            }
        })       
    }
    return _header;
}
var _agent = new require("http").Agent({
    keepAlive: true,
    maxSockets: 5
})
var flag = true;
function initArgs({url, method, header, data, beforeSend, afterHandle}) {
    if (!url) {
        console.error("请输入url和method参数！");
        return ;
    }
    if (data) {
        if (typeIs(data) !== "Object") {
            console.error("data数据必须是对象");
            return "";
        }
    }

    let 
        urlObj = parseUrl(url, method, data),
        retrynum = 0;
    method = method ? method.toUpperCase() : "GET";
    
    function sendRequest({urlObj, method, header, data, beforeSend, afterHandle}) {
        var x = new Date();
        let 
            mymodel = requireModel[urlObj.protocol],
            options = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                method: method,
                path: urlObj.path,
                headers: setHeader(header, urlObj.hostname),
                agent: _agent
            },
            len = 0,
            _arg = arguments[0];
        if (beforeSend) {
            beforeSend(options);
        }
        let req = mymodel.request(options, function(res) {
            let 
                len = 0,
                data = [];
            res.on("data", function(chunk) {
                data.push(chunk);
                len += chunk.length;
            });
            res.on("end", function() {
                let 
                    resbuf = Buffer.concat(data, len),
                    resHeaders = res.headers,
                    afterHandleType = typeIs(afterHandle),
                    pro = new Promise(function(resolve) {
                        resolve(resbuf);
                    });
                if (!afterHandle) {
                    afterHandle = function(resBuf, headers) {
                        console.log(resBuf.toString());
                    }
                } 
                defaultafterHandle.push(afterHandle);
                defaultafterHandle.forEach(function(each) {
                    pro = pro.then(function(buf) {
                        return each(buf, resHeaders);
                    })
                })
                pro.catch(function(e) {
                    console.log(e);
                })
            });
        });  
        req.on('error', (e) => {
            console.error(e);
            if (++retrynum <= retryMaxNum) {
                console.log("错误重新发送：" + retrynum);
                sendRequest(_arg);
            }
        });
        if (method !== "GET" && data) {
            req.write(data);
        }
        req.end(); 

        req.setTimeout(+settings.reqTimeout, function(e) {
            console.error("请求接口数据超时");
            if (++retrynum <= retryMaxNum) {
                console.log("超时重新发送：" + retrynum);
                sendRequest(_arg);
            } else {
                throw new Error("超过" + retrynum + "次");
            }
        })
        req.on("connect", function() {
            console.log("connect event");
        })
        req.on("socket", function(socket) {
            console.log("socket event");
                socket.on("close", function(err) {
                    console.log("socket on close" + err);
                })
                socket.on("connect", function() {
                    x = new Date();

                    console.log("socket on connec");
                })
                socket.on("data", function(str) {
                    console.log("socket on data: ");
                })
                socket.on("drain", function() {
                    console.log("socket on drain");
                })
                socket.on("end", function() {
                    console.log("socket on end");
                })
                socket.on("error", function() {
                    console.log("socket on error");
                })
                socket.on("timeout", function() {
                    console.log(x);
                    console.log("socket on timeout" + (new Date() -x));
                })
                flag = false;
            
        })
        req.on("aborted", function() {
            console.log("aborted event");
        })
        req.on("continue", function() {
            console.log("aborted event");
        })

    }
    sendRequest({urlObj, method, header, data, beforeSend, afterHandle});
}
module.exports = initArgs;

// initArgs({
//     url: "http://www.w3school.com.cn/tags/tag_form.asp",
//     method: "GET",
//     header: {
//         "Accept-Charset": "utf-8"
//     },
//     afterHandle: function(data) {
//         console.log("aaaa");
//     }
// })

