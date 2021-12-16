var PouchDB = require('pouchdb')
var db = new PouchDB("socute")

var schemaData = [
    {
      singular:'customer',
      plural:'customers',
      relations:{
        'orders':  {hasMany: "order"}
      }
    },

    {
      singular:'order',
      plural:"orders",
      relations:{
        'customer': {belongsTo:'customer'},
        'orderdetails':{hasMany:'orderdetail'}
      }
    },

    {
      singular:'orderdetail',
      plural:'orderdetails',
      relations:{
        'order': {belongsTo:'order'},
        'book':{belongsTo: "book"}
      }
    },

    {
      singular:"book",
      plural:"books",
      relations:{
        'orderdetails' : {hasMany:"orderdetail"}
      }
    }
]

module.exports = schemaData