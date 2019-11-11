require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const daysRouter = require("./routes/days");
const profileRouter = require("./routes/profile");
const searchRouter = require("./routes/search");
const todosRouter = require("./routes/todos");
const goalsRouter = require("./routes/goals");

const app = express();
app.use(cors());

// view engine setup
app.set("view engine", "ejs");

//mongoose setup
const mongodburi = process.env.MONGO_URI;
mongoose.set("debug", true);
mongoose.connect(mongodburi, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//express-session setup
app.use(
  require("express-session")({
    secret: "Snacky",
    resave: false,
    saveUninitialized: false
  })
);

//passport setup//
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/client")));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/views")));
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//routes
app.use("/", indexRouter);
app.use("/profile", profileRouter);
app.use("/api/days", daysRouter);
app.use("/api/search", searchRouter);
app.use("/api/todos", todosRouter);
app.use("/api/goals", goalsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
