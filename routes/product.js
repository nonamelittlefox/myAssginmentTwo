const express = require('express');
const router = express.Router();

// Load Model


// Test
router.get('/', (req, res) => {
    res.send('This is product routers');;
});

module.exports = router;