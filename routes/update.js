var express = require('express');
var router = express.Router();

/* GET insert page. */
router.get('/', function(req, res, next) {
    res.render('product/productUpdate', { title: 'productUpdate' });
});

module.exports = router;