// src/graphql/supplier.js
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import pool from '../../db.js';
import { authenticateGraphQL } from '../../auth.js';

const SupplierType = new GraphQLObjectType({
  name: 'Supplier',
  fields: () => ({
    SupplierID: { type: GraphQLID },
    SupplierName: { type: GraphQLString },
    Email: { type: GraphQLString },
    Phone: { type: GraphQLID },
  }),
});

const SupplierQuery = {
  supplier: {
    type: SupplierType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Supplier WHERE SupplierID = ?', [args.id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  suppliers: {
    type: new GraphQLList(SupplierType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Supplier', (err, results) => {
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

const SupplierMutation = {
  addSupplier: {
    type: SupplierType,
    args: {
      SupplierName: { type: new GraphQLNonNull(GraphQLString) },
      Email: { type: new GraphQLNonNull(GraphQLString) },
      Phone: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO Supplier (SupplierName, Email, Phone) VALUES (?, ?, ?)',
          [args.SupplierName, args.Email, args.Phone],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const newSupplierID = result.insertId;
              pool.query('SELECT * FROM Supplier WHERE SupplierID = ?', [newSupplierID], (err, results) => {
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
  updateSupplier: {
    type: SupplierType,
    args: {
      SupplierID: { type: new GraphQLNonNull(GraphQLID) },
      SupplierName: { type: GraphQLString },
      Email: { type: GraphQLString },
      Phone: { type: GraphQLID },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { SupplierID, ...updatedFields } = args;
      const updateQuery = Object.entries(updatedFields)
        .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
        .filter(Boolean)
        .join(', ');

      if (!updateQuery) {
        throw new Error('No fields to update.');
      }

      const values = Object.values(updatedFields).filter((value) => value !== undefined);

      return new Promise((resolve, reject) => {
        pool.query(`UPDATE Supplier SET ${updateQuery} WHERE SupplierID = ?`, [...values, SupplierID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            pool.query('SELECT * FROM Supplier WHERE SupplierID = ?', [SupplierID], (err, results) => {
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
  deleteSupplier: {
    type: SupplierType,
    args: {
      SupplierID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { SupplierID } = args;

      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Supplier WHERE SupplierID = ?', [SupplierID], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const supplierToDelete = results[0];
            pool.query('DELETE FROM Supplier WHERE SupplierID = ?', [SupplierID], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(supplierToDelete);
              }
            });
          }
        });
      });
    },
  },
};

export { SupplierType, SupplierQuery, SupplierMutation };
