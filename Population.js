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
console.log(isNaN(p[2]));
  //array p = [monthN, $gt, 5]
var  obj={};
if( isNaN(p[2]) ){
  var constraint1 = {}; constraint1['$' + p[1]]= p[2];
  var column1 = {}; column1[p[0]] = constraint1;
  console.log("N:1", column1);
}else{
  var constraint1 = {}; constraint1['$' + p[1]]= parseFloat(p[2]);
  var column1 = {}; column1[p[0]] = constraint1;
  console.log("N:2", column1);
}
if(isNaN(p[6])){
  var constraint2 = {}; constraint2['$' + p[5]]= p[6];
  var column2 = {}; column2[p[4]] = constraint2
  console.log("N:3", column2);
}else{
  var constraint2 = {}; constraint2['$' + p[5]]= parseFloat(p[6]);
  var column2 = {}; column2[p[4]] = constraint2
  console.log("N:4", column2);
}


if(p[3] == 'AND' ){
      console.log("and");
      obj = {
        $and:[
          column1,
          column2
        ]
    }
}else if (p[3] == 'OR') {
  console.log("or");
  obj = {
    $or:[
      column1,
      column2
    ]
}
}else if (p[0] != ''){
    console.log("nor");
    if(isNaN(p[2])){
      console.log("str");
      obj = {

          [p[0]] : {['$' + p[1]] : (p[2])}
        }
    }else{ console.log("nm");
      obj = {
          [p[0]] : {['$' + p[1]] : parseFloat(p[2])}
                  }
          }
}else{
  return obj;
}
return obj;
}

exports.filter = filter;
