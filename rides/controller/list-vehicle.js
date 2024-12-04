const express = require('express');
const app = express();
const Vehicle = require('../model/vehicle');

// Route to list a vehicle
app.post('/list-vehicle', async (req, res) => {
    const { vehicleType, capacity, from, to, dateTime, availableSeats, userId } = req.body;
  
    try {
      const vehicle = new Vehicle({
        driver: userId,
        vehicleType,
        capacity,
        from,
        to,
        dateTime,
        availableSeats
      });
  
      await vehicle.save();
      res.status(201).json({ message: 'Vehicle listed successfully', vehicle });
    } catch (error) {
      res.status(500).json({ message: 'Error listing vehicle' });
    }
  });