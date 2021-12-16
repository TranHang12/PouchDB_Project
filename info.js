//Requiring the package  
var PouchDB = require('PouchDB');  
//Creating the database object  
var db = new PouchDB('socute');  
//Database information  
db.info(function(err, info) {  
   if (err) {  
      return console.log(err);  
   } else {  
      console.log(info);  
   }  
});  