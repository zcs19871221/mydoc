  var _directives = {
    "ne-role": function(scope, node, value){
      var widget = this,
          roles = widget.__roles;
      forEach(value.split(/\s+/), function(roleid){
        if(!roleid) return;
        if(!roles[roleid]) roles[roleid] = [];
        roles[roleid].push(node);
      });
    },
    "ne-model": function(scope, node, expr, destroys){//control->model单向绑定
      var widget = this,
          models = widget.models;
      var item = models.add(node, expr.replace(/^\s*{{(.*?)}}\s*$/, "$1"), scope);
      destroys.push(function(){
        models.remove(item);
      });
    },
    "ne-if": function(scope, node, expr, destroys){
      var widget = this;
      node['ne-ifed'] = true;
      if(isString(expr)){
        expr = expr.replace(/^\s*{{(.*?)}}\s*$/, "$1");
        if(tagLC(node) == 'script'){
          return _directives['ne-repeat'].call(widget, scope, node, "", destroys, true);
        }
        var txtNode = document.createTextNode(""),
            enable = true,
            compiled = false;
        dom.after(txtNode, node);
        if(isArray(node['ne-destroy'])){
          node['ne-destroy'].push(function(){
            dom.remove(txtNode);
          });
        }
        var update = function(val){
          if(enable && !val){
            dom.remove(node);
            enable = false;
          }else if(!enable && val){
            dom.before(node, txtNode);
            enable = true;
          }
          if(enable && !compiled){
            compiled = true;
            widget.$refresh2 = true;
            widget.wander(node, scope, true);
            widget.compile(node);
          }
        }
        destroys.push(widget.views.add({
          fn: update,
          model: expr,
          scope: scope
        }));
        update(scope.$parse(expr));
        return txtNode;
      }
    },
    "ne-html": function(scope, node, expr, destroys){
      var widget = this;
      if(expr){
        var update = function(val, _val){
          if(isDefined(val)){
            if(msie <= 9 && /tr|thead|tbody|tfoot/.test(tagLC(node))){
              forEach(node.children, function(child){
                node.removeChild(child);
              });
              node.appendChild(dom.create(val));
            }else{
              node.innerHTML = val;
            }
            if(val && ~val.toString().indexOf('<')){
              widget.wander(node, scope);
              widget.compile(node);
              widget.$refresh2 = true;
            }
          }
        }
        destroys.push(widget.views.add({
          fn: update,
          model: expr,
          scope: scope,
          debug: $$.debug && ~expr.indexOf('(')
        }));
      }
    },
    "ne-text": function(scope, node, expr, destroys){
      var widget = this;
      if(expr){
        var update = function(val, _val){
          if(isDefined(val)) node[msie<9?'innerText':'textContent'] = val;
        }
        destroys.push(widget.views.add({
          fn: update,
          model: expr,
          scope: scope,
          debug: $$.debug && ~expr.indexOf('(')
        }));
      }
    },                          parentScope wrap value
    "ne-state-extend": function(scope, node, expr, destroys){
      var widget = this, widgetScope = widget.scope;
      if(expr){
        node.removeAttribute("ne-state-extend");
        var update = function(val, _val){
          var subWidget = $$.widget(node);
          if(val && subWidget){
            subWidget.prepared(function(){
              extend(true, subWidget.scope.state, val);
            });
          }
        }
        widgetScope.$watch(expr, update, scope, true);
        destroys && destroys.push(function(){
          widgetScope.$unwatch(expr, update, scope);
        });
      }
    },
    "ne-on": function(scope, node, expr, destroys){
      var widget = this,
          widgetScope = widget.scope,
          result;
      var subWidget = $$.widget(node);
      if(expr && subWidget){
        while ((result = PROPSPLITER.exec(expr)) !== null) {
          var msg = result[1];
          var fn = (function(val){return function(){
            var _fn = withFunc(val, widgetScope, true);
            if(isFunction(_fn)) _fn.apply(widgetScope, arguments);
          }})(result[2]);
          subWidget.on(msg, fn);
          destroys.push(function(){
            subWidget.off(msg, fn);
          });
        }
      }
    },
    "ne-extend": function(scope, node, expr, destroys){
      var widget = this,
          widgetScope = widget.scope;
      if(expr && /^\s*{{(.*?)}}\s*$/.test(expr)){
        node.removeAttribute("ne-extend");
        var update = function(val, _val){
          var subWidget = $$.widget(node);
          subWidget && subWidget.extend(val);
        }
        widgetScope.$watch(expr, update, scope, true);
        destroys && destroys.push(function(){
          widgetScope.$unwatch(expr, update, scope);
        });
      }
    },
    "ne-options": function(scope, node, value, destroys){
      var widget = this;
      node.removeAttribute("ne-options");
      if(node.options){
        var olen = node.options.length; //静态options
        var update = function(arr/*, _arr*/){
          while(olen < node.options.length){
            node.remove(olen);
          }
          createOptions(node, widget, arr);
        }
        destroys.push(widget.views.add({
          fn: update,
          model: value,
          scope: scope
        }, true));
      }
    },
    "ne-foreach": function(scope, node, value, destroys){
      var widget = this;
      node.removeAttribute('ne-foreach');
      return _directives['ne-repeat'].call(widget, scope, node, value, destroys, true);
    },
    "ne-recurse": function(scope, node, value, destroys){
      if(!scope.hasOwnProperty('$recurse')) return;
      var $recurse = scope.$recurse;
      if(!value || value.indexOf($recurse.key + '.') == -1) return;
      //空节点占位
      var nullnode = document.createTextNode("");
      dom.replace(nullnode, node);
      var widget = this,
          viewItem = {
            node: [nullnode],
            type: 'repeat',
            key: $recurse.key,
            attr: $recurse.attr,
            isJoin: $recurse.isJoin,
            model: value,
            scope: scope
          };
      destroys.push(widget.views.add(viewItem));
      if(!destroys.subnode) destroys.subnode = [];
    },
    "ne-repeat": function(scope, node, value, destroys, isJoin){
      var widget = this,
          isScript = tagLC(node) == 'script';
      if(!isJoin && !value){
        return false;
      }
      //空节点占位
      var html, nullnode = document.createTextNode("");
      if(isArray(node)){
        dom.before(nullnode, node[0]);
        var fragment = document.createDocumentFragment();
        forEach(node, function(_node){
          fragment.appendChild(_node);
        });
        node = fragment;
      }else{
        node.removeAttribute('ne-repeat');
      }
      
      if(isScript) {
        var fn = template.parse(node.innerHTML.trim());
        html = function(){
          var result = '';
          try{result = fn.apply(this, arguments)}catch(e){console.error(e)};
          return result;
        }
      }else if(isJoin){ //deprecated: 非script标签中使用了ne-foreach
        throw("ne-foreach should be used in script.");
      }else{
        dom.before(nullnode, node);
        var div = document.createElement("div");
        div.appendChild(node);
        html = div.innerHTML.replace(/&amp;/g, '&');
        dom.remove(node);
      }
      if(!nullnode.parentNode){
        dom.replace(nullnode, node);
      }
      
      var viewItem = {
        node: [nullnode],
        attr: html,
        scope: scope,
        isJoin: isJoin,
        type: 'repeat',
        destroys: destroys
      };
      if(isScript){
        var cond = node.getAttribute("ne-if");
        if(isString(cond)){
          viewItem.cond = cond.replace(/^\s*{{(.*?)}}\s*$/, "$1");
        }
      }
      if(/^\s*(\S+)\s+in\s+(.*)/.test(value)){
        extend(viewItem, {
          key: RegExp.$1,
          model: RegExp.$2
        });
      }else{
        viewItem.model = value;
      }

      var viewDestroy = widget.views.add(viewItem);
      destroys.push(viewDestroy);
      node['ne-selfcide'] = function(){
        viewDestroy();
        forEach(viewItem.node, function(nodeList){
          forEach(nodeList, dom.remove);
        });
      };
      if(!destroys.subnode){
        destroys.subnode = [];
      }
      return nullnode;
    },
    "ne-repeat-start": function(scope, node, value, destroys){
      var widget = this;
      var match = false, nodes = [node];
      node.removeAttribute('ne-repeat-start');
      while((node = node.nextSibling)){
        nodes.push(node);
        if(node.getAttribute && isString(node.getAttribute("ne-repeat-end"))){
          node.removeAttribute('ne-repeat-end');
          match = true;
          break;
        }
      }
      if(match){
        return _directives['ne-repeat'].call(widget, scope, nodes, value, destroys);
      }else{
        return true;
      }
    },
    "ne-fx": function(scope, node, expr, destroys){
      var result,
          animateList = {};
      if(expr){
        var $node = $$(node);
        while ((result = PROPSPLITER.exec(expr)) !== null) {
          var val = result[2].trim(), animator;
          if(/^(\d+)(\S*)/.test(val)){
            animator = new Animator(node);
            animator.duration = parseInt(RegExp.$1);
            if(RegExp.$2) animator.prefix = RegExp.$2;
          }else{
            var tmpArr = val.split('@'), duration = parseInt(tmpArr[1]);
            var animFactory = scope.$parse(tmpArr[0]);
            if(isObject(animFactory)) animFactory = $$.fx(animFactory);
            animator = isFunction(animFactory) && animFactory($node);
            if(isNumber(duration)) animator.duration = duration;
          }
          if(animator){
            animateList[result[1]] = animator;
          }
        }
        forEach(animateList, function(animator, name){
          animCenter.add(name, animator);
        });
        destroys.push(function(){
          forEach(animateList, function(animator, name){
            animCenter.remove(name, animator);
          });
        });
      }
    }
  };