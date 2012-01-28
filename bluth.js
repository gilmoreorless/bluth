;(function (global, undefined) {
    var allowedMethods = {'get':1, 'post':1, 'put':1, 'delete':1}
    var bluthMethods = {}
    bluthMethods.get = function (params, callback) {
        if (callback == null) {
            if (typeof params == 'function') {
                callback = params;
                params = null;
            }
        }
        // TODO: Call transport
        if (callback) {
            callback(params);
        }
    }
    function methodFactory(method) {
        return function (data, params, callback) {
            callback(data, params);
        }
    }
    bluthMethods.post = methodFactory('post');
    bluthMethods.put = methodFactory('put');
    bluthMethods['delete'] = methodFactory('delete');
    
    function bluthClient(serverUrl, transport) {
        this._serverUrl = serverUrl;
        this._transport = transport || bluth.defaultTransport;
    }
    
    bluthClient.prototype.addPath = function (name, path, methods) {
        this[name] = new bluthPath(path, methods);
    }
    
    function bluthPath(path, methods) {
        methods || (methods = ['get']);
        this._path = path;
        var self = this;
        methods.forEach(function (method) {
            method = method.toLowerCase();
            if (allowedMethods.hasOwnProperty(method)) {
                self[method] = bluthMethods[method];
            }
        })
    }
    
    var bluth = global.bluth = function (serverUrl, transport) {
        return new bluthClient(serverUrl, transport);
    }
    
    bluth.transports = {};
    bluth.defaultTransport = '';
    bluth.addTransport = function (name, definition) {
        bluth.transports[name] = definition;
        bluth.defaultTransport || (bluth.defaultTransport = name);
    }
    
})(this);

(function (global, bluth, undefined) {
    bluth.addTransport('jquery', {
        // What goes here?
    });
})(this, this.bluth);
