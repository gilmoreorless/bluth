var url = 'http://example.com';

module('client constructor');

test('with new keyword', 2, function () {
    var client = new bluth(url);
    equal(client._serverUrl, url, 'Has correct URL');
    equal(client._transport, bluth.defaultTransport, 'Has default transport');
});
test('without new keyword', 2, function () {
    var client = bluth(url);
    equal(client._serverUrl, url, 'Has correct URL');
    equal(client._transport, bluth.defaultTransport, 'Has default transport');
});
test('define a transport', 1, function () {
    var client = bluth(url, 'qunit');
    equal(client._transport, 'qunit', 'Saves custom transport');
});


module('addTransport');

test('set default', 2, function () {
    bluth.defaultTransport = '';
    bluth.addTransport('qunit', {});
    ok('qunit' in bluth.transports, 'Transport in list');
    equal(bluth.defaultTransport, 'qunit', 'First transport set to default');
});


module('path constructor', {
    setup: function () {
        this.client = bluth(url);
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
    equal(this.client.url.getUrl(), url + urlPath);
});

test('invalid verb', 4, function () {
    this.client.addPath('invalid', '/path', ['get', 'tobias']);
    ok(this.client.invalid.get, 'GET method is defined');
    ok(!this.client.invalid.tobias, 'Tobias method is not defined');
    
    this.client.addPath('invalid2', '/path', ['tobias']);
    ok(!this.client.invalid2.get, 'GET method is not defined');
    ok(!this.client.invalid2.tobias, 'Tobias method is not defined');
});


module('GET', {
    setup: function () {
        this.client = bluth(url);
    }
});
