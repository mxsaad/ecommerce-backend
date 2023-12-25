// /src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const adminController = require('./controllers/adminController');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Include the Admin controller
app.use('/api', adminController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
