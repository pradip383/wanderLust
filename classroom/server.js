const express = require("express");
let app = express();
const cookieParser = require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const ejs=require("ejs");
const path=require("path");

let port = 3000;

app.listen(port, () => {
  console.log("server is on");
});

const sessionOptions = {
  secret: "mySecret",
  resave: false,
  saveUninitialized:true,
};

app.use(session(sessionOptions));
app.use(cookieParser());
app.use(flash());
app.set("view engine",ejs);
app.set("views",path.join(__dirname,"./views"));

app.get("/register", (req, res) => {
  let {name="anonymous"}=req.query;
  if(name=="anonymous"){
    req.flash("error","user not registered");
  } else{
    req.flash("succes", "New user added");
  }
  req.session.name=name;
  res.redirect("/hello");
});

app.use((req,res,next)=>{
  res.locals.succesMsg=req.flash("succes");
  res.locals.errorMsg=req.flash("error");
  next();
})
app.get("/hello", (req, res) => {
  res.render("page.ejs",{name:req.session.name});
});
