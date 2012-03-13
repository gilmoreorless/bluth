(function () {

var baseUrl = '',
	basePath = '/transport',
	fullUrl = baseUrl + basePath;
var defaultResponseHeaders = {'Content-Type': 'text/plain'};

module('transports.jquery', {
	setup: function () {
		this.xhr = sinon.useFakeXMLHttpRequest();
		var requests = this.requests = [];
		this.xhr.onCreate = function (xhr) {
			requests.push(xhr);
		}

		this.defaultTransport = bluth.defaultTransport;
		bluth.defaultTransport = 'jquery';
		this.client = bluth(baseUrl);
		this.client.addPath('jquery', basePath, ['get', 'post', 'put', 'delete']);
	},
	teardown: function () {
		this.xhr.restore();
		bluth.defaultTransport = this.defaultTransport;
		delete this.client;
	}
});

test('GET basic', 4, function () {
	var request = this.client.jquery.get();
	ok('complete' in request, 'Initial call returns a jQuery XHR object');
	var xhr = this.requests[0];

	console.log(xhr);

	equal(xhr.method, 'GET', 'XHR method is GET');
	equal(xhr.url, fullUrl, 'XHR has correct URL');
	equal(xhr.requestBody, null, 'XHR GET has no body content');
	xhr.respond();
});

test('GET full (string params)', 4, function () {
	var params = 'location=bananastand';
	var expectedResponse = 'Burn it down';
	var request = this.client.jquery.get(params, function (response) {
		equal(response, expectedResponse, 'Correct response passed to callback');
	});

	var xhr = this.requests[0];
	equal(xhr.method, 'GET', 'XHR method is GET');
	equal(xhr.url, fullUrl + '?' + params, 'XHR has correct URL with params');
	equal(xhr.requestBody, null, 'XHR GET has no body content');
	xhr.respond(200, defaultResponseHeaders, expectedResponse);
});

test('GET full (object params)', 4, function () {
	var paramsStr = 'location=jail';
	var paramsObj = {location: 'jail'};
	var expectedResponse = 'Escape';
	var request = this.client.jquery.get(paramsObj, function (response) {
		console.log(arguments);
		equal(response, expectedResponse, 'Correct response passed to callback');
	});

	var xhr = this.requests[0];
	equal(xhr.method, 'GET', 'XHR method is GET');
	equal(xhr.url, fullUrl + '?' + paramsStr, 'XHR has correct URL with params');
	equal(xhr.requestBody, null, 'XHR GET has no body content');
	xhr.respond(200, defaultResponseHeaders, expectedResponse);
});



test('POST basic', 4, function () {
	var request = this.client.jquery.post();
	ok('complete' in request, 'Initial call returns a jQuery XHR object');

	var xhr = this.requests[0];
	equal(xhr.method, 'POST', 'XHR method is POST');
	equal(xhr.url, fullUrl, 'XHR has correct URL');
	equal(xhr.requestBody, null, 'XHR has no body content');
	xhr.respond();
});

test('POST full (string data/params)', 4, function () {
	var data = 'occupation=Banana Salesman';
	var params = 'location=bananastand';
	var expectedResponse = 'Burn it down';
	var request = this.client.jquery.post(data, params, function (response) {
		equal(response, expectedResponse, 'Correct response passed to callback');
	});

	var xhr = this.requests[0];
	equal(xhr.method, 'POST', 'XHR method is POST');
	equal(xhr.url, fullUrl + '?' + params, 'XHR has correct URL with params');
	equal(xhr.requestBody, data, 'XHR has correct body content');
	xhr.respond(200, defaultResponseHeaders, expectedResponse);
});

test('POST full (object data/params)', 4, function () {
	var dataStr = 'occupation=Fraudster';
	var dataObj = {occupation: 'Fraudster'};
	var paramsStr = 'location=jail';
	var paramsObj = {location: 'jail'};
	var expectedResponse = 'Escape';
	var request = this.client.jquery.post(dataObj, paramsObj, function (response) {
		equal(response, expectedResponse, 'Correct response passed to callback');
	});

	var xhr = this.requests[0];
	equal(xhr.method, 'POST', 'XHR method is POST');
	equal(xhr.url, fullUrl + '?' + paramsStr, 'XHR has correct URL with params');
	equal(xhr.requestBody, dataStr, 'XHR has correct body content');
	xhr.respond(200, defaultResponseHeaders, expectedResponse);
});



test('PUT basic', 4, function () {
	var request = this.client.jquery.put();
	ok('complete' in request, 'Initial call returns a jQuery XHR object');

	var xhr = this.requests[0];
	equal(xhr.method, 'PUT', 'XHR method is PUT');
	equal(xhr.url, fullUrl, 'XHR has correct URL');
	equal(xhr.requestBody, null, 'XHR has no body content');
	xhr.respond();
});

test('PUT full (string data/params)', 4, function () {
	var data = 'occupation=Banana Salesman';
	var params = 'location=bananastand';
	var expectedResponse = 'Burn it down';
	var request = this.client.jquery.put(data, params, function (response) {
		equal(response, expectedResponse, 'Correct response passed to callback');
	});

	var xhr = this.requests[0];
	equal(xhr.method, 'PUT', 'XHR method is PUT');
	equal(xhr.url, fullUrl + '?' + params, 'XHR has correct URL with params');
	equal(xhr.requestBody, data, 'XHR has correct body content');
	xhr.respond(200, defaultResponseHeaders, expectedResponse);
});

test('PUT full (object data/params)', 4, function () {
	var dataStr = 'occupation=Fraudster';
	var dataObj = {occupation: 'Fraudster'};
	var paramsStr = 'location=jail';
	var paramsObj = {location: 'jail'};
	var expectedResponse = 'Escape';
	var request = this.client.jquery.put(dataObj, paramsObj, function (response) {
		equal(response, expectedResponse, 'Correct response passed to callback');
	});

	var xhr = this.requests[0];
	equal(xhr.method, 'PUT', 'XHR method is PUT');
	equal(xhr.url, fullUrl + '?' + paramsStr, 'XHR has correct URL with params');
	equal(xhr.requestBody, dataStr, 'XHR has correct body content');
	xhr.respond(200, defaultResponseHeaders, expectedResponse);
});



test('DELETE basic', 4, function () {
	var request = this.client.jquery.del();
	ok('complete' in request, 'Initial call returns a jQuery XHR object');

	var xhr = this.requests[0];
	equal(xhr.method, 'DELETE', 'XHR method is DELETE');
	equal(xhr.url, fullUrl, 'XHR has correct URL');
	equal(xhr.requestBody, null, 'XHR has no body content');
	xhr.respond();
});

test('DELETE full (string data/params)', 4, function () {
	var data = 'occupation=Banana Salesman';
	var params = 'location=bananastand';
	var expectedResponse = '';
	var request = this.client.jquery.del(data, params, function (response) {
		equal(response, expectedResponse, 'Correct response passed to callback');
	});

	var xhr = this.requests[0];
	equal(xhr.method, 'DELETE', 'XHR method is DELETE');
	equal(xhr.url, fullUrl + '?' + params, 'XHR has correct URL with params');
	equal(xhr.requestBody, data, 'XHR has correct body content');
	xhr.respond(204, defaultResponseHeaders, expectedResponse);
});

test('DELETE full (object data/params)', 4, function () {
	var dataStr = 'occupation=Fraudster';
	var dataObj = {occupation: 'Fraudster'};
	var paramsStr = 'location=jail';
	var paramsObj = {location: 'jail'};
	var expectedResponse = '';
	var request = this.client.jquery.del(dataObj, paramsObj, function (response) {
		equal(response, expectedResponse, 'Correct response passed to callback');
	});

	var xhr = this.requests[0];
	equal(xhr.method, 'DELETE', 'XHR method is DELETE');
	equal(xhr.url, fullUrl + '?' + paramsStr, 'XHR has correct URL with params');
	equal(xhr.requestBody, dataStr, 'XHR has correct body content');
	xhr.respond(204, defaultResponseHeaders, expectedResponse);
});

})(); // File-wide closure
