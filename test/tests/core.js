(function () {

var baseUrl = 'http://example.com',
    defaultTransport = Bluth.defaultTransport;



module('client constructor');

test('with new keyword', 2, function () {
    var client = new Bluth(baseUrl);
    equal(client._serverUrl, baseUrl, 'Has correct URL');
    equal(client._transport, Bluth.defaultTransport, 'Has default transport');
});

test('without new keyword', 2, function () {
    var client = Bluth(baseUrl);
    equal(client._serverUrl, baseUrl, 'Has correct URL');
    equal(client._transport, Bluth.defaultTransport, 'Has default transport');
});

test('define a transport', 1, function () {
    var client = Bluth(baseUrl, 'qunit');
    equal(client._transport, 'qunit', 'Saves custom transport');
});



module('addTransport / getTransport', {
    teardown: function () {
        Bluth.defaultTransport = defaultTransport;
    }
});

test('set default', 2, function () {
    Bluth.defaultTransport = '';
    Bluth.addTransport('qunit', {});
    ok('qunit' in Bluth.transports, 'Transport in list');
    equal(Bluth.defaultTransport, 'qunit', 'First transport set to default');

    // Cleanup
    delete Bluth.transports.qunit;
});

test('another transport', 4, function () {
    var transport = {send: function(){}}
    Bluth.addTransport('qunit2', transport);
    ok('qunit2' in Bluth.transports, 'Transport in list');
    notEqual(Bluth.defaultTransport, 'qunit2', 'Subsequent transport not set to default');

    var client1 = Bluth(baseUrl);
    client1.addPath('path');
    notEqual(client1.path.getTransport(), transport, 'path1.getTransport() returns default transport');
    var client2 = Bluth(baseUrl, 'qunit2');
    client2.addPath('path');
    strictEqual(client2.path.getTransport(), transport, 'path2.getTransport() returns custom transport');

    // Cleanup
    delete Bluth.transports.qunit2;
});



module('path constructor', {
    setup: function () {
        this.client = Bluth(baseUrl);
    }
});

test('missing arguments', 4, function () {
    var client = this.client;
    raises(function () {
        // Error types: Eval, Range, Reference, Syntax, Type, URI
        client.addPath();
    }, TypeError, 'No arguments raises a TypeError');
    
    client.addPath('path');
    ok(client.path, 'Defined path exists at top level of client');
    strictEqual(client.path._path, '', 'No path defaults to empty string');
    deepEqual(client.path._methods, ['get'], 'No methods defaults to GET');
});

test('getUrl', 1, function () {
    var urlPath = '/path/to/resource';
    this.client.addPath('url', urlPath);
    equal(this.client.url.getUrl(), baseUrl + urlPath, 'getUrl() on a path returns full URL');
});

test('verb (string)', 9, function () {
    this.client.addPath('valid', '/path', 'GET');
    ok(this.client.valid.get, 'GET method is defined');

    this.client.addPath('valid2', '/path', 'POST');
    ok(!this.client.valid2.get, 'GET method is not defined');
    ok(this.client.valid2.post, 'POST method is defined');

    this.client.addPath('valid3', '/path', 'PUT');
    ok(!this.client.valid3.get, 'GET method is not defined');
    ok(this.client.valid3.put, 'PUT method is defined');

    this.client.addPath('valid4', '/path', 'DELETE');
    ok(!this.client.valid4.get, 'GET method is not defined');
    ok(this.client.valid4.del, 'DELETE method is defined');

    this.client.addPath('invalid', '/path', 'michael');
    ok(!this.client.invalid.get, 'GET method is not defined for invalid verb');
    ok(!this.client.invalid.michael, 'Michael method is not defined for invalid verb');
});

test('verb (array)', 4, function () {
    this.client.addPath('invalid', '/path', ['get', 'tobias']);
    ok(this.client.invalid.get, 'GET method is defined');
    ok(!this.client.invalid.tobias, 'Tobias method is not defined');
    
    this.client.addPath('invalid2', '/path', ['tobias']);
    ok(!this.client.invalid2.get, 'GET method is not defined');
    ok(!this.client.invalid2.tobias, 'Tobias method is not defined');
});



module('GET', {
    setup: function () {
        Bluth.defaultTransport = 'gettest';

        this.client = Bluth(baseUrl);
        this.client.addPath('unit', '/unit', 'GET');
        this.testUrl = baseUrl + '/unit';
    },
    teardown: function () {
        Bluth.defaultTransport = defaultTransport;
        delete Bluth.transports.gettest;
    }
});

test('invalid transport', 1, function () {
    Bluth.addTransport('invalid', {});
    Bluth.defaultTransport = 'invalid';

    var client = this.client;
    raises(function () {
        client.unit.get();
    }, TypeError, 'Invalid transport raises a TypeError');

    // Cleanup
    delete Bluth.transports.invalid;
});

test('no args', 6, function () {
    var test = this;
    Bluth.addTransport('gettest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'GET', 'GET method is sent to transport');
            strictEqual(data, null, 'No data is sent for GET');
            strictEqual(params, undefined, 'Params are undefined');
            strictEqual(callback, undefined, 'Callback is undefined');
            return 'noparams';
        }
    });
    
    equal(this.client.unit.get(), 'noparams', 'Return value of transport is passed along');
});

