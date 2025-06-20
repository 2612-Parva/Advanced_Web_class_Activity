const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProducts } = require('../controllers/productController');

router.get('/', auth, getProducts);

module.exports = router;
