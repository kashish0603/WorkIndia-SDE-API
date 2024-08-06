const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (token == null) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        console.log('Decoded User:', user); 
        req.user = user; 
        next();
    });
}

module.exports = authenticateToken;
