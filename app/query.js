var EventEmitter = require("events").EventEmitter;
var http = require("http");
var util = require("util");

/**
 * An EventEmitter to get NYT movie review data.
 * @param searchquery
 * @constructor
 */
function Query(searchquery) {

    EventEmitter.call(this);

    queryEmitter = this;

    // connect to the API URL (http://api.nytimes.com/svc/movies/v2/reviews/search?query=""&api-key=725ecfe51e28bc81b293460e072b10e6:13:71774658)
    var request = http.get("http://api.nytimes.com/svc/movies/v2/reviews/search?query=" + searchquery +"&api-key=725ecfe51e28bc81b293460e072b10e6:13:71774658", function(response) {
        var body = "";

        if (response.statusCode !== 200) {
            request.abort();
            // status Code Error
            queryEmitter.emit("error", new Error("There was an error fetching movies with " + searchquery + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
        }

        // read the data
        response.on('data', function (chunk) {
            body += chunk;
            queryEmitter.emit("data", chunk);
        });

        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    // parse the data
                    var query = JSON.parse(body);
                    queryEmitter.emit("end", query);
                } catch (error) {
                    queryEmitter.emit("error", error);
                }
            }
        }).on("error", function(error){
            queryEmitter.emit("error", error);
        });
    });
}

util.inherits( Query, EventEmitter );

module.exports = Query;