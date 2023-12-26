// /src/app.js
import express from 'express';
import bodyParser from 'body-parser';

import adminController from './controllers/adminController.js';
import cartController from './controllers/cartController.js';
import categoryController from './controllers/categoryController.js';
import customerController from './controllers/customerController.js';
import discountController from './controllers/discountController.js';
import homeAddressController from './controllers/homeAddressController.js';
import onlineOrderController from './controllers/onlineOrderController.js';
import paymentController from './controllers/paymentController.js';
import productController from './controllers/productController.js';
import supplierController from './controllers/supplierController.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Include controllers
app.use('/api', adminController);
app.use('/api', cartController);
app.use('/api', categoryController);
app.use('/api', customerController);
app.use('/api', discountController);
app.use('/api', homeAddressController);
app.use('/api', onlineOrderController);
app.use('/api', paymentController);
app.use('/api', productController);
app.use('/api', supplierController);

app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});
