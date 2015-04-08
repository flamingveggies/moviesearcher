var router = require("./app/router.js");
var port = process.env.PORT || 3000;

var http = require('http');
http.createServer(function (request, response) {
  router.home(request, response);
  router.user(request, response);
  router.css(request, response);
}).listen(port);
console.log('The server is running! You\'re listening at port 3000.');