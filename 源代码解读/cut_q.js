var $$ = {};
var $q = $$.$q = (function(){ //promise
    var defer = function() {
      var pending = [], value;
      var deferred = {
        resolve: function(val, force) {
          if(pending){
            var callbacks = pending;
            pending = undefined;
            value = ref(val);
            forEach(callbacks, function(callback){
              value.then(callback[0], callback[1], callback[2]);
            });
          }else if(force) value = ref(val);
        },
        reject: function(reason) {
          deferred.resolve(reject(reason));
        },
        notify: function(progress) {
          if(pending) forEach(pending, function(callback){
            callback[2](progress);
          });
        },
        promise: {
          then: function(callback, errback, progressback) {
            var result = defer();
            var wrappedCallback = function(value) {
              try {
                result.resolve((isFunction(callback) ? callback : defaultCallback)(value));
              } catch(e) {
                result.reject(e);
                consoleError(e);
              }
            };
            var wrappedErrback = function(reason) {
              try {
                result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
              } catch(e) {
                result.reject(e);
                consoleError(e);
              }
            };
            var wrappedProgressback = function(progress) {
              try {
                result.notify((isFunction(progressback) ? progressback : defaultCallback)(progress));
              } catch(e) {
                consoleError(e);
              }
            };

            if(pending){
              pending.push([wrappedCallback, wrappedErrback, wrappedProgressback]);
            }else{
              value.then(wrappedCallback, wrappedErrback, wrappedProgressback);
            }

            return result.promise;
          },
          "catch": function(callback) {
            return this.then(null, callback);
          },
          "finally": function(callback) {
            function makePromise(value, resolved) {
              return new Promise(function(resolve, reject){
                if(resolved){
                  resolve(value);
                }else{
                  reject(value);
                }
              });
            }

            function handleCallback(value, isResolved) {
              var callbackOutput = null;
              try {
                callbackOutput = (callback || defaultCallback)();
              } catch(e) {
                return makePromise(e, false);
              }
              if (callbackOutput && isFunction(callbackOutput.then)) {
                return callbackOutput.then(function() {
                  return makePromise(value, isResolved);
                }, function(error) {
                  return makePromise(error, false);
                });
              } else {
                return makePromise(value, isResolved);
              }
            }

            return this.then(function(value) {
              return handleCallback(value, true);
            }, function(error) {
              return handleCallback(error, false);
            });
          }
        }
      };
      return deferred;
    };
    var reject = function(reason) {
      return {
        then: function(callback, errback) {
          var result = defer();
          try {
            result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
          } catch(e) {
            result.reject(e);
          }
          return result.promise;
        }
      };
    };
    var all = function(promises) {
      var deferred = defer(),
          counter = 0,
          results = isArray(promises) ? [] : {};

      forEach(promises, function(){counter++});
      forEach(promises, function(promise, key){
        ref(promise).then(function(value) {
          if (results.hasOwnProperty(key)) return;
          results[key] = value;
          if (!(--counter)) deferred.resolve(results);
        }, function(reason) {
          if (results.hasOwnProperty(key)) return;
          deferred.reject(reason);
        });
      });

      if (counter === 0) deferred.resolve(results);
      return deferred.promise;
    };
    var race = function(promises) {
      var deferred = defer(), counter = 0;
      forEach(promises, function(){counter++});
      forEach(promises, function(promise){
        ref(promise).then(function(value) {
          deferred.resolve(value);
        }, function(reason) {
          counter--;
          if (counter === 0) deferred.reject(reason);
        });
      });
      if (counter === 0) deferred.resolve();
      return deferred.promise;
    };

    function ref(value) {
      if(value && isFunction(value.then)) return value;
      return {
        then: function(callback) {
          var result = defer();
          result.resolve(callback(value));
          return result.promise;
        }
      };
    }
    function defaultCallback(value) { return value; }
    function defaultErrback(reason) { return reject(reason); }

    return {
      defer: defer,
      reject: reject,
      all: all,
      race: race,
      ref: ref
    };
  })();
var Promise = $$.Promise = function(fn){
  var deferred = $q.defer();
  if(isFunction(fn)){
    fn(deferred.resolve, deferred.reject);
  }
  return deferred.promise;
};
Promise.all = $q.all;
Promise.race = $q.race;
Promise.reject = $q.reject;
Promise.resolve = function(val){
  var deferred = $q.defer();
  deferred.resolve(val);
  return deferred.promise;
}

