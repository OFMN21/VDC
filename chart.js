//
// var express = require('express');
// var mongoose = require('mongoose');
// // var path = require('path');
// var bodyParser = require('body-parser');
// var echarts =require('echarts');
//
// const app = express();
//
// app.use(express.static("public"));
// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
//
// function displayChart(datasetName, username){
//   const ds = datasetName + "_" + username +"s"
//
//
//
//   var dataset = mongoose.connection.db.collection(datasetName)
//   var mykeys;
//   dataset.findOne({}, function(err,result) {
//   mykeys = Object.keys(result);
//   if(err){console.log("not working")}
//
//   columnNames = mykeys.splice(1,mykeys.length-2)
//   console.log(columnNames)
// });
//   var chartType="bar";
//   var x = dataset.year
//   var y = dataset.gpa
//
//   if(chartType=="bar"){
//   option = {
//     xAxis: {
//       type: 'category',
//       data: x
//     },
//     yAxis: {
//       type: 'value'
//     },
//     series: [
//       {
//         data: y,
//         type: 'bar',
//         showBackground: true,
//         backgroundStyle: {
//           color: 'rgba(180, 180, 180, 0.2)'
//         }
//       }
//     ]
//   };}//--------->end of BAR chart
//   if(chartType=="pie"){
//
//
//
//
//
// }//--------->end of PIE chart
//   });
// // }
//
// module.exports = displayChart;
