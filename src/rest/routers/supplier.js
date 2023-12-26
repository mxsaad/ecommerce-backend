// /src/controllers/supplierController.js
import express from 'express';
import db from '../../db.js';

const router = express.Router();

// Get all suppliers
router.get('/suppliers', (req, res) => {
  db.query('SELECT * FROM Supplier', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Get supplier by ID
router.get('/suppliers/:id', (req, res) => {
  const supplierID = req.params.id;

  db.query('SELECT * FROM Supplier WHERE SupplierID = ?', [supplierID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Add a new supplier
router.post('/suppliers', (req, res) => {
  const { SupplierName, Email, Phone } = req.body;

  const query = 'INSERT INTO Supplier (SupplierName, Email, Phone) VALUES (?, ?, ?)';
  const values = [SupplierName, Email, Phone];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Supplier added successfully', supplierID: results.insertId });
  });
});

// Update supplier by ID
router.put('/suppliers/:id', (req, res) => {
  const supplierID = req.params.id;
  const { SupplierName, Email, Phone } = req.body;

  const query = 'UPDATE Supplier SET SupplierName=?, Email=?, Phone=? WHERE SupplierID=?';
  const values = [SupplierName, Email, Phone, supplierID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    res.json({ message: 'Supplier updated successfully' });
  });
});

// Delete supplier by ID
router.delete('/suppliers/:id', (req, res) => {
  const supplierID = req.params.id;

  db.query('DELETE FROM Supplier WHERE SupplierID = ?', [supplierID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    res.json({ message: 'Supplier deleted successfully' });
  });
});

export default router;