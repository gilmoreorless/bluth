/*!
 * Bluth.js v0.1.0 - a simple REST client with resource mappings
 * https://github.com/gilmoreorless/bluth
 * Open source under the MIT licence: http://gilmoreorless.mit-license.org/
 */
;(function (global, undefined) {
    var allowedMethods = {'get':1, 'post':1, 'put':1, 'del':1}
    var bluthMethods = {}
    bluthMethods.get = function (params, callback) {
        if (arguments.length < 2 && typeof params == 'function') {
            callback = params;
            params = undefined;
        }
        var transport = this.getTransport(),
            url = this.getUrl();
        return transport.send(url, 'GET', null, params, callback);
    }
    function methodFactory(method) {
        return function (data, params, callback) {
            if (arguments.length < 2 && typeof data == 'function') {
                callback = data;
                data = null;
            } else if (arguments.length < 3 && typeof params == 'function') {
                callback = params;
                params = undefined;
            }
            var transport = Bluth.transports[Bluth.defaultTransport],
                url = this.getUrl();
            return transport.send(url, method.toUpperCase(), data, params, callback);
        }
    }
    bluthMethods.post = methodFactory('post');
    bluthMethods.put = methodFactory('put');
    bluthMethods.del = methodFactory('delete');
    
    function BluthClient(serverUrl, transport) {
        this._serverUrl = serverUrl;
        this._transport = transport || Bluth.defaultTransport;
    }
    
    BluthClient.prototype.addPath = function (name, path, methods) {
        if (!name) {
            throw TypeError('A name is required');
        }
        this[name] = new BluthPath(this, path, methods);
    }
    
    function BluthPath(client, path, methods) {
        methods || (methods = ['get']);
        if (Object.prototype.toString.call(methods) != '[object Array]') {
            methods = [methods];
        }
        this._client = client;
        this._path = path || '';
        this._methods = methods;
        var self = this;
        methods.forEach(function (method) {
            method = method.toLowerCase();
            if (method == 'delete') {
                method = 'del'; // `delete` is a reserved keyword
            }
            if (allowedMethods.hasOwnProperty(method)) {
                self[method] = bluthMethods[method];
            }
        })
    }
    
    BluthPath.prototype.getTransport = function () {
        return Bluth.transports[this._client._transport];
    }
    
    BluthPath.prototype.getUrl = function () {
        return this._client._serverUrl + this._path;
    }
    
    var Bluth = global.Bluth = function (serverUrl, transport) {
        return new BluthClient(serverUrl, transport);
    }
    Bluth.version = '0.1.0';
    
    Bluth.transports = {};
    Bluth.defaultTransport = '';
    Bluth.addTransport = function (name, definition) {
        Bluth.transports[name] = definition;
        Bluth.defaultTransport || (Bluth.defaultTransport = name);
    }
    
})(this);

/** Transport: jQuery **/
(function (global, bluth, undefined) {
    Bluth.addTransport('jquery', {
        send: function (url, method, data, params, callback) {
            if (params) {
                if (typeof params !== 'string') {
                    params = jQuery.param(params);
                }
                url += (/\?/.test(url) ? '&' : '?') + params;
            }
            var xhr = jQuery.ajax({
                url: url,
                type: method,
                data: data
            }).success(callback);
            return xhr;
        }
    });
})(this, this.bluth);
