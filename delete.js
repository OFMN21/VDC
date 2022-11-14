
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
  const ds = datasetName + "_" + username +"s"
  const pop = ds + "_pops"
  try{
  mongoose.connection.db.dropCollection(ds);
}catch{
  console.log('err');
}
  //mongoose.connection.db.dropCollection(pop);
  mongoose.connection.db.listCollections({name: pop}).next(function(err, collinfo) {
          if (collinfo) {
            mongoose.connection.db.dropCollection(pop);
          }
  })
}


module.exports = deleteDataset;
