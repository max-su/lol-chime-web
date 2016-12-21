var express = require("express");
var http = require("http");
var router = require("./router");

var leagueLib = require("./lib/leagueLib");
var SummonerEmitter = require("./lib/SummonerEmitter");

var app = express();
var server = http.Server(app);
var io = require("socket.io")(server);

app.use(express.static("public"));

router(app);

clients = {};
/*clients[socket.id] = summoner;
 *Keys : Socket Id
 *Value : Summoner Reference
 */

io.on("connection", function(socket) {
    socket.on("disconnect", function() {
        try {
            clients[socket.id].removeAllListeners();
            clients[socket.id] = 0;
            delete clients[socket.id];
        } catch (e) {
            // Client has not made a request to track
        }
    });
    socket.on("trackSummoner", function(data) {
        summoner = new SummonerEmitter(data.summoner, data.region);
        summoner.setSocket(socket);
        leagueLib.initializeEvents(summoner);
        clients[socket.id] = summoner;
    });
});

server.listen(process.env.PORT || 5000, function() {
    console.log("[*] Server started on port 5000... or heroku's magical port");
});
