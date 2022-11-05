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



async function query(DS,filter,aggregate,q1,q2,q3){

  arr.length = 0;
  var obj;
  var x = [];
  var y = [];
  var filtered;
  const projection = { _id: 0 }; projection[q1] = 1; projection[q2] = 1;
  const grouping ={}; grouping[q1]=q1; grouping[q2] = q2;
  if(filter == undefined){
    filter = {}
  }
  if(aggregate == undefined){
    aggregate = {$addFields:{}}
  }
  switch (q3) {
    case 'Avg':
        console.log('AVG');
        filtered = await DS.aggregate(
                                      [ aggregate,
                                        {$match: filter},
                                        {$group:
                                        {_id:'$'+grouping[q1],
                                        y:{$avg:'$'+grouping[q2]}}}
                                      ])
                                        .toArray()
      break;
    case 'Count':
        console.log('count');
        filtered = await DS.aggregate(
                                      [
                                        aggregate,
                                        {$match: filter},
                                        {
                                          $group:
                                          {
                                            _id:'$'+grouping[q1],
                                            y:{$count:{}}
                                          }
                                        }
                                      ])
                                      .toArray()
    break;
    case 'Sum':
        console.log('sum');
        filtered = await DS.aggregate(
                                      [ aggregate,
                                        {$match: filter},
                                      {$group:
                                        {_id:'$'+grouping[q1],
                                        y:{$sum:'$'+grouping[q2]}}}
                                      ])
                                      .toArray()
      break;
      case 'Max':
          console.log('MAX');
          filtered = await DS.aggregate(
                                        [
                                          aggregate,
                                          {$match: filter},
                                          {$group:
                                        {_id:'$'+grouping[q1],
                                        y:{$max:'$'+grouping[q2]}}}])
                                        .toArray()
        break;
        case 'Min':
          console.log('MIN');
          filtered = await DS.aggregate(
                                        [
                                          aggregate,
                                          {$match: filter},
                                          {$group:
                                         {_id:'$'+grouping[q1],
                                         y:{$min:'$'+grouping[q2]}}}])
                                          .toArray()
          break;
    default:
          filtered = await DS.aggregate([
                                        aggregate,
                                        {$match: filter},
                                        {$project: projection}
                                        ]).toArray()
  }
  if(q3 == ""){
    for (let i = 0; i < filtered.length; i++) {
    obj = filtered[i]
    x.push(obj[q1])
    y.push(obj[q2])
  }
  arr.push(x)
  arr.push(y)
  return arr;
  }

  for (let i = 0; i < filtered.length; i++) {
    obj = filtered[i]
    x.push(obj['_id'])
    y.push(obj['y'])
  }

  arr.push(x)
  arr.push(y)


  return arr;

}
exports.query = query;
