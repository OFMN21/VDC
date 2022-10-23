var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
var arr = []




async function query(dataSetName,q1,q2,q3){
var x = [];
var y = [];

const projection = { _id: 0 }; projection[q1] = 1; projection[q2] = 1;

var filtered = await mongoose.connection.db.collection(dataSetName).aggregate(
                                                                              [
                                                                        //هذا  يسوي الاقرقيشن فنكشن بس عيا يشتغل        {$group:{_id:'$Year', y:{$sum:'$Score2'}}},
                                                                                {$project: projection}
                                                                              ]
                                                                              ).toArray()
console.log(filtered);
var obj;
for (let i = 0; i < filtered.length; i++) {
  obj = filtered[i]
  x.push(obj[q1])
  y.push(obj[q2])
}
arr.push(x)
arr.push(y)
return arr;
// return arr;
}

exports.query = query;
