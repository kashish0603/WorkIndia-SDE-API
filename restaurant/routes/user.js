const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { db } = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config');

const connection = mysql.createConnection(db);

router.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Insert user into the database
        connection.query(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email],
            (error, results) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                res.status(201).json({
                    status: 'Account successfully created',
                    status_code: 201,
                    user_id: results.insertId
                });
            }
        );
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Fetch user from database
    connection.query(
        'SELECT id, username, password FROM users WHERE username = ?',
        [username],
        (error, results) => {
            if (error) return res.status(500).json({ error: error.message });
            if (results.length === 0) {
                return res.status(401).json({
                    status: 'Incorrect username/password provided. Please retry',
                    status_code: 401
                });
            }

            const user = results[0];

            // Compare hashed password with the provided password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return res.status(500).json({ error: err.message });
                if (!isMatch) {
                    return res.status(401).json({
                        status: 'Incorrect username/password provided. Please retry',
                        status_code: 401
                    });
                }

                // Generate JWT token
                const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({
                    status: 'Login successful',
                    status_code: 200,
                    user_id: user.id,
                    access_token: token 
                });
            });
        }
    );
});

module.exports = router;
