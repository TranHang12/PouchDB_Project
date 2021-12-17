/Requiring the package  
var PouchDB = require('PouchDB');  
//Creating the database object  
var db = new PouchDB('socute');
PouchDB.plugin(require('pouchdb-find'));
//create index  

db.createIndex({
    index: {
      fields: ['title']
    }
  }).then(function (result) {
    console.log(result)
  }).catch(function (err) {
    console.log(err)
  })