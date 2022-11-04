var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


function aggregate(a){
  var obj;

  obj = {
    $addFields:{ [a[3]] :
       {
         ['$'+a[0]]: ['$'+a[1], '$'+a[2]]
       }
    }
  }
  console.log(obj);
  return obj;
}

exports.aggregate = aggregate;
