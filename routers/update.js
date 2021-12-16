const express = require('express')
const router = express.Router();
var PouchDB = require('pouchdb');
var db = new PouchDB("socute")

var schema = require('../schema')
db.setSchema(schema)

//cập nhật thông tin chi tiết đơn hàng
router.get('/orderdetail', async (req, res) => {
    await db.allDocs({startkey: 'add', endkey: 'add_\uffff'}).then(async(data) => {
        return data.rows.map(row => {
            return { _id: row.id, _rev: row.value.rev, 'data.customerName': "updated"};
        })
    })
    console.log("success");
    res.send("success")
})

// router.get('/updateOrder', async(req, res) => {
//     db.rel.find('orderdetail',{startkey: 1, limit: 2}).then((data) => {
//         var docs = data.rows.map(
//             function(row) {
//                 var doc= row.doc
//                 doc.quantityOrdered = 100
//             }
//         )
//         console.table(docs)
//         res.send("OK")
//     }).then(function() {
//         console.log(err)
//     })

// })
module.exports = router