module.exports = function(app) {
    app.get("/", function(req, res) {
        res.sendFile(__dirname + "/views/index.html");
    });

    app.get("/riot.txt", function(req, res) {
        res.sendFile(__dirname + "/views/riot.txt");
    });
};
