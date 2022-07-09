const express = require("express");
const https = require("https");
const ejs = require("ejs");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const alert = require("alert");
const session = require("express-session");
const passport = require("passport");
const passportLocalMangoose = require("passport-local-mongoose");

const app = express();
var problemName = "Name of the Problem";
var contestId = 0;
var index = "Z";
var userName = "";
var rating;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "our little secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://suryamanikanta:SuryaManikanta@cluster0.cqosagt.mongodb.net/UserDB", { useNewUrlParser: true });

// mongoose.set("useCreateIndex",true);

const dataSchema = new mongoose.Schema({
  date: String,
  problemname: String,
  rating: Number,
  accepted: String,
  start: String,
  finished: String,
  id: String,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMangoose);
const User = new mongoose.model("User", userSchema);
const Data = new mongoose.model("Data", dataSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.redirect("dashboard");
});
app.get("/home", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("home");
  });
});

app.get("/Analysis", function (req, res) {
  if (req.isAuthenticated()) {
    Data.find({ id: userName }, function (err, datas) {
      if (err) throw err;

      res.render("Analysis", { datas: datas, userName: userName });
    }).sort({ start: -1 });
  } else {
    alert("you are not loged in");
    res.redirect("/login");
  }
});

app.get("/About", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("About",{userName:userName});
  } else {
    alert("you are not loged in");
    res.redirect("/login");
  }
});



app.get("/Status", function (req, res) {
  if (req.isAuthenticated()) {
    Data.find({}).sort({ "start": -1 }).exec(function(err, datas) {
      if(err) throw err;
      res.render("Status",{datas:datas,userName:userName});
     });
    
  } else {
    alert("you are not loged in");
    res.redirect("/login");
  }
});











app.get("/Todo", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("Todo",{userName:userName});
  } else {
    alert("you are not loged in");
    res.redirect("/login");
  }
});

app.get("/dashboard", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("dashboard",{userName:userName});
  } else {
    alert("you are not loged in");
    res.redirect("/home");
  }
});

app.get("/connections", function (req, res) {
  if (req.isAuthenticated()) {
    Data.find({}, function (err, datas) {
      if (err) throw err;

      res.render("connections", { datas: datas ,userName:userName});
    }).sort({ start: -1 });
  } else {
    alert("you are not loged in");
    res.redirect("/home");
  }
});
app.get("/inprogress", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("inprogress",{userName:userName});
  } else {
    alert("you are not loged in");
    res.redirect("/login");
  }
});

app.post("/register", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        alert(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          userName = req.body.username;
          res.redirect("/dashboard");
        });
      }
    }
  );
});

app.post("/list", function (req, res) {
  const today = new Date();
  const Data = mongoose.model("Data", dataSchema);
  Data.updateMany(
    { id: userName, problemname: problemName },
    { $set: { finished: today, accepted: "YES" } },
    function (err, docs) {
      if (err) {
        console.log(err);
        alert(err);
      } else {
        console.log("Updated Docs : ", docs);
        alert("succesfully updated to analysis");
        res.render("dashboard",{userName:userName});
      }
    }
  );
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.render("home");
      alert(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        userName = req.body.username;
        res.redirect("/dashboard");
      });
    }
  });
});

app.post("/dashboard", function (req, res) {
  contestId = Number(req.body.contestid);
  index = req.body.index;

  const url =
    "https://codeforces.com/api/contest.standings?contestId=" +
    contestId +
    "&from=1&count=1";
  https.get(url, function (response) {
    response.on("data", function (data) {
      const problemData = JSON.parse(data);
      const status = problemData.status;
      if (status === "OK") {
        const problemCount = problemData.result.problems.length;
        for (var i = 0; i < problemCount; i++) {
          if (req.body.index === problemData.result.problems[i].index) {
            problemName = problemData.result.problems[i].name;
            rating = Number(problemData.result.problems[i].rating);
          }
        }

        res.render("list", {
          problemDiscription: problemName,
          cI: contestId,
          I: index,
          userName:userName
        });
        const Data = mongoose.model("Data", dataSchema);
        var today = new Date();
        var day = today.toISOString().substring(0, 10);
        const data = new Data({
          date: day,
          problemname: problemName,
          rating: rating,
          accepted: "NO",
          start: today,
          id: userName,
        });
        data.save();
      } else {
        res.render("dashboard");
        alert("no such contest");
      }
    });
  });
});

app.post("/connections", function (req, res) {
  const userID = req.body.usersearch;

  Data.find({ id: userID }, function (err, datas) {
    if (err || !datas.length) {
      console.log(err);
      alert("user" + userID + "not found");
      res.redirect("/connections");
    } else {
      const uservalidation = userID;
      

  Data.find({},function(err,wholedata){
    if(err)
    {
      console.log(err);
      alert("err");
    }else{
      res.render("userlist", { userName:userName,datas: datas, uservalidation: uservalidation ,Data:Data,wholedata:wholedata});
    }
  })}
  }).sort({ start: -1 });
});



app.post("/userlist", function (req, res) {
  const userID = req.body.usersearch;

  Data.find({ id: userID }, function (err, datas) {
    if (err || !datas.length) {
      console.log(err);
      alert("user" + userID + "not found");
      res.redirect("/connections");
    } else {
      const uservalidation = userID;
      

  Data.find({},function(err,wholedata){
    if(err)
    {
      console.log(err);
      alert("err");
    }else{
      res.render("userlist", { userName:userName,datas: datas, uservalidation: uservalidation ,Data:Data,wholedata:wholedata});
    }
  })}
  }).sort({ start: -1 });
});




app.listen(process.env.PORT || 3000, function () {
  console.log("server is live on 3000");
});
