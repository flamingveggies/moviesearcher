var router = require("./app/router.js");

var http = require('http');
http.createServer(function (request, response) {
  router.home(request, response);
  router.user(request, response);
  router.css(request, response);
}).listen(3000);
console.log('The server is running! You\'re listening at port 3000.');