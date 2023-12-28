// src/graphql/admin.js
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import db from '../../db.js';
import { authenticateGraphQL } from '../../auth.js';

const AdminType = new GraphQLObjectType({
  name: 'Admin',
  fields: () => ({
    AdminID: { type: GraphQLID },
    FirstName: { type: GraphQLString },
    LastName: { type: GraphQLString },
    Username: { type: GraphQLString },
    Passkey: { type: GraphQLString },
    Email: { type: GraphQLString },
    Permissions: { type: GraphQLInt },
  }),
});

const AdminQuery = {
  admin: {
    type: AdminType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Admin WHERE AdminID = ?', [args.id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  admins: {
    type: new GraphQLList(AdminType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Admin', (err, results) => {
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

const AdminMutation = {
  addAdmin: {
    type: AdminType,
    args: {
      FirstName: { type: new GraphQLNonNull(GraphQLString) },
      LastName: { type: new GraphQLNonNull(GraphQLString) },
      Username: { type: new GraphQLNonNull(GraphQLString) },
      Passkey: { type: new GraphQLNonNull(GraphQLString) },
      Email: { type: new GraphQLNonNull(GraphQLString) },
      Permissions: { type: GraphQLInt },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO Admin (FirstName, LastName, Username, Passkey, Email, Permissions) VALUES (?, ?, ?, ?, ?, ?)',
          [args.FirstName, args.LastName, args.Username, args.Passkey, args.Email, args.Permissions],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const newAdminID = result.insertId;
              db.query('SELECT * FROM Admin WHERE AdminID = ?', [newAdminID], (err, results) => {
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
  updateAdmin: {
    type: AdminType,
    args: {
      AdminID: { type: new GraphQLNonNull(GraphQLID) },
      FirstName: { type: GraphQLString },
      LastName: { type: GraphQLString },
      Username: { type: GraphQLString },
      Passkey: { type: GraphQLString },
      Email: { type: GraphQLString },
      Permissions: { type: GraphQLInt },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { AdminID, ...updatedFields } = args;
      const updateQuery = Object.entries(updatedFields)
        .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
        .filter(Boolean)
        .join(', ');

      if (!updateQuery) {
        throw new Error('No fields to update.');
      }

      const values = Object.values(updatedFields).filter((value) => value !== undefined);

      return new Promise((resolve, reject) => {
        db.query(`UPDATE Admin SET ${updateQuery} WHERE AdminID = ?`, [...values, AdminID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            db.query('SELECT * FROM Admin WHERE AdminID = ?', [AdminID], (err, results) => {
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
  deleteAdmin: {
    type: AdminType,
    args: {
      AdminID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => {
      authenticateGraphQL(context);
      const { AdminID } = args;

      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Admin WHERE AdminID = ?', [AdminID], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const adminToDelete = results[0];
            db.query('DELETE FROM Admin WHERE AdminID = ?', [AdminID], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(adminToDelete);
              }
            });
          }
        });
      });
    },
  },
};

export { AdminType, AdminQuery, AdminMutation };
