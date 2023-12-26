// /src/controllers/cartController.js
import express from 'express';
import db from '../../db.js';

const router = express.Router();

// Get all carts
router.get('/carts', (req, res) => {
  db.query('SELECT * FROM Cart', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Get cart by ID
router.get('/carts/:id', (req, res) => {
  const cartID = req.params.id;

  db.query('SELECT * FROM Cart WHERE CartID = ?', [cartID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Add a new cart
router.post('/carts', (req, res) => {
  const { CustomerID, Total } = req.body;

  const query = 'INSERT INTO Cart (CustomerID, Total) VALUES (?, ?)';
  const values = [CustomerID, Total];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Cart added successfully', cartID: results.insertId });
  });
});

// Update cart by ID
router.put('/carts/:id', (req, res) => {
  const cartID = req.params.id;
  const { CustomerID, Total } = req.body;

  const query = 'UPDATE Cart SET CustomerID=?, Total=? WHERE CartID=?';
  const values = [CustomerID, Total, cartID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    res.json({ message: 'Cart updated successfully' });
  });
});

// Delete cart by ID
router.delete('/carts/:id', (req, res) => {
  const cartID = req.params.id;

  db.query('DELETE FROM Cart WHERE CartID = ?', [cartID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    res.json({ message: 'Cart deleted successfully' });
  });
});

export default router;