
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

module.exports = createDataset;
