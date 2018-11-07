const express = require('express');
const router = express.Router();

const db = require('../queries/puppies');

router.get('/', db.getAllPuppies);
router.get('/puppy/:id', db.getSinglePuppy);
router.post('', db.createPuppy);
router.put('/:id', db.updatePuppy);
router.delete('/:id', db.removePuppy);

router.post('/to-kittens/:id', db.moveToKittens);
router.get('/kittens', db.getKittens);

module.exports = router;
