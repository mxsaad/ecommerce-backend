// /src/controllers/customerController.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all customers
router.get('/customers', (req, res) => {
  db.query('SELECT * FROM Customer', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Get customer by ID
router.get('/customers/:id', (req, res) => {
  const customerID = req.params.id;

  db.query('SELECT * FROM Customer WHERE CustomerID = ?', [customerID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status  (404).json({ error: 'Customer not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Add a new customer
router.post('/customers', (req, res) => {
  const { FirstName, LastName, Username, Passkey, Email, Phone } = req.body;

  const query = 'INSERT INTO Customer (FirstName, LastName, Username, Passkey, Email, Phone) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [FirstName, LastName, Username, Passkey, Email, Phone];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Customer added successfully', customerID: results.insertId });
  });
});

// Update customer by ID
router.put('/customers/:id', (req, res) => {
  const customerID = req.params.id;
  const { FirstName, LastName, Username, Passkey, Email, Phone } = req.body;

  const query = 'UPDATE Customer SET FirstName=?, LastName=?, Username=?, Passkey=?, Email=?, Phone=? WHERE CustomerID=?';
  const values = [FirstName, LastName, Username, Passkey, Email, Phone, customerID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json({ message: 'Customer updated successfully' });
  });
});

// Delete customer by ID
router.delete('/customers/:id', (req, res) => {
  const customerID = req.params.id;

  db.query('DELETE FROM Customer WHERE CustomerID = ?', [customerID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json({ message: 'Customer deleted successfully' });
  });
});

export default router;