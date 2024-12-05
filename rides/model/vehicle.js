const User = require('../../authentication/src/models/Schema');
const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }, // link to the driver
    vehicleType: {
        type: String
    },
    dateTime: {
        type: Date
    },
    availableSeats: {
        type: Number, 
        default: 0 
    } // Seats available for passengers
  });

  const Vehicle = mongoose.model('Vehicle', vehicleSchema);
  module.exports = Vehicle;
  