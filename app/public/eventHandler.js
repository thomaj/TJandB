// Courtesy of T4I and Alex
var eventHandler = function () {
    var me = this;
    var handlers = [];

    me.fire = function (v1, v2, v3, v4, v5, v6, v7, v8) {
        var keys = Object.keys(handlers);
        _.each(keys, function (key) {
            var handler = handlers[key];
            if (handler && _.isFunction(handler)) {
                try {
                    handler(v1, v2, v3, v4, v5, v6, v7, v8);
                } catch (ex) {
                    console.log(ex);
                }
            }
        });
    };

    me.watch = function (watcher, handler) {
        if (_.isFunction(handler)) {
            handlers[watcher] = handler;
        }
    };

    me.ignore = function (watcher) {
        delete handlers[watcher];
    };
};