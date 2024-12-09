const rides = require('../model/ride_schema');

// Route to list a vehicle
const list_vehicle = async (req, res) => {
  const {userId} = req.params;  
  const {from, to, travelDate, travelTime, availableSeats} = req.body;
  
    try {
      const ride = new rides({
        driver: userId,
        from,
        to,
        travelDate,
        travelTime,
        availableSeats
      });
  
      await ride.save();
      console.log(`Vehicle listed: ${ride}`);
      res.status(201).json({ message: 'Vehicle listed successfully', ride});
    } 
    catch (error) {
      res.status(500).json({ message: 'Error listing vehicle' });
    }
  };

  module.exports = list_vehicle;