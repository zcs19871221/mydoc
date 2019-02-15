# 阅读顺序:

>顺着api读，先读dom,然后function，然后promise,ajax
widget,scope，directive。

# 1.知识点
## 关于dom中的css
### style相关
1. dom.style返回一个`CSSStyleDeclaration`对象，该对象只对应内联样式，包括属性：
    `dom.stye.cssText` 内联文本
    `dom.style.length` 内联属性长度

2. 通过内联文本快速修改内联属性   
    增加：
    `var addCssText = "backgroundColor:red;width:30px";`
    `dom.style.cssText = dom.style.cssText + addCssText;`   
    清空：
        `dom.style.cssText = '';`

3. 判断元素是否存在属性:可以通过style对象判断该元素是否拥有某个属性      

        let el = document.createElement("div");
        if (el.width !== undefined) {
            console.log("说明有这个属性!");
        }    
    如上，如果dom.style.property为undefiend, 表明内敛样式里没有设置这个属性，但是height这个属性是存在的，可以用来判断属性是否存在。

4. 获得计算出来的样式：为了获得真正的属性，需要通过:`window.getComputedStyle(node)[属性名称]`或者`node.currentStyle[属性]`获得。 

5. css属性和dom属性的转换：css中是`background-color`，dom中一律使用驼峰的方式：`backgroundColor`。

### 元素宽和高的获得：

1. 获得window的    
    通过htmlElement的`offsetHeight`和`offsetWidth`属性获得:  
    `window.document.documentElement.offsetHeight`。
    (window的document属性，然后document属性的第一个子元素属性获得html元素)

2. 获得IE元素的宽，高：
    node.offsetWidth（防止怪异模式下IE盒模型width和height不但包含内容，还包含border和padding的距离)

3. 一般元素，通过css属性的width和height  
    `window.getComputedStyle(node).width`

4. scroll相关的宽和高的获得  
    通过htmlELement接口的scrollTop等属性获得。

