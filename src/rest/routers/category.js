// /src/controllers/categoryController.js
import express from 'express';
import db from '../../db.js';
import { authenticate } from '../../auth.js';

const router = express.Router();

// Get all categories
router.get('/categories', (req, res) => {
  db.query('SELECT * FROM Category', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Get category by ID
router.get('/categories/:id', (req, res) => {
  const categoryID = req.params.id;

  db.query('SELECT * FROM Category WHERE CategoryID = ?', [categoryID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Add a new category
router.post('/categories', authenticate, (req, res) => {
  const { CategoryName, CategoryDescription } = req.body;

  const query = 'INSERT INTO Category (CategoryName, CategoryDescription) VALUES (?, ?)';
  const values = [CategoryName, CategoryDescription];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Category added successfully', categoryID: results.insertId });
  });
});

// Update category by ID
router.put('/categories/:id', authenticate, (req, res) => {
  const categoryID = req.params.id;
  const { CategoryName, CategoryDescription } = req.body;

  const query = 'UPDATE Category SET CategoryName=?, CategoryDescription=? WHERE CategoryID=?';
  const values = [CategoryName, CategoryDescription, categoryID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({ message: 'Category updated successfully' });
  });
});

// Delete category by ID
router.delete('/categories/:id', authenticate, (req, res) => {
  const categoryID = req.params.id;

  db.query('DELETE FROM Category WHERE CategoryID = ?', [categoryID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({ message: 'Category deleted successfully' });
  });
});

export default router;