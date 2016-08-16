$(document).ready(function() { // when the document is ready, the function inside the paremeter of ready will be run.
    var socket = io();

    socket.on("msg", function(msg) {
        console.log(msg);
    });

    socket.on("chime", function() {
        new Audio("bard.mp3").play()
    });

    $("#summonerName, #search, .btn-group").fadeIn("slow"); //fades in the form

    $("#summonerName").on("focus", function() {
        $("#bardAnim").fadeIn("slow"); //fades in the walking bard gif
    });

    $("#search").on("click", function(){
        var summonerName = $("#summonerName").val();
        var region = $("#region").html();
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
