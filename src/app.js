// /src/app.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Include controllers
app.use('/api', require('./controllers/adminController'));
app.use('/api', require('./controllers/cartController'));
app.use('/api', require('./controllers/categoryController'));
app.use('/api', require('./controllers/customerController'));
app.use('/api', require('./controllers/discountController'));
app.use('/api', require('./controllers/homeAddressController'));
app.use('/api', require('./controllers/onlineOrderController'));
app.use('/api', require('./controllers/paymentController'));
app.use('/api', require('./controllers/productController'));
app.use('/api', require('./controllers/supplierController'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
