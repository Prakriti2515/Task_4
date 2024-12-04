const express = require('express');
const app = express();
const Vehicle = require('../model/vehicle');

// Route to search available vehicles
app.get('/search', async (req, res) => {
    const { from, to } = req.query; // Assume these are provided by the passenger
  
    try {
      // Find available vehicles based on selected locations and available seats
      const vehicles = await Vehicle.find({
        from,
        to,
        availableSeats: { $gt: 0 } // Only vehicles with available seats
      });
  
      res.json({ vehicles });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vehicles' });
    }
  });