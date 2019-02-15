//一个方法service
var service = function () {
    return { name: 'Service' };
}

//一个方法router
var router = function () {
    return { name: 'Router' };
}

//这个方法的目的是注入service和router，然后通过传入other后可以到处使用，但是service和router改变，不需要改变dosomething。
var doSomething = function (service, router, other) {
    var s = service();
    var r = router();
};

//这个方法是仿照requireJs的方法，第一个参数是需要注入到实际函数的依赖对象，第二个参数是实际函数，但是问题就是依赖对象要写两边，
// 一边在resolve参数中，一遍在实际函数参数中，而且实际函数中的参数顺序要和resolve中的一致，
var injector_old = {
    dependencies: {},
    register: function (key, value) {
        this.dependencies[key] = value;
    },
    resolve: function(deps, func, scope) {
        var args = [];
        for(var i=0; i<deps.length, d=deps[i]; i++) {
            if(this.dependencies[d]) {
                args.push(this.dependencies[d]);
            } else {
                throw new Error('Can\'t resolve ' + d);
            }
        }
        return function() {
            func.apply(scope || {}, args.concat(Array.prototype.slice.call(arguments, 0)));
        }        
    }
}
// resolve函数只有一个实际执行函数作为参数，输出一个函数用来接收新的注入。
// resolve方法会读取参数函数的参数（通过源代码正则的方式），执行的时候，会依次判断参数是否有依赖，
// 如果有，注入对应依赖作为实际参数，如果没有，依次注入新函数的参数
var injector_new = {
    dependencies: {},
    register: function (key, value) {
        this.dependencies[key] = value;
    },
    resolve: function () {
        var func, deps, scope, args = [], self = this;
        func = arguments[0];
        deps = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',');
        scope = arguments[1] || {};
        return function () {
            var a = Array.prototype.slice.call(arguments, 0);
            for (var i = 0; i < deps.length; i++) {
                var d = deps[i];
                args.push(self.dependencies[d] && d != '' ? self.dependencies[d] : a.shift());
            }
            func.apply(scope || {}, args);
        }
    }
}
injector_old.register("router", router)
injector_old.register("service", service)
injector_new.register("router", router)
injector_new.register("service", service)
var doSomething_old = injector.resolve(['service', 'router'], function(service, router, other) {
    console.log(service().name);
    console.log(router().name);

});
var doSomething_new = injector.resolve(function (service, other, router) {
    console.log(service().name);
    console.log(router().name);
    console.log(other);
});
doSomething_old("service", "other", "Other");
doSomething_new("other");