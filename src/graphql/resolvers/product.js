// src/graphql/product.js
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import pool from '../../db.js';
import { authenticateGraphQL } from '../../auth.js';

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    ProductID: { type: GraphQLID },
    ProductName: { type: GraphQLString },
    SKU: { type: GraphQLString },
    Cost: { type: GraphQLFloat },
    Price: { type: GraphQLFloat },
    CategoryID: { type: GraphQLID },
    ProductDescription: { type: GraphQLString },
    Quantity: { type: GraphQLFloat },
    SupplierID: { type: GraphQLID },
  }),
});

const ProductQuery = {
  product: {
    type: ProductType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Product WHERE ProductID = ?', [args.id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  products: {
    type: new GraphQLList(ProductType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Product', (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    },
  },
};

const ProductMutation = {
  addProduct: {
    type: ProductType,
    args: {
      ProductName: { type: new GraphQLNonNull(GraphQLString) },
      SKU: { type: new GraphQLNonNull(GraphQLString) },
      Cost: { type: new GraphQLNonNull(GraphQLFloat) },
      Price: { type: new GraphQLNonNull(GraphQLFloat) },
      CategoryID: { type: new GraphQLNonNull(GraphQLID) },
      ProductDescription: { type: new GraphQLNonNull(GraphQLString) },
      Quantity: { type: new GraphQLNonNull(GraphQLFloat) },
      SupplierID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO Product (ProductName, SKU, Cost, Price, CategoryID, ProductDescription, Quantity, SupplierID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [args.ProductName, args.SKU, args.Cost, args.Price, args.CategoryID, args.ProductDescription, args.Quantity, args.SupplierID],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const newProductID = result.insertId;
              pool.query('SELECT * FROM Product WHERE ProductID = ?', [newProductID], (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results[0]);
                }
              });
            }
          }
        );
      });
    },
  },
  updateProduct: {
    type: ProductType,
    args: {
      ProductID: { type: new GraphQLNonNull(GraphQLID) },
      ProductName: { type: GraphQLString },
      SKU: { type: GraphQLString },
      Cost: { type: GraphQLFloat },
      Price: { type: GraphQLFloat },
      CategoryID: { type: GraphQLID },
      ProductDescription: { type: GraphQLString },
      Quantity: { type: GraphQLFloat },
      SupplierID: { type: GraphQLID },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { ProductID, ...updatedFields } = args;
      const updateQuery = Object.entries(updatedFields)
        .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
        .filter(Boolean)
        .join(', ');

      if (!updateQuery) {
        throw new Error('No fields to update.');
      }

      const values = Object.values(updatedFields).filter((value) => value !== undefined);

      return new Promise((resolve, reject) => {
        pool.query(`UPDATE Product SET ${updateQuery} WHERE ProductID = ?`, [...values, ProductID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            pool.query('SELECT * FROM Product WHERE ProductID = ?', [ProductID], (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results[0]);
              }
            });
          }
        });
      });
    },
  },
  deleteProduct: {
    type: ProductType,
    args: {
      ProductID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { ProductID } = args;

      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Product WHERE ProductID = ?', [ProductID], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const productToDelete = results[0];
            pool.query('DELETE FROM Product WHERE ProductID = ?', [ProductID], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(productToDelete);
              }
            });
          }
        });
      });
    },
  },
};

export { ProductType, ProductQuery, ProductMutation };
