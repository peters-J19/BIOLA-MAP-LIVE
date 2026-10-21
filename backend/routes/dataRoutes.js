const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT) || 5432,
});

// Route 1: Get all info from aoi_info by aoi_id
// This Query gets full row of data for a building (missing open hours)
router.get('/aoi_info/:aoi_id', async (req, res) => {
  const { aoi_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM aoi_info WHERE aoi_id = $1', [aoi_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching aoi_info:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route 2: Get specific columns from aoi_info (no params needed)
// This query gets entire aoi_id, aoi_name & categori_id columns from table aoi_info to be displayed in the directory
router.get('/aoi_directory', async (req, res) => {
  try {
    const result = await pool.query('SELECT aoi_id, aoi_name, category_id FROM aoi_info');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching aoi_directory:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route 3: Get specific columns from aoi_info (no params needed)
// This query gets entire aoi_id, aoi_name, category_id & coordinate columns from table aoi_info to be displayed on the map
router.get('/aoi_app', async (req, res) => {
  try {
    const result = await pool.query('SELECT aoi_id, aoi_name, category_id, coordinate_x, coordinate_y FROM aoi_info');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching aoi_app:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route 4: Get all of category_info (no params needed)
// This query gets entire aoi_id, aoi_name & coordinate columns from table aoi_info to be displayed on the map
router.get('/category_info', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM category_info');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching category_info:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route 5: Get specific day (column) from open_hours by aoi_id
// This query gets the open hours (1 value) based on the aoi_id and current date
router.get('/open_hours_value/:aoi_id', async (req, res) => {
  const { aoi_id } = req.params;
  const { day } = req.query;

  // Whitelist valid days to avoid SQL injection
  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (!validDays.includes(day)) {
    return res.status(400).json({ error: 'Invalid day of the week' });
  }

  const query = `SELECT ${day} FROM open_hours WHERE aoi_id = $1`;

  try {
    const result = await pool.query(query, [aoi_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching open_hours value:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route 6: Get all open_hours for aoi_id
// This query gets all the open hours (full row) for an aoi_id
router.get('/open_hours/:aoi_id', async (req, res) => {
  const { aoi_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM open_hours WHERE aoi_id = $1', [aoi_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching open_hours:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;