test('string params', 6, function () {
    var test = this;
    Bluth.addTransport('gettest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'GET', 'GET method is sent to transport');
            strictEqual(data, null, 'No data is sent for GET');
            equal(params, 'type=string', 'Params are send to transport');
            strictEqual(callback, undefined, 'Callback is undefined');
            return 'stringparams';
        }
    });
    
    equal(this.client.unit.get('type=string'), 'stringparams', 'Return value of transport is passed along');
});

test('object params', 6, function () {
    var test = this,
        testParams = {type: 'object'};
    Bluth.addTransport('gettest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'GET', 'GET method is sent to transport');
            strictEqual(data, null, 'No data is sent for GET');
            strictEqual(params, testParams, 'Params are send to transport unchanged');
            strictEqual(callback, undefined, 'Callback is undefined');
            return 'objectparams';
        }
    });
    
    equal(this.client.unit.get(testParams), 'objectparams', 'Return value of transport is passed along');
});

test('callback, no params', 7, function () {
    var test = this,
        testFunc = function () {
            ok(true, 'Callback is called');
        };
    Bluth.addTransport('gettest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'GET', 'GET method is sent to transport');
            strictEqual(data, null, 'No data is sent for GET');
            strictEqual(params, undefined, 'Params are undefined');
            strictEqual(callback, testFunc, 'Callback is passed through');
            callback();
            return 'callbacknoparams';
        }
    });
    
    equal(this.client.unit.get(testFunc), 'callbacknoparams', 'Return value of transport is passed along');
});

test('callback, with params', 7, function () {
    var test = this,
        testParams = {type: 'object'},
        testFunc = function () {
            ok(true, 'Callback is called');
        };
    Bluth.addTransport('gettest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'GET', 'GET method is sent to transport');
            strictEqual(data, null, 'No data is sent for GET');
            strictEqual(params, testParams, 'Params are sent to transport unchanged');
            strictEqual(callback, testFunc, 'Callback is passed through');
            callback();
            return 'callbackwithparams';
        }
    });
    
    equal(this.client.unit.get(testParams, testFunc), 'callbackwithparams', 'Return value of transport is passed along');
});



module('POST', {
    setup: function () {
        Bluth.defaultTransport = 'posttest';

        this.client = Bluth(baseUrl);
        this.client.addPath('unit', '/unit', 'POST');
        this.testUrl = baseUrl + '/unit';
    },
    teardown: function () {
        Bluth.defaultTransport = defaultTransport;
        delete Bluth.transports.posttest;
    }
});

test('invalid transport', 1, function () {
    Bluth.addTransport('invalid', {});
    Bluth.defaultTransport = 'invalid';

    var client = this.client;
    raises(function () {
        client.unit.post();
    }, TypeError, 'Invalid transport raises a TypeError');

    // Cleanup
    delete Bluth.transports.invalid;
});

test('no args', 6, function () {
    var test = this;
    Bluth.addTransport('posttest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'POST', 'POST method is sent to transport');
            strictEqual(data, undefined, 'Data are undefined');
            strictEqual(params, undefined, 'Params are undefined');
            strictEqual(callback, undefined, 'Callback is undefined');
            return 'noparams';
        }
    });
    
    equal(this.client.unit.post(), 'noparams', 'Return value of transport is passed along');
});

test('data only', 6, function () {
    var test = this,
        testData = {name: 'George Michael'};
    Bluth.addTransport('posttest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'POST', 'POST method is sent to transport');
            strictEqual(data, testData, 'Data is passed through');
            strictEqual(params, undefined, 'Params are undefined');
            strictEqual(callback, undefined, 'Callback is undefined');
            return 'dataonly';
        }
    });
    
    equal(this.client.unit.post(testData), 'dataonly', 'Return value of transport is passed along');
});

