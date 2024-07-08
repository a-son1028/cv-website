require("dotenv").config();
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const _ = require("lodash");
var axios = require('axios');

const SES = require("./services/ses");

// models
const userModel = require("./models/user");

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

router.get("/paragraph", async function (request, response) {
  response.render("projects/paragraph");
})

router.get("/", async function (request, response) {
  const ip = request.header['CF-Connecting-IP'] || request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  console.log(ip)
  const user = await userModel.get({
    id: "c1ae7243-738e-4356-8b1f-cc4c8ad76a0d",
  });

  user.conferenceArticles = user.articles.filter((item) => item.conference);
  user.conferenceArticles = _.orderBy(
    user.conferenceArticles,
    ["year"],
    ["desc"]
  );

  user.journalArticles = user.articles.filter((item) => item.journal);
  user.journalArticles = _.orderBy(user.journalArticles, ["year"], ["desc"]);

  response.render("index", { user });
});

router.post("/contact", async function (request, response) {
  const { fullName, email, subject, message } = request.body;
  const token = request.body["cf-turnstile-response"];
  const ip = request.header['CF-Connecting-IP'] || request.headers['x-forwarded-for'] || request.socket.remoteAddress;

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const result = await axios.default.post(url, {
    secret: "0x4AAAAAAAeoE2lN9KfdVTPAbeADO5SF54s",
    response: token,
    remoteip: ip.split(",")[0].trim()
  });

  const outcome = await result.data;
	if (!outcome.success) {
		return response.status(400).send('Invalid reCAPTCHA. Please try again.');
	}
  

  await SES.sendEmail(
    ["haxuanson123@gmail.com", "ha.son@rmit.edu.vn", "lethanhtuan1028@gmail.com"],
    `
    Full name: ${fullName} <br/>
    Email: ${email} <br/>
    Subject: ${subject} <br/>
    Message: ${message}
  `,
    "You have a contact from your CV website"
  );

  response.redirect("/");
});

app.use("/", router);

// app.listen(PORT, function () {
//   console.log("Listening on port " + PORT);
// });

module.exports = app;
