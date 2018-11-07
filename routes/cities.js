const express = require('express');
const router = express.Router();

const db = require('../queries/cities');

router.get('/', db.getAllCities);
router.delete('/:name', db.safeRemoveCities);

module.exports = router;
