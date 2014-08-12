/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var messages = [];
var msgId = 0;
var queries = {
  '-createdAt': function(messages) {
    messages.sort(function(a,b) {
      var date1 = Date.parse(a.createdAt);
      var date2 = Date.parse(b.createdAt);
      return date2 - date1;
    });
  }
};

exports.handleRequest = function(request, response) {
  /*the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */
  
  var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, origin, x-requested-with",
  "access-control-max-age": 10, // Seconds.
  };

  headers['Content-Type'] = "text/html";
  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

   console.log("Serving request type " + request.method + " for url " + request.url);

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */

  /* .writeHead() tells our server what HTTP status code to send back */

  var sendResponse = function(response, data, statusCode) {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  };

  if (request.method === 'OPTIONS') {
    sendResponse(response, 'Options request', 200);
  } else if (request.url.indexOf('/classes') === -1) {
    sendResponse(response, 'File does not exist', 404);
  } else if (request.method === 'GET') {
    sendResponse(response, {'results': messages}, 200);
  } else if (request.method === 'POST') {
    var body = '';
    request.on('data', function(chunk) {
      body += chunk;
      var parsedBody = JSON.parse(body);
      parsedBody.createdAt = Date.now();
      messages.push(parsedBody);
    });
    sendResponse(response, 'Successful post', 201);
  } else {
    sendResponse(response, 'Error', 404);  
  }
};

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */

