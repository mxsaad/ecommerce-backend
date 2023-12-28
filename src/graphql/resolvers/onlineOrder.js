// src/graphql/onlineOrder.js
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import db from '../../db.js';
import { authenticateGraphQL } from '../../auth.js';

const OnlineOrderType = new GraphQLObjectType({
  name: 'OnlineOrder',
  fields: () => ({
    OrderID: { type: GraphQLID },
    CustomerID: { type: GraphQLID },
    PaymentID: { type: GraphQLID },
    AddressID: { type: GraphQLID },
    DiscountID: { type: GraphQLID },
    Total: { type: GraphQLFloat },
    OrderDate: { type: GraphQLString },
    OrderTime: { type: GraphQLString },
  }),
});

const OnlineOrderQuery = {
  onlineOrder: {
    type: OnlineOrderType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM OnlineOrder WHERE OrderID = ?', [args.id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  onlineOrders: {
    type: new GraphQLList(OnlineOrderType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM OnlineOrder', (err, results) => {
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

const OnlineOrderMutation = {
  addOnlineOrder: {
    type: OnlineOrderType,
    args: {
      CustomerID: { type: new GraphQLNonNull(GraphQLID) },
      PaymentID: { type: new GraphQLNonNull(GraphQLID) },
      AddressID: { type: new GraphQLNonNull(GraphQLID) },
      DiscountID: { type: GraphQLID },
      Total: { type: new GraphQLNonNull(GraphQLFloat) },
      OrderDate: { type: new GraphQLNonNull(GraphQLString) },
      OrderTime: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO OnlineOrder (CustomerID, PaymentID, AddressID, DiscountID, Total, OrderDate, OrderTime) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [args.CustomerID, args.PaymentID, args.AddressID, args.DiscountID || null, args.Total, args.OrderDate, args.OrderTime],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const newOrderID = result.insertId;
              db.query('SELECT * FROM OnlineOrder WHERE OrderID = ?', [newOrderID], (err, results) => {
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
  updateOnlineOrder: {
    type: OnlineOrderType,
    args: {
      OrderID: { type: new GraphQLNonNull(GraphQLID) },
      CustomerID: { type: GraphQLID },
      PaymentID: { type: GraphQLID },
      AddressID: { type: GraphQLID },
      DiscountID: { type: GraphQLID },
      Total: { type: GraphQLFloat },
      OrderDate: { type: GraphQLString },
      OrderTime: { type: GraphQLString },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { OrderID, ...updatedFields } = args;
      const updateQuery = Object.entries(updatedFields)
        .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
        .filter(Boolean)
        .join(', ');

      if (!updateQuery) {
        throw new Error('No fields to update.');
      }

      const values = Object.values(updatedFields).filter((value) => value !== undefined);

      return new Promise((resolve, reject) => {
        db.query(`UPDATE OnlineOrder SET ${updateQuery} WHERE OrderID = ?`, [...values, OrderID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            db.query('SELECT * FROM OnlineOrder WHERE OrderID = ?', [OrderID], (err, results) => {
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
  deleteOnlineOrder: {
    type: OnlineOrderType,
    args: {
      OrderID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { OrderID } = args;

      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM OnlineOrder WHERE OrderID = ?', [OrderID], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const orderToDelete = results[0];
            db.query('DELETE FROM OnlineOrder WHERE OrderID = ?', [OrderID], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(orderToDelete);
              }
            });
          }
        });
      });
    },
  },
};

export { OnlineOrderType, OnlineOrderQuery, OnlineOrderMutation };
