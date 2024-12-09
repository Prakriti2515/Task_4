const io = require('socket.io');
const Vehicle = require('../model/vehicle');

// Route to book a seat
const book_seat = async (req, res) => {
    const { vehicleId, userId } = req.body; // vehicleId and userId should be sent by the frontend
  
    try {
      // Find the vehicle
      const vehicle = await Vehicle.findById(vehicleId);
      console.log("Vehicle: " + vehicle);
  
      // Check if seats are available
      if (vehicle.availableSeats > 0) {
        // Decrease available seats by 1
        vehicle.availableSeats -= 1;
        await vehicle.save();
        
        io.to(vehicleId).emit('seatAvailabilityUpdated', {
          vehicleId: vehicle._id,
          availableSeats: vehicle.availableSeats,
        });

        console.log("Seat booked")
        res.json({ message: 'Seat booked successfully', vehicle });
      } 
      else {
        res.status(400).json({ message: 'No available seats' });
      }
    } 
    catch (error) {
      res.status(500).json({ message: 'Error booking seat' });
    }
  };

  module.exports = book_seat;
  