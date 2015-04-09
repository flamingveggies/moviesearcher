var Query = require("./query.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");
var commonHeaders = {'Content-Type': 'text/html'};

// handle http route get / and post / ie home
function home(request, response) {
  // if url == "/" && GET
  if (request.url === "/") {
    if (request.method.toLowerCase() === "get") {
    // show search
      response.writeHead(200, commonHeaders);
      renderer.viewHTML("header", {}, response);
      renderer.viewHTML("search", {}, response);
      renderer.viewHTML("footer", {}, response);
      response.end();
    } else {
      request.on("data", function(postBody) {
        var query = querystring.parse(postBody.toString());
        response.writeHead(303, {"Location": "/"+query.searchquery});
        response.end();
      });
      // if url == "/" && POST
        // get post data from body
        // extract query
        // redirect to /:query
    }
  }

}
  
// handle http route get /:query ie /red%20dawn
function user(request, response) {
  // if url == "/..."
  var searchquery = request.url.replace("/", "");
  if (request.url.indexOf('.css') === -1 && request.url.indexOf('.png') === -1 && searchquery.length > 0) {
    response.writeHead(200, commonHeaders);
    renderer.viewHTML("header", {}, response);
    
    // get json from new york times
    var movieQuery = new Query(searchquery);
    // on "end"
    movieQuery.on("end", function (movieJSON) {
    // show movie results 
      renderer.viewHTML("resultshead", {}, response);
      function listResults (i) {
      // store values needed and form list sections
        if ( i < movieJSON.results.length ) {
          var values = {
            moviename: movieJSON.results[i].display_title,
            movieyear: movieJSON.results[i].opening_date,
            capsulereview: movieJSON.results[i].capsule_review,
            summary: movieJSON.results[i].summary_short,
            reviewlink: movieJSON.results[i].link.url,
            trailerlink: movieJSON.results[i].related_urls[4].url
          }
          // cut down release date to just year. if release date is null, pass error instead.
          if (values.movieyear != null) {
            values.movieyear = values.movieyear.substring(0,4)
          } else {
            values.movieyear = '(no date found)'
          }
          renderer.viewHTML("results", values, response);
          listResults( i + 1 );
        }
      }
      listResults(0);
      // generate list sections for each returned movie result
      renderer.viewHTML("resultsfoot", {}, response);
      renderer.viewHTML("footer", {}, response);
      response.end();
    });

    // on "error"
    movieQuery.on("error", function (error) {
      // show error
      renderer.viewHTML("error", {errorMessage: error.message}, response);
      renderer.viewHTML("search", {}, response);
      renderer.viewHTML("footer", {}, response);
      response.end();
    }); 
  }
}

function assets(request, response) {
  if (request.url.indexOf('.css') != -1) {
    response.writeHead(200, {'Content-Type': 'text/css'});
    renderer.viewAsset(request.url, {}, response);
    response.end();
  } else if (request.url.indexOf('.png') != -1) {
    response.writeHead(200, {'Content-Type': 'image/png'});
    renderer.viewAsset(request.url, {}, response);
    response.end();
  }
}

module.exports.home = home;
module.exports.user = user;
module.exports.assets = assets;