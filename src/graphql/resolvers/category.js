// src/graphql/category.js
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import pool from '../../db.js';

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    CategoryID: { type: GraphQLID },
    CategoryName: { type: GraphQLString },
    CategoryDescription: { type: GraphQLString },
  }),
});

const CategoryQuery = {
  category: {
    type: CategoryType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Category WHERE CategoryID = ?', [args.id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  categories: {
    type: new GraphQLList(CategoryType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Category', (err, results) => {
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

const CategoryMutation = {
  addCategory: {
    type: CategoryType,
    args: {
      CategoryName: { type: new GraphQLNonNull(GraphQLString) },
      CategoryDescription: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO Category (CategoryName, CategoryDescription) VALUES (?, ?)',
          [args.CategoryName, args.CategoryDescription],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const newCategoryID = result.insertId;
              pool.query('SELECT * FROM Category WHERE CategoryID = ?', [newCategoryID], (err, results) => {
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
  updateCategory: {
    type: CategoryType,
    args: {
      CategoryID: { type: new GraphQLNonNull(GraphQLID) },
      CategoryName: { type: GraphQLString },
      CategoryDescription: { type: GraphQLString },
    },
    resolve(parent, args) {
      const { CategoryID, ...updatedFields } = args;
      const updateQuery = Object.entries(updatedFields)
        .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
        .filter(Boolean)
        .join(', ');

      if (!updateQuery) {
        throw new Error('No fields to update.');
      }

      const values = Object.values(updatedFields).filter((value) => value !== undefined);

      return new Promise((resolve, reject) => {
        pool.query(`UPDATE Category SET ${updateQuery} WHERE CategoryID = ?`, [...values, CategoryID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            pool.query('SELECT * FROM Category WHERE CategoryID = ?', [CategoryID], (err, results) => {
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
  deleteCategory: {
    type: CategoryType,
    args: {
      CategoryID: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(parent, args) {
      const { CategoryID } = args;

      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Category WHERE CategoryID = ?', [CategoryID], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const categoryToDelete = results[0];
            pool.query('DELETE FROM Category WHERE CategoryID = ?', [CategoryID], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(categoryToDelete);
              }
            });
          }
        });
      });
    },
  },
};

export { CategoryType, CategoryQuery, CategoryMutation };
