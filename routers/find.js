const { query } = require('express');
const express = require('express')
const router = express.Router();
var PouchDB = require('pouchdb');
var db = new PouchDB("socute")
var schema = require('../schema')
db.setSchema(schema)

// tìm kiếm thông tin khách hàng theo id (ví dụ khách hàng có customer = 1010)
router.get('/infoCus', async(req, res) => {
    db.rel.find('customer', 1010).then((data) => {
        res.send(data)
    })
}) 

// tìm tổng số order của khách hàng
router.get('/totalOrder', async (req, res) => {
    var customerName = req.query.name
    var resultForm = {}
    await db.find({
        selector:{
            'data.customerName': customerName
        }
    }).then(async (datas) => {
        var listOrder = []
        for(let i = 0; i < datas.docs.length; i++){
            let idObj = db.rel.parseDocID(datas.docs[i]._id);

            await db.find({
                selector:{
                    'data.customer': {$eq: idObj.id} 
                },
            }).then((orderData) => {
                var tempForm = {
                    numberOfOrder: orderData.docs.length,
                    customer_name: datas.docs[i].data.customerName
                }
                listOrder.push(tempForm)
            })
        }
        resultForm['total_valid_customer'] = listOrder.length
        resultForm['customer'] = listOrder
    })
    console.log(resultForm)
    res.send(resultForm)
})
// Tìm kiếm những cuốn sách có tên "The Lord of The Rings"
router.get('/search_book', async (req, res) => {
    db.createIndex({
        index: {fields: ['title']}
      }).then(async function () {
        const data = db.find({
            selector: { title: { $eq: 'The Lord of The Rings' } }
        }).then((data) =>{
            console.log(data)
            res.send(data)
        })
      })
    })

// tìm tổng số quantityOrdered của customer
router.get("/totalOfItems", async (req,res) => {
    var customerName = req.query.name
    db.find({
        selector: {
            'data.customerName' : customerName
        }
    }).then(async (cusData) => {
        var customerDetail = []
        
        for(let i = 0; i < cusData.docs.length; i++){
            let cusIdJson = db.rel.parseDocID(cusData.docs[i]._id);
            var totalOrder = 0;
            await db.find({
                selector: {
                    'data.customer': cusIdJson.id
                }
            }).then(async (orderData) => {
                for(let i = 0; i < orderData.docs.length; i++){
                    var orderDetailIdJson = db.rel.parseDocID(orderData.docs[i]._id);
                    var orderDetailId= db.rel.makeDocID({ 
                        "type": "orderdetail", 
                        "id": orderDetailIdJson.id
                    });

                    await db.get(orderDetailId).then((orderDetailData) => {
                        totalOrder += orderDetailData.data.quantityOrdered
                    })
                }

                var temp = {
                    customerName: cusData.docs[i].data.customeName,
                    total_quantity_order: totalOrder
                }
                customerDetail.push(temp)
            })
        }

        res.send(customerDetail)
    })
})

module.exports = router