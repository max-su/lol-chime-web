require("dotenv").config({silent: true}); //keep api key in .env

if (typeof process.env.APIKEY === "undefined") {
    console.log("[!] API key not found.");
    process.exit(1);
}

if (typeof process.env.REFRESHRATE === "undefined") {
    console.log("[!] Refresh rate not defined.");
    process.exit(1);
}

var request = require("request");
var SummonerEmitter = require("./SummonerEmitter");
module.exports = {};

var socket;

var getUrl = function(typeOfCall, region, id) {
    result = "https://" + region + ".api.pvp.net/";
    switch (typeOfCall) {
        case "summonerLookUp":
            result += "api/lol/" + region + "/v1.4/summoner/by-name/";
            break;
        case "gameLookUp":
            result += "observer-mode/rest/consumer/getSpectatorGameInfo/" + getRegionID(region)+ "/";
            break;
        case "championLookUp":
            result += "api/lol/static-data/" + region + "/v1.2/champion/";
            break;
        default:
            throw new Error("Invalid call type.");
    }
    result += id + "?api_key=" + process.env.APIKEY;
    return result;
};

var cleanSummonerName = function(summonerName) {
    var ignTrim = summonerName.replace(/ /g, "");
    ignTrim = ignTrim.toLowerCase();
    ignTrim = ignTrim.trim();
    return ignTrim;
};

var getRegionID = function(region) {
    switch (region) {
        case "BR":
            return "BR1";
        case "EUNE":
            return "EUN1";
        case "EUW":
            return "EUW1";
        case "JP":
            return "JP1";
        case "KR":
            return "KR";
        case "LAN":
            return "LA1";
        case "LAS":
            return "LA2";
        case "NA":
            return "NA1";
        case "OCE":
            return "OC1";
        case "TR":
            return "TR1";
        case "RU":
            return "RU";
        default:
            throw new Error("Invalid region.");
    }
};

module.exports.cleanSummonerName = cleanSummonerName;
module.exports.getUrl = getUrl;
module.exports.getRegionID = getRegionID;

module.exports.checkSummonerExists = function(SEArg) { //SEArg == SummonerEmitterArg
    if (SEArg instanceof SummonerEmitter) {
        request({
            url: getUrl("summonerLookUp", SEArg.getRegion(), SEArg.getName()),
            json: true //parses json string automatically into a js object
        },
        function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var name = SEArg.getName();
                var id = body[cleanSummonerName(name)].id;
                SEArg.setID(id);
                SEArg.setEmitState("ID Found");
            } else if (!error && response.statusCode === 429) { // Rate limited by the API
                SEArg.setEmitState("Rate limited");
            } else {
                SEArg.setEmitState("ID Not Found");
            }
        });
    }
};

module.exports.checkSummonerInGame = function(SEArg) {
    request({
        url: getUrl("gameLookUp", SEArg.getRegion(), SEArg.getID()),
        json: true
    },
    function(error, response, body) {
        if (!error && response.statusCode === 200) { //GAME FOUND
            SEArg.setGameLength(body.gameLength);

            if (SEArg.getInit() === false) {
                //So we dont keep reInitializing these variables.
                SEArg.setInitial(body.gameMode, body.gameType, body.gameStartTime, body.gameQueueConfigId, body.mapId);

                var championID;
                for (var participant in body.participants) {
                    if (body.participants[participant].summonerId === SEArg.getID()) {
                        championID = body.participants[participant].championId;
                    }
                }
                if (typeof championID === "undefined") {
                    console.log("[*] Could not get champion ID.");
                    SEArg.printSummary();
                    SEArg.setEmitState("Game Found");
                } else {
                    request({
                        url: getUrl("championLookUp", SEArg.getRegion().toLowerCase(), championID),
                        json: true
                    },
                    function(error, response, body) {
                        if (!error && response.statusCode === 200) {
                            SEArg.setChampion(body.key);
                            console.log("[*] Playing as " + body.key);
                        } else if (!error && response.statusCode === 404) {
                            console.log("[*] Could not get champion.");
                        } else {
                            console.log(error);
                        }
                        SEArg.printSummary();
                        SEArg.setEmitState("Game Found");
                    });
                }
            } else {
                SEArg.setEmitState("Game Found");
            }
        } else if (!error && response.statusCode === 404) { //NO GAME FOUND
            SEArg.setEmitState("Game Not Found");
        } else if (!error && response.statusCode === 429) { // Rate limited by the API
            SEArg.setEmitState("Rate limited");
        } else {
            SEArg.setEmitState("Server Sucks");
        }
    });
};

module.exports.initializeEvents = function(SEArg) {
    SEArg.on("Not Initialized", function() {
        console.log("[*] Looking up summoner " + SEArg.getName());
        socket.emit("msg", "Looking up summoner " + SEArg.getName());
        module.exports.checkSummonerExists(SEArg);
    });
    SEArg.on("ID Found", function() {
        console.log("[*] Summoner found! Checking if the player is in game.");
        socket.emit("msg", "Summoner found!");
        module.exports.checkSummonerInGame(SEArg);
    });
    SEArg.on("ID Not Found", function() {
        socket.emit("msg", "Summoner was not found.");
        console.log("[*] Summoner was not found.");
    });
    SEArg.on("Game Found", function() {
        socket.emit("msg", "Summoner is in game.");
        SEArg.printCurrentGame();
        callBackMS = process.env.REFRESHRATE * 1000; //seconds to MS for setTimeOut
        setTimeout(function() {
            module.exports.checkSummonerInGame(SEArg);
        }, callBackMS);
    });
    SEArg.on("Game Not Found", function() {
        //if the game is found, conclude the game, else no summary.
        if (SEArg.getInit() === true) {
            SEArg.printSummary();
            SEArg.printCurrentGame();
            socket.emit("msg", "The game has ended");
            socket.emit("chime");
            console.log("[*] The game has ended.");
        } else {
            socket.emit("msg", "A game has not been found.");
            console.log("[*] A game has not been found.");
        }
    });
    SEArg.on("Rate limited", function() {
        socket.emit("msg", "API is being rate-limited.");
        console.log("[!] Slow down!");
    });
    SEArg.emit("Not Initialized"); //could be made more efficient, dont have to listen for Not init  and just start checkSummonerExists.
};

module.exports.initializeSocket = function(serverSocket) {
    socket = serverSocket;
}
