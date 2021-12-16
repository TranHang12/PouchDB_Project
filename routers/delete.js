const express = require('express')
const router = express.Router()
var PouchDB = require('pouchdb')
var db = new PouchDB("socute")

var schema = require('../schema')
db.setSchema(schema)

// xóa tất cả các documents
router.get('/deleteAll', async (req, res) => {
    db.allDocs({include_docs: true}).then(allDocs => {
      return allDocs.rows.map(row => {
        return {_id: row.id, _rev: row.doc._rev, _deleted: true}
      })
    }).then(deleteDocs => {
      return db.bulkDocs(deleteDocs);
    });
    res.send("success delete")
  })

//xóa các bản ghi chi tiết đơn hàng
router.get('/delOrderdetail', async (req, res) => {
  const numberDelete = 1000
  for(let i = 1; i <= numberDelete; i++){
    await db.rel.find('orderdetail', 1).then(async (data) => {
      await db.rel.del('orderdetail', {
        id:data.customers[0].id, 
        rev:data.customers[0].rev
    }).then((result) => res.send(result))
  })
  }
})

module.exports = router