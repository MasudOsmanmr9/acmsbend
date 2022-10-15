require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

var publicRouter = require("./routes/public/public");
var authRouter = require("./routes/auth/auth");
var adminRouter = require("./routes/admin/admin");

var app = express();

var bodyParser = require("body-parser");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const cors = require("cors");
const SMSManager = require("./utils/sms_manager");
const { readFile } = require("fs");
const whitelist = [
  "http://localhost:4200",
  "localhost:4200",
  "http://localhost:3000",
  "localhost:3000",
];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  optionsSuccessStatus: 200,
  allowedHeaders: [
    "Accept",
    "Origin",
    "Content-Type",
    "X-Requested-With",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
  ],
  exposedHeaders: "Content-Range,X-Content-Range",
};


app.use("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "./favicon.ico"));
});

app.use(function (req, res, next) {
  req.headers.origin = req.headers.origin ? req.headers.origin : req.headers.host;
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  next();
});


app.use(cors(corsOptions)).use("/auth", authRouter);
app.use(cors(corsOptions)).use("/api", publicRouter);
app.use(cors(corsOptions)).use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function authenticateSessionToken(req, res, next) {
  const cookieHeader = req.headers["cookie"];
  if (cookieHeader == null)
    return res.status(process.env.API_Forbidden).send({
      Success: false,
      Message: "No session token found",
    });

  let bytes = crypto.AES.decrypt(cookieHeader, process.env.ACCESS_TOKEN_SECRET);
  let originalText = bytes.toString(crypto.enc.Utf8);

  if (originalText == "efgpos") {
    next();
  } else {
    return res.status(process.env.API_Forbidden).send({
      Success: false,
      Message: "Invalid session token",
    });
  }
}

function authenticateAccessToken(req, res, next) {
  try {
    const headers = req.headers.authorization;
    const accessToken = headers && headers.split(" ")[1];
    if (accessToken == null)
      return res.status(process.env.API_Forbidden).send({
        Success: false,
        Message: "No authorization token provided",
      });

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(process.env.API_Unauthorized).send({
          Status: false,
          Message: err,
        });
      let exp = user.exp * 1000;
      let now = Date.now();
      if (exp > now) {
        req.user = user;
        next();
      } else {
        return res.status(process.env.API_Unauthorized).send({
          Status: false,
          Message: "Authentication expired. ",
        });
      }
    });
  } catch (e) {
    return res.status(process.env.API_Unauthorized).send({
      Status: false,
      Message: e.toString(),
    });
  }
}

function authenticateAdminToken(req, res, next) {
  try {
    const headers = req.headers.authorization;
    const accessToken = headers && headers.split(" ")[1];
    if (accessToken == null)
      return res.status(process.env.API_Forbidden).send({
        Success: false,
        Message: "No authorization token provided",
      });

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(process.env.API_Unauthorized).send({
          Status: false,
          Message: err,
        });
      let exp = user.exp * 1000;
      let now = Date.now();
      if (exp > now) {
        if (user.role == "admin" || user.role == "super-admin" || user.role == "sa") {
          req.user = user;
          next();
        } else {
          return res.status(process.env.API_Unauthorized).send({
            Status: false,
            Message: "You are not an admin user",
          });
        }
      } else {
        return res.status(process.env.API_Unauthorized).send({
          Status: false,
          Message: "Authentication expired.",
        });
      }
    });
  } catch (e) {
    return res.status(process.env.API_Unauthorized).send({
      Status: false,
      Message: e.toString(),
    });
  }
}



console.log("API running");
module.exports = app;
