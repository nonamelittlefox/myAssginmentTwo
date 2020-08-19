const express = require('express');
const router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://aLazyFox:112113viet@assignmenttwo.hq8ya.mongodb.net/test";


router.get('/', async(req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    let result = await dbo.collection("Products").find({}).toArray();
    res.render('product/productDetail', { model: result });
});

module.exports = router;