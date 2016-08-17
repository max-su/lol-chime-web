$(document).ready(function() { // when the document is ready, the function inside the paremeter of ready will be run.
    $("#summoner_data").hide();
    var socket = io();

    socket.on("summonerFound", function(name) {
        $("#summoner_data").show();
        setName(name);
        setStatus("Checking...", "goldenrod");
    });

    socket.on("summonerNotFound", function() {
        alert("Summoner not found.");
    });

    socket.on("summonerInGame", function() {
        setStatus("In game", "green");
    });

    socket.on("gameEnd", function() {
        setStatus("Game ended.", "red");
    });

    socket.on("gameNotFound", function() {
        setStatus("Not in game", "red");
    });

    socket.on("chime", function() {
        new Audio("bard.mp3").play()
    });

    socket.on("apiRateLimitReached", function() {
        alert("API Rate limit has been reached. Please re-query.");
    });

    socket.on("init", function(data) {
        setChampion(data.champion);
        setMap(data.map);
        setQueueType(data.queueType);
        setGameType(data.gameType);
        setGameMode(data.gameMode);
    });

    $("#summonerName, #search, .btn-group").fadeIn("slow"); //fades in the form

    $("#summonerName").on("focus", function() {
        $("#bardAnim").fadeIn("slow"); //fades in the walking bard gif
    });

    $("#search").on("click", function(){
        var summonerName = $("#summonerName").val();
        var region = $("#region").html();
        if (region === "") {
            alert("Please select a region");
            return;
        }
        socket.emit("trackSummoner", {
            "summoner": summonerName,
            "region": region
        });
    });

    $(".dropdown-menu li a").on("click", function(){
        var region = $(this).text(); //region functionality
        $(this).parents(".btn-group").find(".dropdown-toggle").html(region);
    });

});

function setName(name) {
    $("#summoner_ign").text(name);
}

function setStatus(_status, color) {
    $("#summoner_status").text(_status);
    $("#summoner_status").css({"color": color});
}

function setChampion(champion) {
    if (champion) {
        $("#summoner_champion").text("Champion: " + champion);
        $("#summoner_champion_img").attr("src","https://ddragon.leagueoflegends.com/cdn/6.16.2/img/champion/" + champion + ".png");
    } else {
        alert("Champion could not be found.");
    }
}

function setMap(map) {
    $("#map").text("Map: " + map);
}

function setQueueType(queueType) {
    $("#queueType").text("Queue Type: " + queueType);
}

function setGameType(gameType) {
    $("#gameType").text("Game Type: " + gameType);
}

function setGameMode(gameMode) {
    $("#gameMode").text("Game Mode: " + gameMode);
}
