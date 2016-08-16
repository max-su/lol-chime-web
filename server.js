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
leagueLib.initializeSocket(io);

var summoner;

io.on("connection", function(socket) {
    socket.on("trackSummoner", function(data) {
        summoner = new SummonerEmitter(data.summoner, data.region);
        leagueLib.initializeEvents(summoner);
    });
});

server.listen(5000, function() {
    console.log("[*] Server started on port 5000...");
});
