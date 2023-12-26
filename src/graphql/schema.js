// src/graphql/schema.js
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { AdminQuery, AdminMutation } from './resolvers/admin.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // ... (existing fields)
    ...AdminQuery,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // ... (existing fields)
    ...AdminMutation,
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
