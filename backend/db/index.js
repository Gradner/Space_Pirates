///////////////////////////////////////////////////////////////////
//  Imports
///////////////////////////////////////////////////////////////////

const mongoose = require('mongoose');
const creds = require('../creds.json');
const bluebird = require('bluebird');

///////////////////////////////////////////////////////////////////
//  Database Connection
///////////////////////////////////////////////////////////////////

module.exports.connect = (uri) => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
  });
  mongoose.Promise = require('bluebird');
  
  mongoose.connection.on('open', ()=>{
    console.log('Connected to DB')
  });

  mongoose.connection.on('error', (err)=>{
    console.log('DB Connection Error: ' + err);
  })

///////////////////////////////////////////////////////////////////
//  Load Models
///////////////////////////////////////////////////////////////////

  require('./models/User');

}