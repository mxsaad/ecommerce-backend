// /src/controllers/homeAddressController.js
import express from 'express';
import db from '../../db.js';

const router = express.Router();

// Get all home addresses
router.get('/home-addresses', (req, res) => {
  db.query('SELECT * FROM HomeAddress', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Get home address by ID
router.get('/home-addresses/:id', (req, res) => {
  const addressID = req.params.id;

  db.query('SELECT * FROM HomeAddress WHERE AddressID = ?', [addressID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Home address not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Add a new home address
router.post('/home-addresses', (req, res) => {
  const { CustomerID, Line1, Line2, City, PostalCode, Country } = req.body;

  const query = 'INSERT INTO HomeAddress (CustomerID, Line1, Line2, City, PostalCode, Country) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [CustomerID, Line1, Line2, City, PostalCode, Country];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Home address added successfully', addressID: results.insertId });
  });
});

// Update home address by ID
router.put('/home-addresses/:id', (req, res) => {
  const addressID = req.params.id;
  const { CustomerID, Line1, Line2, City, PostalCode, Country } = req.body;

  const query = 'UPDATE HomeAddress SET CustomerID=?, Line1=?, Line2=?, City=?, PostalCode=?, Country=? WHERE AddressID=?';
  const values = [CustomerID, Line1, Line2, City, PostalCode, Country, addressID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Home address not found' });
      return;
    }

    res.json({ message: 'Home address updated successfully' });
  });
});

// Delete home address by ID
router.delete('/home-addresses/:id', (req, res) => {
  const addressID = req.params.id;

  db.query('DELETE FROM HomeAddress WHERE AddressID = ?', [addressID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Home address not found' });
      return;
    }

    res.json({ message: 'Home address deleted successfully' });
  });
});

export default router;