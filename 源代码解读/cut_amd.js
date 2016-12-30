 var amdLoader = { //js加载，含module def, common def, plain js
    _fns: {},  //defid|filename : module def  {fn: fn, depInject: []} 表明依赖已满足
    _exports: {},  //defid|filename: exported object or text content
    _loadedlink: {}, //existed link nodes
    _defers: {},  //defers for modules
    _promises: {},  //promises for deps
    makeDefer: function(name, defined, notDefine){ //defined表示模块为内联定义
      var defers = amdLoader._defers;
      var tmp = name.split('@');
      name = tmp[0];
      var charset = tmp[1] || 'utf-8';
      if(defers[name]) return defers[name];
      var loader = defers[name] = $q.defer();
      var promise = loader.promise;
      if(!notDefine) promise.deploy = function(widget, parent){ //如有需要，用来实例化组件
        var args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
        promise.then(function(def){
          if(isFunction(def.deploy)){
            widget = def.deploy(widget, parent, args);
          }
        });
        return widget;
      }
      if(!defined){
        var exports = amdLoader._exports;
        if(exports[name]){
          loader.resolve(exports[name]);
        }else if(name.substr(0,1) != '%'){ //%开头的组件需内联定义
          ajax.require(name, {
            charset: charset
          }).success(function(){
            amdLoader.postDefine(name, null, notDefine); //构造函数加载完成，处理依赖
          });
        }
      }
      return loader;
    },
    get: function(name){ //加载模块并实例化
      if(!name) return $q.ref();
      name = fullName(name);
      var loader = amdLoader.makeDefer(name);
      return loader.promise;
    },
    getExport: function(file){
      var exports = amdLoader._exports, fns = amdLoader._fns, type;
      file = file.replace(/(\w)\@.*/, '$1');
      if(/^(plugin)\!(.*)/.test(file)){
        type = RegExp.$1;
        file = RegExp.$2;
      }      
      var _def = fns[file];
      if(type == 'plugin'){
        return _def;
      }else if(!exports[file] && _def){
        if(isFunction(_def.fn)){
          var fnResult = _def.fn.apply((exports[file] = observableObj()), _def.depInject);
          if(isDefined(fnResult)) exports[file] = fnResult;
        }
      }
      return exports[file];
    },
    createLink: function(href){//加载样式表
      var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
      var link = amdLoader._loadedlink[href];
      if(!link) {
        link = amdLoader._loadedlink[href] = document.createElement("link");
        link.href = href;
        link.rel = "stylesheet";
      }
      head.appendChild(link);
    },
    depPromise: function(depfile, relpath){ //加载define所需依赖
      var that = this;
      var promises = that._promises;
      var promise = $q.ref();

      if(/^text\!/.test(depfile)){
        depfile = fullName(depfile, relpath);
        var file = depfile.replace(/.*\!/, '');
        var exports = that._exports;
        if(exports[depfile]){
          return null;
        }else{
          promise = promises[depfile];
          if(!promise){
            promise = promises[depfile] = new Promise(function(resolve){
              ajax.get(file).success(function(txt){
                exports[depfile] = txt;
                resolve(txt);
              });
            });
          }
          return promise;
        }
      }else{
        var notDefine = (depfile.substr(0, 1) == '!');
        forEach(depfile.split(SPLITER), function(js){ //depfile需要同步加载
          promise = promise.then(
            function(){
              return that.makeDefer(fullName(js.replace(/.*\!/, ''), relpath), false, notDefine).promise
            });
          });
        return promise;
      }
    },
    postDefine: function(file, def, notDefine){ //define函数已执行，开始处理依赖
      $$.define.amd = {jQuery: true};
      var exports = amdLoader._exports, 
          module = win.module;
      var defer = amdLoader.makeDefer(file, true); //不需要ajax.require
      if(defer.def && !def && !defineQueue.length) return; //异步加载packed module(如jQuery)
      var promises = [];
      if(!notDefine){
        if(!def){
          if(module && module.exports) def = {fn: module.exports}, delete module.exports;
          else def = defineQueue.shift();
        }
        if(!def) throw("define not found for " + file); //error

        if(isString(def.fn)){ //def.fn为文本
          exports["text!"+file] = def.fn;
          return;
        }else if(!isFunction(def.fn)){ //def.fn为JSON对象
          exports[file] = def.fn || {};
          defer.resolve(def);
          return;
        }
      }
      (def && def.deps ? aliasPromise : $q.ref()).then(function(){
        if(!notDefine){
          def.name = file;
          if(isArray(def.deps)) fullNames(def.deps, file);
          promises.push(require(def.deps).then(function(di){
            def.depInject = di;
            def._deps = def.deps;
            delete def.deps;
            amdLoader._fns[file] = def;
          }));
          def.deploy = function(widget, parent, args){
            (widget._lazyPromise || $q.ref()).then(function(){
              amdLoader.instantiate(def, widget, args);
            });
            return widget;
          };
        }
        $q.all(promises).then(function(){
          defer.def = def;
          defer.resolve(def, true);
        });
      });
    },
    instantiate: function(def, widget, extendArr){ //满足依赖后，逐个实例化
      if(!widget._preparedDefer) return;
      //scope原型链继承
      var parentScope = widget.parent.scope,
          scope = widget.scope;
      var models = widget.models = new Models(widget);
      widget.update = scope.$update = models.update.bind(models);
      widget.views = new Views(widget);
      scope.$widget = widget;
      scope.$root = widget.$root;
      var wrap = widget.$root[0], prepared = function(){
        parseState(scope, wrap.getAttribute('ne-state'));
        widget._preparedDefer.resolve(widget);
      }
      widget.prepared(function(){
        var parentDestroys = widget.parent.$root && widget.parent.$root[0]['ne-destroy'];
        forEach(['ne-state-extend', 'ne-extend'], function(attr){
          var value = wrap.getAttribute(attr);
          value && _directives[attr].call(widget.parent, parentScope, wrap, value, parentDestroys);
        });
      });
      if(def){
        scope.$moduleid = def.name;
        def.fn.apply(scope, def.depInject);
        prepared();
        if(extendArr){
          if(!isArray(extendArr)){
            extendArr = [extendArr];
          }
          forEach(extendArr, function(obj){
            extend(true, scope, obj);
          });
        }
        loadHtml(def.name, widget); //htmlLoader->extendPromise
      }else{
        prepared();
      }
    }
  };