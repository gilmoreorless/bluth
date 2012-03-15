## V1 (DONE)

* Basic factory object
  * Input: server, URL prefix
  * Factory method for creating REST mappers
  * Define transport
* Mapper object
  * Has URL (eg. /templates)
  * Has REST methods (get, post, put, delete)
* Transport
  * Basic converter to translate mapper REST calls into AJAX requests
  * Start with jQuery but allow others

## V2

* Variable replacement in mapper URLs (eg. /templates/{id})
* Allow customisation of URLs for specific mapper REST types (eg. GET has different requirements)
* Default options/headers that are passed to transports (eg. contentType: 'application/json')
* CORS support (requires custom header feature)
* Error handlers - per server, mapper or request type

## V3

* Define sub-mappers (eg. /templates/{id}/favourites)
* Per-path transports?
* Node.js support
* Support for switching servers (edge case, but needed)
