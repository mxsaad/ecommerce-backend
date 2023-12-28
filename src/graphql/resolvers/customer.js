// src/graphql/customer.js
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import db from '../../db.js';
import { authenticateGraphQL } from '../../auth.js';

const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    CustomerID: { type: GraphQLID },
    FirstName: { type: GraphQLString },
    LastName: { type: GraphQLString },
    Username: { type: GraphQLString },
    Passkey: { type: GraphQLString },
    Email: { type: GraphQLString },
    Phone: { type: GraphQLBigInt },
  }),
});

const CustomerQuery = {
  customer: {
    type: CustomerType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Customer WHERE CustomerID = ?', [args.id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  customers: {
    type: new GraphQLList(CustomerType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Customer', (err, results) => {
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

const CustomerMutation = {
  addCustomer: {
    type: CustomerType,
    args: {
      FirstName: { type: new GraphQLNonNull(GraphQLString) },
      LastName: { type: new GraphQLNonNull(GraphQLString) },
      Username: { type: new GraphQLNonNull(GraphQLString) },
      Passkey: { type: new GraphQLNonNull(GraphQLString) },
      Email: { type: new GraphQLNonNull(GraphQLString) },
      Phone: { type: new GraphQLNonNull(GraphQLBigInt) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO Customer (FirstName, LastName, Username, Passkey, Email, Phone) VALUES (?, ?, ?, ?, ?, ?)',
          [args.FirstName, args.LastName, args.Username, args.Passkey, args.Email, args.Phone],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const newCustomerID = result.insertId;
              db.query('SELECT * FROM Customer WHERE CustomerID = ?', [newCustomerID], (err, results) => {
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
  updateCustomer: {
    type: CustomerType,
    args: {
      CustomerID: { type: new GraphQLNonNull(GraphQLID) },
      FirstName: { type: GraphQLString },
      LastName: { type: GraphQLString },
      Username: { type: GraphQLString },
      Passkey: { type: GraphQLString },
      Email: { type: GraphQLString },
      Phone: { type: GraphQLBigInt },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { CustomerID, ...updatedFields } = args;
      const updateQuery = Object.entries(updatedFields)
        .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
        .filter(Boolean)
        .join(', ');

      if (!updateQuery) {
        throw new Error('No fields to update.');
      }

      const values = Object.values(updatedFields).filter((value) => value !== undefined);

      return new Promise((resolve, reject) => {
        db.query(`UPDATE Customer SET ${updateQuery} WHERE CustomerID = ?`, [...values, CustomerID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            db.query('SELECT * FROM Customer WHERE CustomerID = ?', [CustomerID], (err, results) => {
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
  deleteCustomer: {
    type: CustomerType,
    args: {
      CustomerID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { CustomerID } = args;

      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Customer WHERE CustomerID = ?', [CustomerID], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const customerToDelete = results[0];
            db.query('DELETE FROM Customer WHERE CustomerID = ?', [CustomerID], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(customerToDelete);
              }
            });
          }
        });
      });
    },
  },
};

export { CustomerType, CustomerQuery, CustomerMutation };
