// /src/app.js
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { login } from './auth.js';
import dotenv from 'dotenv';

import admin from './rest/routers/admin.js';
import cart from './rest/routers/cart.js';
import category from './rest/routers/category.js';
import customer from './rest/routers/customer.js';
import discount from './rest/routers/discount.js';
import homeAddress from './rest/routers/homeAddress.js';
import onlineOrder from './rest/routers/onlineOrder.js';
import payment from './rest/routers/payment.js';
import product from './rest/routers/product.js';
import supplier from './rest/routers/supplier.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 3000;
dotenv.config();

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Include login route
app.post('/login', login);

// Include REST API routes
app.use('/api',
  admin, 
  cart, 
  category, 
  customer, 
  discount, 
  homeAddress, 
  onlineOrder, 
  payment, 
  product, 
  supplier
);

// Include GraphQL API routes
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});