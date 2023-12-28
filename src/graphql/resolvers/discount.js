// src/graphql/discount.js
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import pool from '../../db.js';
import { authenticateGraphQL } from '../../auth.js';

const DiscountType = new GraphQLObjectType({
  name: 'Discount',
  fields: () => ({
    DiscountID: { type: GraphQLID },
    DiscountName: { type: GraphQLString },
    DiscountDescription: { type: GraphQLString },
    Active: { type: GraphQLInt },
    Percent: { type: GraphQLFloat },
  }),
});

const DiscountQuery = {
  discount: {
    type: DiscountType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Discount WHERE DiscountID = ?', [args.id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  discounts: {
    type: new GraphQLList(DiscountType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Discount', (err, results) => {
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

const DiscountMutation = {
  addDiscount: {
    type: DiscountType,
    args: {
      DiscountName: { type: GraphQLString },
      DiscountDescription: { type: GraphQLString },
      Active: { type: GraphQLInt },
      Percent: { type: new GraphQLNonNull(GraphQLFloat) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO Discount (DiscountName, DiscountDescription, Active, Percent) VALUES (?, ?, ?, ?)',
          [args.DiscountName || 'Coupon', args.DiscountDescription, args.Active || 0, args.Percent],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const newDiscountID = result.insertId;
              pool.query('SELECT * FROM Discount WHERE DiscountID = ?', [newDiscountID], (err, results) => {
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
  updateDiscount: {
    type: DiscountType,
    args: {
      DiscountID: { type: new GraphQLNonNull(GraphQLID) },
      DiscountName: { type: GraphQLString },
      DiscountDescription: { type: GraphQLString },
      Active: { type: GraphQLInt },
      Percent: { type: GraphQLFloat },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { DiscountID, ...updatedFields } = args;
      const updateQuery = Object.entries(updatedFields)
        .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
        .filter(Boolean)
        .join(', ');

      if (!updateQuery) {
        throw new Error('No fields to update.');
      }

      const values = Object.values(updatedFields).filter((value) => value !== undefined);

      return new Promise((resolve, reject) => {
        pool.query(`UPDATE Discount SET ${updateQuery} WHERE DiscountID = ?`, [...values, DiscountID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            pool.query('SELECT * FROM Discount WHERE DiscountID = ?', [DiscountID], (err, results) => {
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
  deleteDiscount: {
    type: DiscountType,
    args: {
      DiscountID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { DiscountID } = args;

      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Discount WHERE DiscountID = ?', [DiscountID], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const discountToDelete = results[0];
            pool.query('DELETE FROM Discount WHERE DiscountID = ?', [DiscountID], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(discountToDelete);
              }
            });
          }
        });
      });
    },
  },
};

export { DiscountType, DiscountQuery, DiscountMutation };
