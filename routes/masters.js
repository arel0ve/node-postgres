const express = require('express');
const router = express.Router();

const db = require('../queries/masters');

router.get('/', db.getAllMasters);
router.get('/master/:id', db.getOneMaster);
router.get('/by-pups/', db.getMastersByPuppies);
router.post('/', db.createMaster);
router.delete('/:id', db.removeMasters);

module.exports = router;
