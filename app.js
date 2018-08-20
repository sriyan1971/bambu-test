var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes(app);

var server = app.listen(3000, function () {
    console.log("bambu Server running on port.", server.address().port);
});