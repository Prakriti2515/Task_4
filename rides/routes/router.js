const express = require('express');
const router = express.Router(); //for handling and managing different routes

const search = require('../controller/search');
const list_vehicle = require('../controller/list-vehicle');
const book_seat = require('../controller/book-seat');

router.post('/role-choice/:userId', async(req, res)=>{
    const choice = req.body;
    if(choice == "driver")
        res.redirect('/list_vehicle/:userId');
    else if(choice == "passenger")
        res.redirect('/search');
});


router.post('/search', search);
router.post('/list_vehicle/:userId', list_vehicle);
router.post('/book', book_seat);

module.exports = router;