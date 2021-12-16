const express = require('express')
const router = express.Router()
var PouchDB = require('pouchdb')
var db = new PouchDB("socute")
const ObjToCsv = require('objects-to-csv')

var schema = require('../schema')
db.setSchema(schema)
var faker = require('faker')
const { keys } = require('../schema')
numberOfBook = 100000
numberOfCustomer = 1000000
numberOfOrder = 10000000
numberOfOrderdetail = 30000000

// import book data from the book.csv file to db
router.get('/createBook', async (req, res) => {  
  db.setSchema(schema)
    const csvFilePath='./book.csv'
    const csv=require('csvtojson')
    const jsonArray=await csv().fromFile(csvFilePath);
    for(let i = 0; i < numberOfBook; i++) {
      var book = {}
      
      book['bookID'] = i + 1,
      book['title'] = jsonArray[i].title
      book['author'] = jsonArray[i].author
      
      await db.rel.save('book', {
        id: i + 1,
        title: book['title'],
        author: book['author'],
      })
      book = null;
    }

    res.send("The request succeeded.")
})

// generate customer data and save it to db
router.get('/createCustomer', async (req, res) => {
  for(let i = 0; i < numberOfCustomer; i++){
    customer = {}
    customer['customerNumber'] = i + 1
    customer['customerName'] = faker.name.firstName() + " " + faker.name.lastName()

    await db.rel.save('customer', {
      id: i + 1,
      customerName: customer['customerName'],
    })
  }
  res.send("The request succeeded.")
})

// generate order data and save it to db
router.get('/createOrder', async (req, res) => {
  for(let i = 0; i < numberOfOrder; i++) {
    var order = {}
    order['customerNumber'] = faker.datatype.number({
      min: 1,
      max: numberOfCustomer
    })
    order['orderNumber'] = i + 1

    await db.rel.save('order', {
      id: i + 1,
      customer: order['customerNumber']
    })
  }
  res.send("The request succeeded.")
})

// generate orderdetail data and save it to db
router.get('/createOrderdetail', async (req, res) => {
  for(let i = 0; i < numberOfOrderdetail; i++){
    var orderdetails = {}
    orderdetails['orderNumber'] = i + 1,
    orderdetails['bookID'] = faker.datatype.number({
      min: 1,
      max: numberOfBook
    })
    orderdetails['quantityOrdered'] = faker.datatype.number({
      min: 1,
      max: 100
    })
    await db.rel.save('orderdetail', {
      id: i + 1,
      order: orderdetails['orderNumber'],
      book: orderdetails['bookID'],
      quantityOrdered: orderdetails['quantityOrdered']
    })

    orderdetails = null
  }

  res.send('The request succeeded.')
})


// import data into customer.csv
router.get('/customerToCSV', async(req, res) => {
  const range = 1000
  for(let i = 1; i <= numberOfCustomer / range; i++) {
    var start = range * (i - 1) + 1
    var end = range * i
    var list = []
    
    await db.rel.find('customer', {
      startkey:start,
      limit: range
    }).then(async (data) => {
      for(let m = 0; m < range; m++){
        var newForm = {
          customerNumber: data.customers[m].id,
          customerName: data.customers[m].customerName
        }
        list.push(newForm)
      }
      const csv = new ObjToCsv(list);
      await csv.toDisk('./customer.csv', { append: true });
      
    })
    
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`approximately ${Math.round(used * 100) / 100} MB`);
  }
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`finish ${Math.round(used * 100) / 100} MB`);
  res.send('The request succeeded.')
})

// import data into order.csv file
router.get('/orderToCSV', async(req, res) => {
  const range = 1000
  for(let i = 1; i <= numberOfOrder / range; i++) {
    var start = range * (i - 1) + 1
    var end = range * i
    var list = []
    
    await db.rel.find('order', {
      startkey:start,
      limit: range
    }).then(async (data) => {
      for(let m = 0; m < range; m++){
        
        var newForm = {
          orderNumber: data.orders[m].id,
          customerNumber: data.orders[m].customer
        }
        list.push(newForm)
      }
      console.log(i)
      const csv = new ObjToCsv(list);
      await csv.toDisk('./order.csv', { append: true });
      
    })
    
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`approximately ${Math.round(used * 100) / 100} MB`);
  }
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`finish ${Math.round(used * 100) / 100} MB`);
  res.send('The request succeeded.')
})

//import data into orderdetail.csv file
router.get('/orderdetailToCSV', async(req, res) => {
  const range = 1000
  for(let i = 1; i <= numberOfOrderdetail / range; i++) {
    var start = range * (i - 1) + 1
    var end = range * i
    var list = []
    
    await db.rel.find('orderdetail', {
      startkey:start,
      limit: range
    }).then(async (data) => {
      for(let m = 0; m < range; m++){
        var newForm = {
          orderNumber: data.orderdetails[m].order,
          bookID: data.orderdetails[m].book,
          quantityOrdered: data.orderdetails[m].quantityOrdered
        }
        list.push(newForm)
      }
      const csv = new ObjToCsv(list);
      await csv.toDisk('./orderdetail.csv', { append: true });
      
    })
    console.log(i)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`approximately ${Math.round(used * 100) / 100} MB`);
  }
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`finish ${Math.round(used * 100) / 100} MB`);
  res.send('The request succeeded.')
})

module.exports = router 