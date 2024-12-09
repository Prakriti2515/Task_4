const express = require('express');
const router = express.Router(); //for handling and managing different routes

const search = require('../controller/search');
const list_vehicle = require('../controller/list-vehicle');
const book_seat = require('../controller/book-seat');
const choice = require('../controller/user-choice');

router.post('/role-choice/:userId', choice);
router.post('/list_vehicle/:userId', list_vehicle);
router.post('/search', search);
router.post('/book', book_seat);

module.exports = router;