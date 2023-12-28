// src/graphql/cart.js
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import pool from '../../db.js';
import { authenticateGraphQL } from '../../auth.js';

const CartType = new GraphQLObjectType({
  name: 'Cart',
  fields: () => ({
    CartID: { type: GraphQLID },
    CustomerID: { type: GraphQLID },
    Total: { type: GraphQLFloat },
  }),
});

const CartQuery = {
  cart: {
    type: CartType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Cart WHERE CartID = ?', [args.id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  carts: {
    type: new GraphQLList(CartType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Cart', (err, results) => {
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

const CartMutation = {
  addCart: {
    type: CartType,
    args: {
      CustomerID: { type: new GraphQLNonNull(GraphQLID) },
      Total: { type: GraphQLFloat },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO Cart (CustomerID, Total) VALUES (?, ?)',
          [args.CustomerID, args.Total || 0.0],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const newCartID = result.insertId;
              pool.query('SELECT * FROM Cart WHERE CartID = ?', [newCartID], (err, results) => {
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
  updateCart: {
    type: CartType,
    args: {
      CartID: { type: new GraphQLNonNull(GraphQLID) },
      Total: { type: GraphQLFloat },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { CartID, ...updatedFields } = args;
      const updateQuery = Object.entries(updatedFields)
        .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
        .filter(Boolean)
        .join(', ');

      if (!updateQuery) {
        throw new Error('No fields to update.');
      }

      const values = Object.values(updatedFields).filter((value) => value !== undefined);

      return new Promise((resolve, reject) => {
        pool.query(`UPDATE Cart SET ${updateQuery} WHERE CartID = ?`, [...values, CartID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            pool.query('SELECT * FROM Cart WHERE CartID = ?', [CartID], (err, results) => {
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
  deleteCart: {
    type: CartType,
    args: {
      CartID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { CartID } = args;

      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Cart WHERE CartID = ?', [CartID], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const cartToDelete = results[0];
            pool.query('DELETE FROM Cart WHERE CartID = ?', [CartID], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(cartToDelete);
              }
            });
          }
        });
      });
    },
  },
};

export { CartType, CartQuery, CartMutation };
