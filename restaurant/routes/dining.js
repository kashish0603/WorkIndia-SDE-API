const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { db, adminApiKey } = require('../config'); // Ensure you have a config file with DB settings

const connection = mysql.createConnection(db);

const checkAdminApiKey = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (apiKey !== adminApiKey) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

router.post('/dining-place/create', checkAdminApiKey, (req, res) => {
  const { name, address, phone_no, website, operational_hours } = req.body;

  if (!name || !address || !phone_no || !website || !operational_hours) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  connection.query(
    'INSERT INTO dining_places (name, address, phone_no, website, operational_hours) VALUES (?, ?, ?, ?, ?)',
    [name, address, phone_no, website, JSON.stringify(operational_hours)],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      res.status(200).json({
        message: ' Dining Place added successfully',
        place_id: results.insertId,
        status_code: 200
      });
    }
  );
});

router.get('/dining-place', (req, res) => {
    const { name } = req.query;
  
    connection.query(
      'SELECT * FROM dining_places WHERE name LIKE ?',
      [`%${name}%`],
      (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ results });
      }
    );
  });

router.get('/dining-place/availability', (req, res) => {
    const { place_id, start_time, end_time } = req.query;
  
    if (!place_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'place_id, start_time, and end_time are required' });
    }
  
    connection.query(
      'SELECT * FROM dining_places WHERE place_id = ?',
      [place_id],
      (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        if (results.length === 0) return res.status(404).json({ error: 'Dining place not found' });
  
        const place = results[0];
        const bookedSlots = JSON.parse(place.booked_slots || '[]');
  
        const isAvailable = !bookedSlots.some(slot => 
          (new Date(slot.start_time) < new Date(end_time) && new Date(slot.end_time) > new Date(start_time))
        );
  
        if (isAvailable) {
          return res.status(200).json({
            place_id: place.id,
            name: place.name,
            phone_no: place.phone_no,
            available: true,
            next_available_slot: null
          });
        } else {
          const nextAvailableSlot = findNextAvailableSlot(start_time, end_time, bookedSlots);
          return res.status(200).json({
            place_id: place.id,
            name: place.name,
            phone_no: place.phone_no,
            available: false,
            next_available_slot: nextAvailableSlot
          });
        }
      }
    );
  });
  
  function findNextAvailableSlot(startTime, endTime, bookedSlots) {
    const allSlots = bookedSlots.map(slot => ({
      start: new Date(slot.start_time),
      end: new Date(slot.end_time)
    }));
  
    const start = new Date(startTime);
    const end = new Date(endTime);
  
    let nextSlotStart = end;
  
    for (const slot of allSlots) {
      if (slot.start > nextSlotStart) {
        return nextSlotStart.toISOString();
      }
      nextSlotStart = new Date(Math.max(nextSlotStart.getTime(), slot.end.getTime()));
    }
  
    return null; 
  }
  
  

module.exports = router;
