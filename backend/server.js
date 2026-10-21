const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
const dataRoutes = require('./routes/dataRoutes');
app.use('/', dataRoutes);

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});