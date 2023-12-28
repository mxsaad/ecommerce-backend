// src/graphql/payment.js
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import pool from '../../db.js';
import { authenticateGraphQL } from '../../auth.js';

const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  fields: () => ({
    PaymentID: { type: GraphQLID },
    CustomerID: { type: GraphQLID },
    Brand: { type: GraphQLString },
    CardNumber: { type: GraphQLBigInt },
    ExpirationDate: { type: GraphQLString },
    FirstName: { type: GraphQLString },
    LastName: { type: GraphQLString },
    SecurityCode: { type: GraphQLInt },
  }),
});

const PaymentQuery = {
  payment: {
    type: PaymentType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Payment WHERE PaymentID = ?', [args.id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  payments: {
    type: new GraphQLList(PaymentType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Payment', (err, results) => {
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

const PaymentMutation = {
  addPayment: {
    type: PaymentType,
    args: {
      CustomerID: { type: new GraphQLNonNull(GraphQLID) },
      Brand: { type: new GraphQLNonNull(GraphQLString) },
      CardNumber: { type: new GraphQLNonNull(GraphQLBigInt) },
      ExpirationDate: { type: new GraphQLNonNull(GraphQLString) },
      FirstName: { type: new GraphQLNonNull(GraphQLString) },
      LastName: { type: new GraphQLNonNull(GraphQLString) },
      SecurityCode: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO Payment (CustomerID, Brand, CardNumber, ExpirationDate, FirstName, LastName, SecurityCode) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [args.CustomerID, args.Brand, args.CardNumber, args.ExpirationDate, args.FirstName, args.LastName, args.SecurityCode],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const newPaymentID = result.insertId;
              pool.query('SELECT * FROM Payment WHERE PaymentID = ?', [newPaymentID], (err, results) => {
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
  updatePayment: {
    type: PaymentType,
    args: {
      PaymentID: { type: new GraphQLNonNull(GraphQLID) },
      Brand: { type: GraphQLString },
      CardNumber: { type: GraphQLBigInt },
      ExpirationDate: { type: GraphQLString },
      FirstName: { type: GraphQLString },
      LastName: { type: GraphQLString },
      SecurityCode: { type: GraphQLInt },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { PaymentID, ...updatedFields } = args;
      const updateQuery = Object.entries(updatedFields)
        .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
        .filter(Boolean)
        .join(', ');

      if (!updateQuery) {
        throw new Error('No fields to update.');
      }

      const values = Object.values(updatedFields).filter((value) => value !== undefined);

      return new Promise((resolve, reject) => {
        pool.query(`UPDATE Payment SET ${updateQuery} WHERE PaymentID = ?`, [...values, PaymentID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            pool.query('SELECT * FROM Payment WHERE PaymentID = ?', [PaymentID], (err, results) => {
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
  deletePayment: {
    type: PaymentType,
    args: {
      PaymentID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { PaymentID } = args;

      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Payment WHERE PaymentID = ?', [PaymentID], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const paymentToDelete = results[0];
            pool.query('DELETE FROM Payment WHERE PaymentID = ?', [PaymentID], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(paymentToDelete);
              }
            });
          }
        });
      });
    },
  },
};

export { PaymentType, PaymentQuery, PaymentMutation };
