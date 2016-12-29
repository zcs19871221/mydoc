$$.ajax = (function(){ //ajax, jsonp
    var JSON_START = /^\s*(\[|\{[^\{])/,
        JSON_END = /[\}\]]\s*$/,
        CONTENT_TYPE_APPLICATION_JSON = {'Content-Type': 'application/json;charset=utf-8'};
    var defaults = ajax.defaults = {
      transformResponse: [function(data) {
        if(isString(data) && JSON_START.test(data) && JSON_END.test(data))
          data = JSON.parse(data, true);
        return data;
      }],
      transformRequest: [function(d) {
        return (isArray(d) || isObject(d)) && !$$.isFile(d) ? JSON.stringify(d) : d;
      }],
      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        },
        post:   extend({}, CONTENT_TYPE_APPLICATION_JSON),
        put:    extend({}, CONTENT_TYPE_APPLICATION_JSON),
        patch:  extend({}, CONTENT_TYPE_APPLICATION_JSON)
      }
    };
    var ajaxBackend = createHttpBackend($$.cb);
    function ajax(requestConfig) {
      var config = {
        transformRequest: defaults.transformRequest,
        transformResponse: defaults.transformResponse
      };
      var defHeaders = defaults.headers;
      var headers = extend({}, defHeaders.common, defHeaders[lowercase(requestConfig.method)], requestConfig.headers);

      extend(config, requestConfig);
      config.headers = headers;
      config.method = uppercase(config.method);
      config.url = buildUrl(config.url, config.params);
      
      var serverRequest = function(config) {
        headers = config.headers;
        var reqData = '';
        if(config.method == 'GET' && isObject(config.data)){
          config.url = buildUrl(config.url, config.data);
        }else{
          reqData = config.processData === false ? config.data : transformData(config.data, headersGetter(headers), config.transformRequest);
        }
        forEach(headers, function(value, header){
          if(lowercase(header) === 'content-type'){
            if(!isDefined(config.data) || !headers[header]) delete headers[header];
          }
        });
        return sendReq(config, reqData, headers).then(transformResponse, transformResponse);
      };
      var promise = serverRequest(config);
      promise.success = function(fn) {
        promise.then(function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return promise;
      };
      promise.error = function(fn) {
        promise.then(null, function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return promise;
      };

      return promise;

      function transformData(data, headers, fns) {
        if(isFunction(fns))
          return fns(data, headers);

        forEach(fns, function(fn) {
          data = fn(data, headers);
        });

        return data;
      }
      function transformResponse(response) {
        var resp = extend(response, {
          data: transformData(response.data, response.headers, config.transformResponse)
        });
        return (isSuccess(response.status)) ? resp : $q.reject(resp);
      }
    }

    ajax.pendingRequests = [];
    createShortMethods('get', 'delete', 'head', 'jsonp', 'require');
    createShortMethodsWithData('post', 'put');

    function createShortMethods() {
      forEach(arguments, function(name) {
        ajax[name] = function(url, config) {
          return ajax(extend(isObject(config) ? config : {}, {
            win: this,
            method: name,
            url: url
          }));
        };
      });
    }
    function createShortMethodsWithData() {
      forEach(arguments, function(name) {
        ajax[name] = function(url, data, config) {
          return ajax(extend(isObject(config) ? config : {}, {
            win: this,
            method: name,
            url: url,
            data: data
          }));
        };
      });
    }
    function sendReq(config, reqData, reqHeaders) {
      var url = config.url;
      ajax.pendingRequests.push(config);

      var timeoutId, abort = $q.defer();
      var promise = new Promise(function(resolve, reject){
        function done(status, response, headers) {
          if(timeoutId) clearTimeout(timeoutId);
          status = Math.max(status, 0);
          (isSuccess(status) ? resolve : reject)({
            data: response,
            status: status,
            headers: headersGetter(headers),
            config: config
          });
        }
        ajaxBackend.call(config.win, config.method, url, reqData, done, reqHeaders, abort.promise, config.responseType);
      });
      
      function removePendingReq() {
        var idx = ajax.pendingRequests.indexOf(config);
        if(idx !== -1) ajax.pendingRequests.splice(idx, 1);
      }
      promise.then(removePendingReq, removePendingReq);
      promise.abort = function(){
        abort.resolve();
      }
      if(isFunction(config.beforeSend)){
        if(config.beforeSend(promise, config) === false){
          promise.abort();
        }
      }
      if(config.timeout > 0){
        timeoutId = setTimeout(promise.abort, config.timeout);
      }
      return promise;
    }
    function isSuccess(status) {
      return 200 <= status && status < 300;
    }
    function createXhr(method) {
      return msie <= 6 ? new this.ActiveXObject('Microsoft.XMLHTTP')
        : (msie < 10 && method === 'PATCH') ? new this.XDomainRequest : new this.XMLHttpRequest;
    }
    function createHttpBackend(callbacks) {
      var ABORTED = -1;
      return function(method, url, post, callback, headers, abort, responseType) {
        var status, xhr;
        var win = isWindow(this) ? this : window;
        if (method == 'REQUIRE') {
          jsonpReq(url, function() {
            completeRequest(callback, 200);
          }, headers);
        } else if (method == 'JSONP') {
          var callbackId = '_' + (callbacks.counter++).toString(36);
          var globalCallback = callbacks[callbackId] = function(data) {
            if(!globalCallback.datas) globalCallback.datas = [];
            globalCallback.datas.push(data);
          };
          if(/callback=(\w+)/.test(url)){
            var cbName = RegExp.$1;
            if(cbName != 'CALLBACK'){
              globalCallback = win[cbName] || (win[cbName] = callbacks[callbackId]);
            }
          };
          jsonpReq(url.replace('CALLBACK', 'bowlder.cb.' + callbackId),
                   function() {
                     var data = globalCallback.datas && globalCallback.datas.shift();
                     if (data) {
                       completeRequest(callback, 200, data);
                     } else {
                       completeRequest(callback, status || -2);
                     }
                     delete callbacks[callbackId];
                   }, headers);
        } else {
          xhr = createXhr.call(win, url.indexOf('//') != -1 && url.indexOf(location.host + '/') == -1 ? 'PATCH' : method);
          xhr.open(method, url, true);
          forEach(headers, function(value, key) {
            if(key == 'withCredentials'){
              xhr.withCredentials = value;
            }else if(isDefined(value) && xhr.setRequestHeader){
              xhr.setRequestHeader(key, value);
            }
          });

          xhr.onreadystatechange = function() {
            if (xhr && xhr.readyState == 4) {
              var responseHeaders = null, response = null;
              if(status !== ABORTED){
                response = xhr.response || xhr.responseText;
                if(xhr.getAllResponseHeaders) responseHeaders = xhr.getAllResponseHeaders();
              }
              completeRequest(callback,
                              status || xhr.status,
                              response,
                              responseHeaders);
            }
          };
          if(responseType) xhr.responseType = responseType;
          xhr.send(post || null);
        }
        
        abort.then(abortRequest);
        function abortRequest() {
          status = ABORTED;
          if(xhr) xhr.abort();
          else completeRequest(callback, status);
        }
        function completeRequest(callback, status, response, headersString) {
          xhr = null;
          status = (status === 0) ? (response ? 200 : 404) : status;
          status = status == 1223 ? 204 : status;
          callback(status, response, headersString);
        }
      };

      function jsonpReq(url, done, headers) {
        var parent = msie < 9 ? document.getElementsByTagName('head')[0] : document.body || document.head || document.getElementsByTagName('head')[0] || document.documentElement,
            script = document.createElement('script');
        function doneWrapper() {
          if(done) done();
          script.onreadystatechange = script.onload = script.onerror = done = null;
          try{parent.removeChild(script);}catch(e){}
        }
        if(msie < 9){
          script.onreadystatechange = function() {
            if(/loaded|complete/.test(script.readyState)) doneWrapper();
          };
        }
        script.onload = script.onerror = doneWrapper;
        script.charset = (headers && headers.charset) || 'utf-8';
        script.src = url;
        parent.appendChild(script);
      }
    }
    return ajax;
  })();

  // 解读：
ajax函数:  
闭包持久化参数和方法
全局方法extend把用户config和默认的配置深复制到新的本地config
给用户开放success和error接口(让用户传fn给then(reolsve, reject))
->serverRequest
  ->buildUrl处理url(把对象合并到url参数里，如果有的话:
      {
        p1: [1,2,3],
        p2: 3 => p2 = [3]
      }
      [encodeUri(p1) = encodeUri(1), encodeUri(p1) = encodeUri(2)].join("&")
  ->transformdata处理数据(根据传入方法决定处理请求还是返回数据)
    ->transformRequest(处理请求体(body))
      如果请求体类型是数组或对象并且不是文件类型时候,执行JSON.stringify否则不执行
  删除不用的header(无请求体数据去除content-type头)
  ->sendReq
    promise巧妙的思路:
      预先定义,通过闭包变量保存的方式,在异步结束后触发流程.
      比如超时设定:
        在这个函数里并没有定义xhr,但是我预先定义了超时触发的promise.
        当创建xhr的时候,再在这个promise里then xhr.abort()方法.
        当超时的时候,通过触发resolve方法,让then里的方法执行,实现舍弃ajax请求.
      再比如传入函数中的done回调函数,保存了resolve方法,就是当或者xhr的readystatus==4
      或者jsonp的sciprtonload事件触发的时候,执行这个done方法,触发后续的流程.

    1.暂时push配置对象到ajax.pendingRequests
    2.定义中止的abort = $q.defer()(用于超时时候调用)
    3.定义一个promise,传递一个done函数作为触发的回调函数(done里执行resolve)
    4.定义超时的触发器 promise.abort: abort.resolve();
    4.定义setTimeout多少秒后执行promise.abort(超时定义)
    5.promisethen一个removePendingReq        
    ->3步中调用ajaxBackend
    传了全局变量$$.cb用于保存jsonP的回调函数,如果用户自己定义了,就存用户的函数.
    否则存默认的回调,默认的回调会把返回的数据存到这个函数的datas属性里
      ->createHttpBackend
        require或jsonP->jsonpReq
          [创建
                  script标签,定义src属性,charset属性,
                  设置onload和onerror回调用来触发主promise的resolve并把script上定义的回调清空,把script删除.]
        一般请求不调用.
        当请求完毕,界定条件是:
          jsonp类的是script触发onload或onerr事件,
          一般ajax请求是readystatus===4
      ->completeRequest(callbak, status, response, headersString)  
        ->sendReq中定义的done
          清空timeoutid,根据status状态判断是触发resolve还是reject事件.

=>触发在sendReq中then的removePendingReq
  清除ajax.pendingRequests中保存的config对象.
=>触发在serverRequest中then的transformResponse
  ->transformData->transformResponse 判断返回值,parse掉
=>触发用户定义的succes或者error回调

=>如果超时的时候,会调用在sendReq中定义的promise.abort触发abort的reolsve
  =>接着触发在createHttpBackend中定义的abortRequest,执行xhr.abort(一般ajax请求)
  或者completeRequest()

说明:
单箭头是同步顺序,双箭头是异步.
缩进内容是该函数的内容.



