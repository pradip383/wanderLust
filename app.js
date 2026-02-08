if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
let app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const users = require("./routes/users.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const cookie = require("cookie");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

let port = 8080;

app.listen(port, (err) => {
  console.log("server port is on");
});

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views/listings"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let atlasDbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl:atlasDbUrl,
  crypto:{
    secret:"mysecret",
  },
  touchAfter:24*3600,
})

store.on("error", () => {
  console.log("error occured in mongo session", err);
});

const sessionOptions = {
  store: store,
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

main().then(() => {
  console.log("connection to database  succesfull");
});

async function main() {
  await mongoose.connect(atlasDbUrl);
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listing", listings);
app.use("/listing/:id/review", reviews);
app.use("/", users);

app.get("/demo", async (req, res) => {
  let user = new User({
    email: "ktdgxch",
    username: "utjgdc",
  });
  let savedUser = await User.register(user, "asdf");
  res.send(savedUser);
});

app.all("*path", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

//custom error handler
app.use((err, req, res, next) => {
  let { status = 500, message = "Some error occured" } = err;
  res.status(status).render("error.ejs", { message });
});
