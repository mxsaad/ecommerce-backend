// /src/controllers/paymentController.js
import express from 'express';
import db from '../../db.js';
import { authenticate } from '../../auth.js';

const router = express.Router();

// Get all payments
router.get('/payments', (req, res) => {
  db.query('SELECT * FROM Payment', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Get payment by ID
router.get('/payments/:id', (req, res) => {
  const paymentID = req.params.id;

  db.query('SELECT * FROM Payment WHERE PaymentID = ?', [paymentID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Add a new payment
router.post('/payments', authenticate, (req, res) => {
  const { CustomerID, Brand, CardNumber, ExpirationDate, FirstName, LastName, SecurityCode } = req.body;

  const query = 'INSERT INTO Payment (CustomerID, Brand, CardNumber, ExpirationDate, FirstName, LastName, SecurityCode) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [CustomerID, Brand, CardNumber, ExpirationDate, FirstName, LastName, SecurityCode];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Payment added successfully', paymentID: results.insertId });
  });
});

// Update payment by ID
router.put('/payments/:id', authenticate, (req, res) => {
  const paymentID = req.params.id;
  const { CustomerID, Brand, CardNumber, ExpirationDate, FirstName, LastName, SecurityCode } = req.body;

  const query = 'UPDATE Payment SET CustomerID=?, Brand=?, CardNumber=?, ExpirationDate=?, FirstName=?, LastName=?, SecurityCode=? WHERE PaymentID=?';
  const values = [CustomerID, Brand, CardNumber, ExpirationDate, FirstName, LastName, SecurityCode, paymentID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json({ message: 'Payment updated successfully' });
  });
});

// Delete payment by ID
router.delete('/payments/:id', authenticate, (req, res) => {
  const paymentID = req.params.id;

  db.query('DELETE FROM Payment WHERE PaymentID = ?', [paymentID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json({ message: 'Payment deleted successfully' });
  });
});

export default router;