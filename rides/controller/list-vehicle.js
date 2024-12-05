const rides = require('../model/ride_schema');

// Route to list a vehicle
const list_vehicle = async (req, res) => {
  const {userId} = req.params;  
  const {from, to, dateTime, availableSeats} = req.body;
  
    try {
      const ride = new rides({
        driver: userId,
        from,
        to,
        dateTime,
        availableSeats
      });
  
      await ride.save();
      res.status(201).json({ message: 'Vehicle listed successfully', vehicle });
    } catch (error) {
      res.status(500).json({ message: 'Error listing vehicle' });
    }
  };

  module.exports = list_vehicle;