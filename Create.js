
var express = require('express');
var multer = require('multer');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var csv = require('csvtojson');
// var empSchema = require('./models/EmpModel');

const fs = require("fs");
const { parse } = require("csv-parse");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

function createDataset(datasetName, file) {
const data = [];
fs.createReadStream(file)
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {

    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {

      const thingSchema = new mongoose.Schema(
      data[0] , { strict: true });
      const name = datasetName + ""
      const Thing = new mongoose.model(name, thingSchema);
      let i = 1;
      while (i < data.length) {
        const thing = new Thing(
          data[i]
        );
        thing.save();
            i++;
          }
  try {
    fs.unlinkSync(file);
    console.log("Delete File successfully.");
  } catch (error) { console.log(error);}
  });
}

function  updateDataset(datasetName, file) {
const data = [];
  fs.createReadStream(file)
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {

    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", async function (){

  var obj = data[0];
  console.log(obj);
  const name = datasetName + ""
  const Schema = mongoose.model(name, new mongoose.Schema(
  obj
));
  var i = 1;
  while (i < data.length){
  obj = data[i];
  var filter = {_id : obj._id}
  console.log(filter + " of: " + obj);
  await Schema.findOneAndUpdate(filter, obj, {
  new: true,
  upsert: true // Make this update into an upsert
});
i++;
}
//data.splice(1,data.length) cuts the array
//Object.values(obj)[1] gives you first key value

  try {
    fs.unlinkSync(file);
    console.log("Delete File successfully.");
  } catch (error) { console.log(error);}
  });
}

exports.createDataset = createDataset;
exports.updateDataset = updateDataset;