test('callback, no params, no data', 7, function () {
    var test = this,
        testFunc = function () {
            ok(true, 'Callback is called');
        };
    Bluth.addTransport('posttest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'POST', 'POST method is sent to transport');
            strictEqual(data, null, 'No data is sent for POST');
            strictEqual(params, undefined, 'Params are undefined');
            strictEqual(callback, testFunc, 'Callback is passed through');
            callback();
            return 'callbackonly';
        }
    });
    
    equal(this.client.unit.post(testFunc), 'callbackonly', 'Return value of transport is passed along');
});

test('data + callback, no params', 7, function () {
    var test = this,
        testData = {name: 'George'},
        testFunc = function () {
            ok(true, 'Callback is called');
        };
    Bluth.addTransport('posttest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'POST', 'POST method is sent to transport');
            strictEqual(data, testData, 'Data is passed through');
            strictEqual(params, undefined, 'Params are undefined');
            strictEqual(callback, testFunc, 'Callback is passed through');
            callback();
            return 'data+callback';
        }
    });
    
    equal(this.client.unit.post(testData, testFunc), 'data+callback', 'Return value of transport is passed along');
});

test('data + params + callback', 7, function () {
    var test = this,
        testData = {name: 'George'},
        testParams = 'paramsString',
        testFunc = function () {
            ok(true, 'Callback is called');
        };
    Bluth.addTransport('posttest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'POST', 'POST method is sent to transport');
            strictEqual(data, testData, 'Data is passed through');
            strictEqual(params, testParams, 'Params are passed through');
            strictEqual(callback, testFunc, 'Callback is passed through');
            callback();
            return 'data+params+callback';
        }
    });
    
    equal(this.client.unit.post(testData, testParams, testFunc), 'data+params+callback', 'Return value of transport is passed along');
});



module('PUT', {
    setup: function () {
        Bluth.defaultTransport = 'puttest';

        this.client = Bluth(baseUrl);
        this.client.addPath('unit', '/unit', 'PUT');
        this.testUrl = baseUrl + '/unit';
    },
    teardown: function () {
        Bluth.defaultTransport = defaultTransport;
        delete Bluth.transports.puttest;
    }
});

/* Only basic sanity check for PUT - everything else is the same as POST */
test('data + params + callback', 7, function () {
    var test = this,
        testData = {name: 'Gob'},
        testParams = 'paramsString',
        testFunc = function () {
            ok(true, 'Callback is called');
        };
    Bluth.addTransport('puttest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'PUT', 'PUT method is sent to transport');
            strictEqual(data, testData, 'Data is passed through');
            strictEqual(params, testParams, 'Params are passed through');
            strictEqual(callback, testFunc, 'Callback is passed through');
            callback();
            return 'PUTdata+params+callback';
        }
    });
    
    equal(this.client.unit.put(testData, testParams, testFunc), 'PUTdata+params+callback', 'Return value of transport is passed along');
});



module('DELETE', {
    setup: function () {
        Bluth.defaultTransport = 'deletetest';

        this.client = Bluth(baseUrl);
        this.client.addPath('unit', '/unit', 'DELETE');
        this.testUrl = baseUrl + '/unit';
    },
    teardown: function () {
        Bluth.defaultTransport = defaultTransport;
        delete Bluth.transports.deletetest;
    }
});

/* Only basic sanity check for DELETE - everything else is the same as POST */
test('data + params + callback', 7, function () {
    var test = this,
        testData = {name: 'Buster'},
        testParams = 'paramsString',
        testFunc = function () {
            ok(true, 'Callback is called');
        };
    Bluth.addTransport('deletetest', {
        send: function (url, method, data, params, callback) {
            equal(url, test.testUrl, 'Correct URL is sent to transport');
            equal(method, 'DELETE', 'DELETE method is sent to transport');
            strictEqual(data, testData, 'Data is passed through');
            strictEqual(params, testParams, 'Params are passed through');
            strictEqual(callback, testFunc, 'Callback is passed through');
            callback();
            return 'DELETEdata+params+callback';
        }
    });
    
    equal(this.client.unit.del(testData, testParams, testFunc), 'DELETEdata+params+callback', 'Return value of transport is passed along');
});

})(); // File-wide closure