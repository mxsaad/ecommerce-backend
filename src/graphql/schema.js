// src/graphql/schema.js
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { AdminQuery, AdminMutation } from './resolvers/admin.js';
import { CartQuery, CartMutation } from './resolvers/cart.js';
import { CategoryQuery, CategoryMutation } from './resolvers/category.js';
import { CustomerQuery, CustomerMutation } from './resolvers/customer.js';
import { DiscountQuery, DiscountMutation } from './resolvers/discount.js';
import { HomeAddressQuery, HomeAddressMutation } from './resolvers/homeAddress.js';
import { OnlineOrderQuery, OnlineOrderMutation } from './resolvers/onlineOrder.js';
import { PaymentQuery, PaymentMutation } from './resolvers/payment.js';
import { ProductQuery, ProductMutation } from './resolvers/product.js';
import { SupplierQuery, SupplierMutation } from './resolvers/supplier.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...AdminQuery,
    ...CartQuery,
    ...CategoryQuery,
    ...CustomerQuery,
    ...DiscountQuery,
    ...HomeAddressQuery,
    ...OnlineOrderQuery,
    ...PaymentQuery,
    ...ProductQuery,
    ...SupplierQuery,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...AdminMutation,
    ...CartMutation,
    ...CategoryMutation,
    ...CustomerMutation,
    ...DiscountMutation,
    ...HomeAddressMutation,
    ...OnlineOrderMutation,
    ...PaymentMutation,
    ...ProductMutation,
    ...SupplierMutation,
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
