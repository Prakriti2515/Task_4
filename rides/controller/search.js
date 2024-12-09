const rides = require('../model/ride_schema');

// Route to search available vehicles
const search = async (req, res) => {
    const { from, to, travelDate, travelTime } = req.body; // Assume these are provided by the passenger
  
    try {
      // Find available vehicles based on selected locations and available seats
      const ride = await rides.find({
        from,
        to,
        travelDate,
        travelTime,
        availableSeats: { $gt: 0 } // Only vehicles with available seats
      });
      
      console.log(`Search: ${ride}`);
      res.json({ message: "Ride searched", ride });
    } 
    catch (error) {
      res.status(500).json({ message: 'Error fetching vehicles' });
    }
  };

  module.exports = search;