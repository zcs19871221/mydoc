function pm() {
    var pending = [];
    return {
        then: function(fn) {
            var p = pm();
            function wrapcb(value) {
                p.resolve(fn(value));
            }
            if (pending) {
                pending.push(wrapcb);
            } else {
                wrapcb(value);
            }
            return p;
        },
        resolve: function(value) {
            value = value;
            var cb = pending[0];
            pending = undefined;
            if (cb) {
                cb(value);                
            }
        }
    }
}
(function(){
    var p = pm();
    setTimeout(function() {
        p.resolve(3);
    }, 1000)
    return p;
}()).then(function(value) {
    console.log(value);
    return value;
}).then(function(value) {
    setTimeout(function() {
        console.log(value + 1000);
    })
})