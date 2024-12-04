const express = require('express');
const router = express.Router(); //for handling and managing different routes

const search = require('../controller/search');
router.get('/search', search);

const list_vehicle = require('../controller/list-vehicle');
router.post('/list_vehicle', list_vehicle);

const book_seat = require('../controller/book-seat');
router.post('/book', book_seat);

