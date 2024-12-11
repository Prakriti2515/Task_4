const express = require('express');
const router = express.Router(); //for handling and managing different routes
const app =express();
app.use(express.json());

const search = require('../controller/search');
const list_vehicle = require('../controller/list-vehicle');
const book_seat = require('../controller/book-seat');
const vehicle_details = require('../controller/vehicle-details');

router.post('/list_vehicle/:userId', list_vehicle);
router.post('/vehicle_details/:userId', vehicle_details);
router.post('/search', search);
router.post('/book', book_seat);

module.exports = router;