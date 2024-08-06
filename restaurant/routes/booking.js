const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { db } = require('../config'); 
const authenticateToken = require('../middleware/auth');

const connection = mysql.createConnection(db);

router.post('/dining-place/book', authenticateToken, (req, res) => {
    const { place_id, start_time, end_time } = req.body;

    if (!place_id || !start_time || !end_time) {
        return res.status(400).json({ error: 'place_id, start_time, end_time, and user_id are required' });
    }

    const user_id = req.user.id; 

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
                res.status(200).json({ message: `Booking confirmed at ${place.name}` });
            } else {
                res.status(400).json({ error: 'Requested slot is not available' });
            }
        }
    );
});


module.exports = router;
