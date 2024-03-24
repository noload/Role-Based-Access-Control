const express = require("express");
const createHttpError = require("http-errors");
const morgan = require("morgan");
const envObj = require("dotenv");
envObj.config();
const session = require("express-session");
const connectFlash = require("connect-flash");
const passport = require("passport");
const connectDB = require("./config/db");
const app = express();
app.use(morgan("dev"));

//to show html pages
app.set("view engine", "ejs");

//init session
app.use(
  session({
    secret: "rocess.env.SessionSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: true,
      httpOnly: true,
    },
  })
);

//for password session authentication
app.use(passport.initialize());
app.use(passport.session());
require("./utils/passport.auth");

app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});
//to use public folder inside our application
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.render("error_4ox", { error });
});

app.listen(3000, () => {
  console.log(`server running on port 3000`);
});
