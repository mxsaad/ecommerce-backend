// /src/controllers/onlineOrderController.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all online orders
router.get('/online-orders', (req, res) => {
  db.query('SELECT * FROM OnlineOrder', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Get online order by ID
router.get('/online-orders/:id', (req, res) => {
  const orderID = req.params.id;

  db.query('SELECT * FROM OnlineOrder WHERE OrderID = ?', [orderID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Online order not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Add a new online order
router.post('/online-orders', (req, res) => {
  const { CustomerID, PaymentID, AddressID, DiscountID, Total, OrderDate, OrderTime } = req.body;

  const query = 'INSERT INTO OnlineOrder (CustomerID, PaymentID, AddressID, DiscountID, Total, OrderDate, OrderTime) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [CustomerID, PaymentID, AddressID, DiscountID, Total, OrderDate, OrderTime];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Online order added successfully', orderID: results.insertId });
  });
});

// Update online order by ID
router.put('/online-orders/:id', (req, res) => {
  const orderID = req.params.id;
  const { CustomerID, PaymentID, AddressID, DiscountID, Total, OrderDate, OrderTime } = req.body;

  const query = 'UPDATE OnlineOrder SET CustomerID=?, PaymentID=?, AddressID=?, DiscountID=?, Total=?, OrderDate=?, OrderTime=? WHERE OrderID=?';
  const values = [CustomerID, PaymentID, AddressID, DiscountID, Total, OrderDate, OrderTime, orderID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Online order not found' });
      return;
    }

    res.json({ message: 'Online order updated successfully' });
  });
});

// Delete online order by ID
router.delete('/online-orders/:id', (req, res) => {
  const orderID = req.params.id;

  db.query('DELETE FROM OnlineOrder WHERE OrderID = ?', [orderID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Online order not found' });
      return;
    }

    res.json({ message: 'Online order deleted successfully' });
  });
});

export default router;