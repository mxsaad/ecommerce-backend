// src/graphql/homeAddress.js
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import db from '../../db.js';
import { authenticateGraphQL } from '../../auth.js';

const HomeAddressType = new GraphQLObjectType({
  name: 'HomeAddress',
  fields: () => ({
    AddressID: { type: GraphQLID },
    CustomerID: { type: GraphQLID },
    Line1: { type: GraphQLString },
    Line2: { type: GraphQLString },
    City: { type: GraphQLString },
    PostalCode: { type: GraphQLString },
    Country: { type: GraphQLString },
  }),
});

const HomeAddressQuery = {
  homeAddress: {
    type: HomeAddressType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM HomeAddress WHERE AddressID = ?', [args.id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  homeAddresses: {
    type: new GraphQLList(HomeAddressType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM HomeAddress', (err, results) => {
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

const HomeAddressMutation = {
  addHomeAddress: {
    type: HomeAddressType,
    args: {
      CustomerID: { type: new GraphQLNonNull(GraphQLID) },
      Line1: { type: new GraphQLNonNull(GraphQLString) },
      Line2: { type: GraphQLString },
      City: { type: new GraphQLNonNull(GraphQLString) },
      PostalCode: { type: new GraphQLNonNull(GraphQLString) },
      Country: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO HomeAddress (CustomerID, Line1, Line2, City, PostalCode, Country) VALUES (?, ?, ?, ?, ?, ?)',
          [args.CustomerID, args.Line1, args.Line2 || null, args.City, args.PostalCode, args.Country],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const newAddressID = result.insertId;
              db.query('SELECT * FROM HomeAddress WHERE AddressID = ?', [newAddressID], (err, results) => {
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
  updateHomeAddress: {
    type: HomeAddressType,
    args: {
      AddressID: { type: new GraphQLNonNull(GraphQLID) },
      Line1: { type: GraphQLString },
      Line2: { type: GraphQLString },
      City: { type: GraphQLString },
      PostalCode: { type: GraphQLString },
      Country: { type: GraphQLString },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { AddressID, ...updatedFields } = args;
      const updateQuery = Object.entries(updatedFields)
        .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
        .filter(Boolean)
        .join(', ');

      if (!updateQuery) {
        throw new Error('No fields to update.');
      }

      const values = Object.values(updatedFields).filter((value) => value !== undefined);

      return new Promise((resolve, reject) => {
        db.query(`UPDATE HomeAddress SET ${updateQuery} WHERE AddressID = ?`, [...values, AddressID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            db.query('SELECT * FROM HomeAddress WHERE AddressID = ?', [AddressID], (err, results) => {
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
  deleteHomeAddress: {
    type: HomeAddressType,
    args: {
      AddressID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { AddressID } = args;

      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM HomeAddress WHERE AddressID = ?', [AddressID], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const addressToDelete = results[0];
            db.query('DELETE FROM HomeAddress WHERE AddressID = ?', [AddressID], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(addressToDelete);
              }
            });
          }
        });
      });
    },
  },
};

export { HomeAddressType, HomeAddressQuery, HomeAddressMutation };
