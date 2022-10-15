
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

function deleteDataset(datasetName){
  mongoose.connection.db.dropCollection('', function(err, result) {
    console.log(datasetName + " has been deleted successfully");
  });
}

module.exports = deleteDataset;
