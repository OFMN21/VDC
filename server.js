const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const create = require("./create");
const query = require("./query");
const aggregation = require("./aggregation");
const population = require("./population");
const deleteDataset = require("./delete")
const passportLocalMongoose = require("passport-local-mongoose");
const multer = require('multer');
const app = express();

var x;
var y;
var dsName;
var dsTitle;
var columnNames;
var dsDelete;
var currentUser;
var message = 'undefined';
var messageType = 'undefined';
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
mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dateSets: [String]
});
// const populationSchema = new mongoose.Schema({
//   _id: String,
//   aggregation: String,
//   population: String
// });
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); //start the session
passport.deserializeUser(User.deserializeUser()); //end the session


app.post("/filter", async function(req, res){
console.log(req.body.popType);
var filteredDS = await mongoose.connection.db.collection(dsName);

if(req.body.popType === 'defined'){
      if(a[0] != '' && a[1] != '' && a[2] != ''){
        var agg = aggregation.aggregate(req.body.a);
      }else{
        var agg = undefined;
      }
        var pop = population.filter(req.body.p);
}
//else if(req.body.popType === 'selected'){
//   var agg = جبها من الداتابيس;
//   var pop = جبها من الداتابيس;
// }
  else{
    var agg = undefined;
    var pop = undefined;
}

  try{
      var array = await query.query(
        filteredDS,
        pop,
        agg,
        req.body.q1,
        req.body.q2,
        req.body.q3
      );
    }
  catch(err){
      console.log(err);
      message = "Query input is not valid";
      messageType = "alert-danger"
      res.redirect("/homepage");
      return;
    }
  x = array[0];
  y = array[1];
  console.log(x,y);
  if(x.length === 0 || y.length === 0){
      message = "Population input is not valid";
      messageType = "alert-danger"
      res.redirect("/homepage");
      return;
    }
  // if(req.body.اسم التشيكبوكس.checked){
  //   // var popname = req.body.popName + '_' + dsName
  //   // const savePop = new mongoose.model(, populationSchema);
  // }
  message = 'undefined';
  messageType = 'undefined';
  res.redirect("/chartpage");
});

app.get("/chartpage", async function(req, res){
  if (req.isAuthenticated()) {
      res.render("chartpage", {
        x: await x,
        y:await y
      });
  } else {
    res.redirect("/");
  }
})

app.post("/create", upload.single('file'), function(req, res) {

  var name = req.body.datasetName + ""
  var datasetName = name + '_' + currentUser+ 's'; //change username to globalString ------------------------------------------------>to go back to the old IDEA
  var file = __dirname + '/uploads/' + req.file.filename

  mongoose.connection.db.listCollections({name: datasetName})
      .next(function(err, collinfo) {
          if (collinfo) {
            create.updateDataset(datasetName, file)
            message = "Dataset Updated";
            messageType = "alert-success";

          }else{
            User.updateOne({
              username: {
                $gte: currentUser
              }
            }, {$push: {
                dateSets: [name]

              }}, function(err, docs) {
              if (err) {
                console.log(err)
              } else {}
            })
            create.createDataset(datasetName, file)
            message = "Dataset Created";
            messageType = "alert-success";
          }
      });

  res.redirect("/homepage");
});

app.post("/delete", function(req, res) {
  User.findOneAndUpdate({ username: currentUser }, { $pull: { dateSets: dsDelete } }, function(err, foundList) {});
  deleteDataset(dsDelete, currentUser)
  dsDelete = null;
  res.redirect("/homepage");
});

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

app.post("/view", function(req, res) {
  columnNames = undefined;
  dsName = req.body.view + '_' + currentUser + 's';
  dsTitle = req.body.view;
  if(req.body.delete != undefined){
    dsDelete = req.body.delete;
    res.redirect(307, "/delete");
    message = "Dataset deleted";
    messageType = "alert-danger"
  }else{
  var dataset = mongoose.connection.db.collection(dsName)
  var mykeys;
  dataset.findOne({}, function(err,result) {
  mykeys = Object.keys(result);
  if(err){console.log("not working")}

  columnNames = mykeys.splice(0,mykeys.length)

});
  res.redirect("/homepage");
  }

});

app.get("/homepage", function(req, res) {

  if (req.isAuthenticated()) {
    User.findOne({
      username: currentUser
    }, {
      dateSets: 1
    }, function(err, foundUsers) {

      res.render("homepage", {
        newListItems: foundUsers.dateSets,
        msg: message,
        type: messageType,
        tbl: columnNames,
        ds: dsTitle
      });
      message = 'undefined';
      messageType = 'undefined';
    });

  } else {
    res.redirect("/");
  }
})

app.get("/logout", (req, res) => {
  columnNames = null;
  dsDelete = null;
  currentUser = null;
  message = 'undefined';
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
