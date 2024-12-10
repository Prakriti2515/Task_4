const vehicle = require('../model/vehicle');

// Route to list a vehicle
const vehicle_details = async (req, res) => {
  const {userId} = req.params;  
  const {vehicleType, vehicleModel, number_plate, yearOfPurchase} = req.body;
  
    try {
      const ride = new vehicle({
        driver: userId,
        vehicleType,
        vehicleModel,
        number_plate,
        yearOfPurchase
      });
  
      await ride.save();
      console.log(`Vehicle details: ${ride}`);
      res.status(201).json({ message: 'Vehicle details saved successfully', ride});
    } 
    catch (error) {
      res.status(500).json({ message: 'Error saving vehicle details'});
    }
  };

  module.exports = vehicle_details;