5. clientWidth,offsetWidth,scrollWidth区别
    ![](http://i.stack.imgur.com/5AAyW.png)
    http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively

## element.querySelector的问题  
  Selectors API选择器的查找范围仍旧是document，只不过在查找完毕之后会判断元素是否位于element的子树中。elem.querySelector(All)(str)相当于document.querySelector(All)(str)和elem子树的交集。
这样就会有层级的问题出现：   

        <button>
          <div id="main">
            <div>test1</div>
            <button>
                <div>test2</div>
            </button>
          </div>
        </button>
        var main = document.getElementById('main');
        main.querySelectorAll("button div");
这时候筛选出的是`<div>test1</div>`,而不是需要的`<div>test2</div>`
    解决的方法是：   
cssQuery:176
暂时替换element的id属性，然后修改选择器变为:#id 原选择器,这样筛选的话，就是直接找到element节点，然后在里面筛选，筛选完成后再把element的id替换回来。

## target与currentTarget
target属性是事件触发时候的触发对象       
currentTarget是事件绑定对象。   
target在事件流的目标阶段；currentTarget在事件流的捕获，目标及冒泡阶段。只有当事件流处在目标阶段的时候，两个的指向才是一样的， 而当处于捕获和冒泡阶段的时候，target指向被单击的对象而currentTarget指向当前事件活动的对象（一般为父级）。


# 2.代码部分
## show和hide函数,确定有bug
>重写如下，核心是在dom对象上设置一个变量保存之前的属性。

hide：   

    var display = window.getComputedStyle(dom).display;
    if (display === "none") {
        return '';
    } else {
        dom.olddisplay = display;
        dom.style.display = "none";
    }

show:   

    var display = window.getComputedStyle(dom).display;
    if (display === "none") {
        dom.style.display = dom.olddisplay || "block";
    } else {
        return '';
    }

## 事件架构设计：
1. bind
    给每个绑定元素有一个_b$id属性，是一个唯一值id，
    `node._b$id = integer;`     
    有一个全局的变量，保存所有nodeid和对应的事件以及响应函数如下   

            _bindEvents = {
                nodeId: {
                    eventname: [fn, fn, fn],
                    eventname2: [fn, fn, fn],
                }
                nodeId2: {
                    eventname: [fn, fn, fn],
                    eventname2: [fn, fn, fn],
                }
            }
每个事件响应函数增加一个属性，属性名是`"_b$event" + nodeId`,值是这个响应函数处理后的值(为了让ie的绑定函数this指向node)
fn._b$event[nodeid] = 处理后的handler。

    这么做的目的就是，当这个node不删除的时候，通过判断_bindEvents就知道绑定情。   

2. delegate 

        _delgEvents = {
            nodeId:{
                eventname: {
                    query: [fnHandler, fnHandler1, fnHandler2],
                    query2: [fnHandler, fnHandler1, fnHandler2]
                    ......
                },
                eventname2: {
                    query: [fnHandler, fnHandler1, fnHandler2]
                    .......
                }
                .....
            }
            nodeId2:{
                eventname: {
                    query: [fnHandler, fnHandler1, fnHandler2]
                },
                eventname2: {
                    query: [fnHandler, fnHandler1, fnHandler2]
                }
                .....
            }
            .........
        }

        domMap = {
            query: queryDom

        }
        node.deletegate(type, query, fn);   

    在node元素中给query查询的子节点的type事件类型绑定fn处理函数。
缓存结构如上：_delgEvents

3. bowlder的on, once, emit, off  
 
        once的实现通过给对应事件的回调函数增加属性:
            cb.once = true;
        然后emit的时候，直接取出函数执行，如果fn.once === true，直接splice从数组中删除这个回调函数

    我得到的一个思路就是：
        在Js中除了基本类型外，其他都是对象，所以fn,array都可以添加自己的属性，
    可以**根据需要灵活的添加属性**。

# 未筛选
## 当前页码 1833

## 整体架构
1. bowlder是一个构造函数，通过传入选择器，调用BDom构造函数创建新的包装dom对象。
2. 定义bowlder的自己的公用方法
3. 定义bowlder自己的对象：
    1. bowlder.dom   237
    2. bowlder.cookie
    3. bowlder.event
    4. bowlder.param
    5. bowlder.extend
    6. bowlder.on、once、off、emit 1055
    7. bowlder.once 
    8. bowlder.$q(promise) 1118
    9. bowlder.ajax 1302
    10. bowlder.ready 1801
4. 构造函数BDom 1552
5. 定义 $$.fn = BDom.prototype 1562
6. 注意所有拓展Bdom方法都是通过each来实现BDom数组中所有元素都迭代执行
6. 拓展dom对象的特殊事件方法：$on,$off,$emit,来源是使用widget和scope中的方法 1748
7. 拓展dom对象的属性方法，(还包含delegate, bind)通过引用bowlder.dom中的方法 1762
8. dom对象的submit, blur, focus 1769
9. 获得dom对象的width, height, scrollLeft, scrollTop属性 1774
10. dom对象的节点操作方法：before, after, insert-befor, insert-after
11. 拓展dom对象的on和off方法：通过dom的delegate, undelegate
12. 在DOMContentLoaded和load事件上绑定domReadyNow方法。 1823

## watch的实现
    watch(expr, fn, scope, instant)
expr是监控的表达式，fn是表达式改变后触发的函数，scope是表达式的上下文，instant是否立刻触发检查表达式的值和实际值的比较。
内部this.$$watches.push(item : {
    expr,
    fn,
    if (scope) scope (**有风险，如果没设置scope值的话，就不会保存scope，如果下次调用refresh的不是这个scope不就错了吗**)
})
保存一个监控列表。
当触发refersh时候，遍历这个列表
watchRefresh.call(item.scope || this, item, item.expr);
### watchRefresh
  通过value = this.$parse(expr)获得当前表达式的值：
  通过_value = fns.cache获得原表达式的值(这里的cache实际上就是把value缓存进去，**第一次因为没有缓存所以得不到变化之前的值**)
  调用回调函数
### parse
把表达式中{{}}中的内容取出，调用withFunc(expr)

### withFunc
先判断函数缓存fnCache中有没有fnCache[expr]，如果没有，调用genFunc(safeExpr(expr))，并缓存到fnCache[expr] = genFunc(safeExpr(expr));
    genFunc: return new Function('obj', 'with(obj)return ' + expr);
    genFunc(expr)(obj);
通过new Function(str)实际上把参数expr写入到函数体中，这样就免除了eval(expr)

### safeExpr(expr)
    通过正则的正向肯定查找?=把有问题的表达式替换掉

## scope.$refresh的实现
### 通过判断标识$refreshing是否等于1来判断是不是正在执行.
    如果是那么scope.$widget.$refresh2 = true. 返回
    否则将refreshing设置为1.
### 如果refresh有delay参数，那么延迟delay执行refresh
### 如果scope有$$watches，说明曾经用watch监控表达式，那么对每个监控表达式计算结果，如果保存的值和现在值不一样，触发watch的回调函数。
### 如果scope的widget有models或者views，执行这两个的refresh
### 遍历widget的children 如果children 是isready状态，childer执行refresh
      if (widget.$refresh2) {
        widget.$refreshed = true;
        widget.$refresh2 = false;
        scope.$refresh();
        widget.isReady && widget.updateRoles();
      } else if (widget.$refreshed) {
        widget.$refreshed = false;
        widget.emit('refreshed');
      }

## Widget
### rootWidget的创建
属性      

    this._readyDefer = $q.defer();
    this._preparedDefer = $q.defer();
    this._readyDefer.promise.then(function(widget) {
      widget.isReady = true;
    });
在widget创建之后执行
  rootWidget._preparedDefer.resolve(rootWidget);
  如果在widget创建之前_preparedDefer.then(fn)，那么正好上一条语句触发fn执行。
  如果在widget创建之后执行_preparedDefer.then(fn),那么立刻执行fn。（好像意义不大）

      rootWidget._readyDefer.resolve(rootWidget); 
      触发_readyDefer.then(function() {
        widget.ready = true;
      })
  也就是在widget执行后，立刻触发resolve，执行之前then进去的方法，设置ready=true;

    widget.children = [];
    **widget.scope = $$.rootScope;**
    **widget.scope.$widget = widget;**
    **widget.views = new Views(widget);**
    **widget.models = new Models(widget);**
    widget.update = $$.rootScope.$update = widget.models.update.bind(widget.models);
    widget.__roles = {};
    widget.roles = {};
    widget.constructor = Widget;

## views
    this.widget = widget;
    this.scope = widget.scope;
    this.items = [];

## models
    this.widget = widget;
    this.items = [];
    this.cursor = 0;

## 通过body或者最后一个script标签中的ne-alias属性，获取这个文件的内容（别名配置）
      var aliasPromise = $$.run(aliasConf).then(function(conf) {
        conf && extend(true, pathAlias, conf);
      });
      if (aliasConf) rootWidget.compile = function() {
        aliasPromise.then(compile);
      };

### 调用$$.run(文件地址)
1. 把地址换成绝对地址
2. 调用    
  
        amdLoader.get(name).then(function(def) {
          if (!def || !def.fn) {
            return def;
          } else if (isFunction(def.fn)) {
            var mod = observableObj(),
              fnResult = def.fn.apply(mod, def.depInject);
            return (fnResult && typeof fnResult == 'object') ? fnResult : mod;
          } else {
            return def.fn;
          }
        });
### amdLoader.get

        var loader = amdLoader.makeDefer(name);
        return loader.promise;
### amdLoader.makeDefer
    调用    

    ajax.require(name, {
            charset: charset
          }).success(function() {
            amdLoader.postDefine(name, null, notDefine); //构造函数加载完成，处理依赖
          });
    请求js文件

## ajax模块
    ajax  
    闭包持久化参数和方法
    全局方法extend把用户config和默认的配置深复制到新的本地config
    给用户开放success和error接口(让用户传fn给then(reolsve, reject))
    ->serverRequest
      ->buildUrl处理url（把object合并到url参数里，如果有的话）
      ->transformdata处理数据(根据传入方法决定处理请求还是返回数据)
        ->transformResponse(判断请求体执行JSON.stringify)
      删除不用的header(无请求体数据去除content-type头)
    sendReq->
      暂时push配置对象到ajax.pendingRequests
      配置中止的触发器(用于超时时候调用)
      配置超时触发器
      配置请求成功和失败的回调removePendingReq        
      ->ajaxBackend
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
