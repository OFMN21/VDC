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

  //array p = [monthN, $gt, 5]
var  obj={};
var constraint1 = {}; constraint1['$' + p[1]]= parseFloat(p[2]);
var column1 = {}; column1[p[0]]= constraint1;

var constraint2 = {}; constraint2['$' + p[5]]= parseFloat(p[6]);
var column2 = {}; column2[p[4]]= constraint2

if(p[3] == 'AND' ){
      obj = {
        $and:[
          column1,
          column2
        ]
    }
}else if (p[3] == 'OR') {
  obj = {
    $or:[
      column1,
      column2
    ]
}
}else if (p[0] != ''){
  obj = {
    [p[0]] : {['$' + p[1]] : parseFloat(p[2])}
  }
}else{
  return obj;
}
return obj;
}

exports.filter = filter;
