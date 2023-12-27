// /src/controllers/adminController.js
import express from 'express';
import db from '../../db.js';
import { authenticate } from '../../auth.js';

const router = express.Router();

// Get all admins
router.get('/admins', (req, res) => {
  db.query('SELECT * FROM Admin', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Get admin by ID
router.get('/admins/:id', (req, res) => {
  const adminID = req.params.id;

  db.query('SELECT * FROM Admin WHERE AdminID = ?', [adminID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Add a new admin
router.post('/admins', authenticate, (req, res) => {
  const { FirstName, LastName, Username, Passkey, Email, Permissions } = req.body;

  const query = 'INSERT INTO Admin (FirstName, LastName, Username, Passkey, Email, Permissions) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [FirstName, LastName, Username, Passkey, Email, Permissions];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Admin added successfully', adminID: results.insertId });
  });
});

// Update admin by ID
router.put('/admins/:id', authenticate, (req, res) => {
  const adminID = req.params.id;
  const { FirstName, LastName, Username, Passkey, Email, Permissions } = req.body;

  const query = 'UPDATE Admin SET FirstName=?, LastName=?, Username=?, Passkey=?, Email=?, Permissions=? WHERE AdminID=?';
  const values = [FirstName, LastName, Username, Passkey, Email, Permissions, adminID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    res.json({ message: 'Admin updated successfully' });
  });
});

// Delete admin by ID
router.delete('/admins/:id', authenticate, (req, res) => {
  const adminID = req.params.id;

  db.query('DELETE FROM Admin WHERE AdminID = ?', [adminID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    res.json({ message: 'Admin deleted successfully' });
  });
});

export default router;