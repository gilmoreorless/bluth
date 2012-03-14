# Bluth.js

Give your JS *a RESTed development*

This is still a work in progress, more functionality and flexibility will be added soon.

## Create a new REST client

    var restClient = Bluth(serverUrl);
    // OR
    var restClient = new Bluth(serverUrl);

The `new` keyword is optional when creating a Bluth client.

## Pick a transport method

Technically Bluth is library-independent, but for the purposes of quick development,
currently jQuery is the only transport defined - more will be coming.

TODO: More details about transports

## Define REST endpoints

    var restPath = restClient.addPath(endpointName, endpointPath, methods);

`methods` is an optional array of HTTP methods to define (GET, POST, etc) - if missing
it defaults to 'get'

This defines a property on `restClient` that represents a mapping to the REST endpoint.
The property is also returned by the function, so you can assign it to a variable.

Example:

    var family = restClient.addPath('family', '/rest/1/family', ['get', 'post', 'delete']);
    // restClient now has a "family" property that contains the "get", "post" and "del" functions

**NOTE:** Due to `delete` being a reserved keyword in JS, the DELETE method maps to the `.del()` function,
while GET, POST and PUT are more normal and correspond to the `.get()`, `.post()` and `.put()` functions respectively.

## Call endpoint methods

A REST endpoint mapping has functions that relate to the methods passed in during definition.

The `get()` method has a slightly different function signature from the others.

    restClient[endpointName].get(urlParams, callback);
    restClient[endpointName].get(callback);

    restClient[endpointName].post(data, urlParams, callback);
    restClient[endpointName].post(data, callback);
    restClient[endpointName].post(data);
    restClient[endpointName].post(callback);
    restClient[endpointName].post();

    restClient[endpointName].put(data, urlParams, callback);
    restClient[endpointName].del(data, urlParams, callback);
    // Variations for .put() and .del() are the same as for .post()

All parameters are all optional.

* `data` (not used by `.get()`) - raw data to send, can be a string or key/value object (which is converted to form data).
* `urlParams` - extra detail to send in the URL, can be a string or key/value object.
  If you want to send `urlParams` with no data, you must set `data` to `null`.
* `callback` - function that is called with the results of the AJAX call.

The arguments passed to `callback` entirely depend on the transport layer used.
The return value of all methods is the return value of the transport layer,
so if you're using jQuery the return value is a jQuery deferred AJAX object.

Examples:

    restClient.family.get(function (data) {});

    restClient.family.post({name: 'George', status: 'In prison'});