;(function (global, undefined) {
    var allowedMethods = {'get':1, 'post':1, 'put':1, 'delete':1}
    var bluthMethods = {}
    bluthMethods.get = function (params, callback) {
        if (arguments.length < 2 && typeof params == 'function') {
            callback = params;
            params = null;
        }
        // TODO: This needs to support custom transports
        var transport = bluth.transports[bluth.defaultTransport],
            url = this.getUrl();
        return transport.send(url, 'get', null, params, callback);
//        if (callback) {
//            callback(params);
//        }
    }
    function methodFactory(method) {
        return function (data, params, callback) {
            if (arguments.length < 2 && typeof data == 'function') {
                callback = data;
                data = null;
            } else if (arguments.length < 3 && typeof params == 'function') {
                callback = params;
                params = null;
            }
            var transport = bluth.transports[bluth.defaultTransport],
                url = this.getUrl();
            return transport.send(url, method, data, params, callback);
//            callback(data, params);
        }
    }
    bluthMethods.post = methodFactory('post');
    bluthMethods.put = methodFactory('put');
    bluthMethods.del = methodFactory('delete');
    
    function BluthClient(serverUrl, transport) {
        this._serverUrl = serverUrl;
        this._transport = transport || bluth.defaultTransport;
    }
    
    BluthClient.prototype.addPath = function (name, path, methods) {
        if (!name) {
            throw TypeError('A name is required');
        }
        this[name] = new BluthPath(this, path, methods);
    }
    
    function BluthPath(client, path, methods) {
        methods || (methods = ['get']);
        this._client = client;
        this._path = path || '';
        this._methods = methods;
        var self = this;
        methods.forEach(function (method) {
            method = method.toLowerCase();
            if (allowedMethods.hasOwnProperty(method)) {
                self[method] = bluthMethods[method];
            }
        })
    }
    
    BluthPath.prototype.getUrl = function () {
        return this._client._serverUrl + this._path;
    }
    
    var bluth = global.bluth = function (serverUrl, transport) {
        return new BluthClient(serverUrl, transport);
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
        send: function (url, method, data, params, callback) {
            // params?
            var xhr = jQuery.ajax({
                type: method,
                data: data
            }).success(callback)
        }
    });
})(this, this.bluth);
