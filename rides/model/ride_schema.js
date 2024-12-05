const User = require('../../authentication/src/models/Schema');
const mongoose = require('mongoose');
const rides = new mongoose.Schema({
    driver:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User', //reference to the user model
        required : true
    },
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
    travelDate: {
        type: Date
    },
    travelTime:{
        type: String
    },
    availableSeats: {
        type: Number, 
        default: 0 
    } // Seats available for passengers
  });

  const offer_ride = mongoose.model('offer_ride', rides);
  module.exports = offer_ride;
  