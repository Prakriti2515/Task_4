const express = require('express');
const app = express();
const Vehicle = require('../model/vehicle');

// Route to book a seat
app.post('/book', async (req, res) => {
    const { vehicleId, userId } = req.body; // vehicleId and userId should be sent by the frontend
  
    try {
      // Find the vehicle
      const vehicle = await Vehicle.findById(vehicleId);
  
      // Check if seats are available
      if (vehicle.availableSeats > 0) {
        // Decrease available seats by 1
        vehicle.availableSeats -= 1;
        await vehicle.save();
  
        res.json({ message: 'Seat booked successfully', vehicle });
      } else {
        res.status(400).json({ message: 'No available seats' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error booking seat' });
    }
  });
  