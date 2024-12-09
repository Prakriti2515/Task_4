const User = require('../../authentication/src/models/Schema');
const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }, // link to the driver
    vehicleType: {
        type: String
    },
    vehicleModel: {
        type: String
    },
    number_plate: {
        type: String, 
    },
    yearOfPurchase: {
        type: String
    }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
  