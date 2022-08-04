var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const PORT = 8080;

var router = express.Router();

router.get("/", function (request, response) {
  response.render("index", { title: "Welcome!" });
});

router.post("/contact", function (request, response) {
  console.log(request.body);
});

app.use("/", router);

app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
});

module.exports = app;
