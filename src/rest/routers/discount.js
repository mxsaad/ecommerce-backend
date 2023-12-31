// /src/controllers/discountController.js
import express from 'express';
import db from '../../db.js';
import { authenticate } from '../../auth.js';

const router = express.Router();

// Get all discounts
router.get('/discounts', (req, res) => {
  db.query('SELECT * FROM Discount', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Get discount by ID
router.get('/discounts/:id', (req, res) => {
  const discountID = req.params.id;

  db.query('SELECT * FROM Discount WHERE DiscountID = ?', [discountID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Discount not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Add a new discount
router.post('/discounts', authenticate, (req, res) => {
  const { DiscountName, DiscountDescription, Active, Percent } = req.body;

  const query = 'INSERT INTO Discount (DiscountName, DiscountDescription, Active, Percent) VALUES (?, ?, ?, ?)';
  const values = [DiscountName, DiscountDescription, Active, Percent];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Discount added successfully', discountID: results.insertId });
  });
});

// Update discount by ID
router.put('/discounts/:id', authenticate, (req, res) => {
  const discountID = req.params.id;
  const { DiscountName, DiscountDescription, Active, Percent } = req.body;

  const query = 'UPDATE Discount SET DiscountName=?, DiscountDescription=?, Active=?, Percent=? WHERE DiscountID=?';
  const values = [DiscountName, DiscountDescription, Active, Percent, discountID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Discount not found' });
      return;
    }

    res.json({ message: 'Discount updated successfully' });
  });
});

// Delete discount by ID
router.delete('/discounts/:id', authenticate, (req, res) => {
  const discountID = req.params.id;

  db.query('DELETE FROM Discount WHERE DiscountID = ?', [discountID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Discount not found' });
      return;
    }

    res.json({ message: 'Discount deleted successfully' });
  });
});

export default router;