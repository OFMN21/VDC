//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const createDataset = require("./create");
const deleteDataset = require("./delete")
const passportLocalMongoose = require("passport-local-mongoose");
const multer = require('multer');
const app = express();

let currentUser;

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './uploads/')
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + Date.now()
    )
  },
})
var upload = multer({
  storage: storage,
})

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); // use passport to manage session

//DB
//mongodb+srv://OFMN21:OFMN212@vdc.jenoizx.mongodb.net/?retryWrites=true&w=majority
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dateSets: [String]
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); //start the session
passport.deserializeUser(User.deserializeUser()); //end the session

app.post("/create", upload.single('file'), function(req, res) {

  var name = req.body.datasetName + ""
  var datasetName = name + '_' + currentUser; //change username to globalString ------------------------------------------------>to go back to the old IDEA
  var file = __dirname + '/uploads/' + req.file.filename

  User.updateOne({
    username: {
      $gte: currentUser
    }
  }, {
    $push: {
      dateSets: [name]

    }
  }, function(err, docs) {
    if (err) {
      console.log(err)
    } else {
      console.log("Updated Docs : ", docs)
    }
  })

  createDataset(datasetName, file)

  res.redirect("/homepage");
});

app.post("/delete", function(req, res) {
  const ds = req.body.dataset
  console.log(ds)
  //deleteDataset(ds, currentUser)
  res.redirect("/homepage");
})

app.get("/", function(req, res) {
  res.render("login", {
    msg: ''
  });
});

app.get("/register", function(req, res) {
  res.render("register", {
    msg: ''
  });
});

app.get("/login", function(req, res) {
  res.render("login", {
    msg: ''
  });
});


app.get("/homepage", function(req, res) {
  if (req.isAuthenticated()) {
    User.findOne({
      username: currentUser
    }, {
      dateSets: 1
    }, function(err, foundUsers) {

      res.render("homepage", {
        newListItems: foundUsers.dateSets

      });
    });
  } else {
    res.redirect("/");
  }
});


app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.post("/register", function(req, res) {
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      res.render("register.ejs", {
        msg: 'You are already registered'
      });
    } else {

      res.redirect("/");

    }
  });
});

app.post("/login", function(req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('login.ejs', {
        msg: "Email or Password is wrong, please try again"
      });
    }
    req.logIn(user, function(err) {

      if (err) {
        return next(err);
      }
      currentUser = req.user.username;
      return res.redirect('/homepage');

    })
  })(req, res, next);
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
