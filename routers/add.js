const express = require('express')
const router = express.Router();
var PouchDB = require('pouchdb');
var db = new PouchDB("socute")
var faker = require('faker')
var schema = require('../schema')
db.setSchema(schema)

// thêm nhiều khách hàng
router.get('/customerBulk', async (req, res) => {
    const numberToAdd = Math.pow(10, 6)
    for(let i = 1; i < numberToAdd; i++){    
        await db.rel.save('customer', {
          customerNumber: 1000000+i,
          customerName: faker.name.firstName() + " " + faker.name.lastName()
        })
     }
      res.send("success")
})
module.exports = router