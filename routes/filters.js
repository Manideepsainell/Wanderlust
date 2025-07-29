const express = require('express');
const router = express.Router();
const filtersController = require('../controllers/filtersController');

router.get('/:category', filtersController.filterByCategory);

module.exports = router;
