// /src/controllers/productController.js
import express from 'express';
import db from '../../db.js';

const router = express.Router();

// Get all products
router.get('/products', (req, res) => {
  db.query('SELECT * FROM Product', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Get product by ID
router.get('/products/:id', (req, res) => {
  const productID = req.params.id;

  db.query('SELECT * FROM Product WHERE ProductID = ?', [productID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Add a new product
router.post('/products', (req, res) => {
  const { ProductName, SKU, Cost, Price, CategoryID, ProductDescription, Quantity, SupplierID } = req.body;

  const query = 'INSERT INTO Product (ProductName, SKU, Cost, Price, CategoryID, ProductDescription, Quantity, SupplierID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [ProductName, SKU, Cost, Price, CategoryID, ProductDescription, Quantity, SupplierID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Product added successfully', productID: results.insertId });
  });
});

// Update product by ID
router.put('/products/:id', (req, res) => {
  const productID = req.params.id;
  const { ProductName, SKU, Cost, Price, CategoryID, ProductDescription, Quantity, SupplierID } = req.body;

  const query = 'UPDATE Product SET ProductName=?, SKU=?, Cost=?, Price=?, CategoryID=?, ProductDescription=?, Quantity=?, SupplierID=? WHERE ProductID=?';
  const values = [ProductName, SKU, Cost, Price, CategoryID, ProductDescription, Quantity, SupplierID, productID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product updated successfully' });
  });
});

// Delete product by ID
router.delete('/products/:id', (req, res) => {
  const productID = req.params.id;

  db.query('DELETE FROM Product WHERE ProductID = ?', [productID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  });
});

export default router;