const express = require('express');
const app = express();
const userRoutes = require('../routes/user');
const diningRoutes = require('../routes/dining');

const bookingRoutes = require('../routes/booking');

app.use(express.json()); 
app.use('/api', userRoutes);
app.use('/api', diningRoutes);
app.use('/api', bookingRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});