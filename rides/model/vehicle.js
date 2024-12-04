const User = require('../../authentication/src/models/Schema');
const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }, // link to the driver
    vehicleType: String,
    capacity: Number,
    from: {
        type: String, 
        enum: ['AKGEC', 'Govindpuram', 'Sector 62', 'Lal Kuan'], 
        required: true 
    },
    to: {
        type: String, 
        enum: ['AKGEC', 'Govindpuram', 'Sector 62', 'Lal Kuan'], 
        required: true 
    },
    dateTime: Date,
    availableSeats: {
        type: Number, 
        default: 0 
    } // Seats available for passengers
  });

  const Vehicle = mongoose.model('Vehicle', vehicleSchema);
  module.exports = Vehicle;
  