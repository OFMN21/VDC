var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


function filter(p){
var  obj;
console.log(p);
var po = p[0]

if(p[3] == AND){
      obj = {
        $and:[
          {monthN: {$gt: 5}}
        ]
    }
}
return obj;
}

exports.filter = filter;
