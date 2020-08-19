var express = require('express');
var router = express.Router();

/* GET insert page. */
router.get('/', function(req, res, next) {
    res.render('product/productInsert', { title: 'productInsert' });
});

module.exports = router;