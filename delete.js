
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

function deleteDataset(datasetName, username){
  const ds = datasetName + "_" + username
  mongoose.connection.db.dropCollection(ds, function(err, result) {
  console.log(ds + " has been deleted successfully");
  });
}

module.exports = deleteDataset;
