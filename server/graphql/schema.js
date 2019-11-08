import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `
   type Item {
      name: String!
      assetid: String
      icon_url: String,
      quality_color: String
      price: Float
   }

   type MarketItem {
      owner: String!
      assetid: String!
      item: Item!
      purchaser: String
      startedPurchase: Int
   }

   type User {
      steamid: String!
      balance: Float
      backpack: [Item]
      lastupdate: Int
   }

   type Query {
      getUser(steamid: String!): User
      allMarketOrders: [MarketItem]
   }

   input ItemInput {
      assetid: String!
      name: String!
   }
   
   type Mutation {
      addMarketOrderItem(steamid: String!, item: ItemInput!) : String
      purchaseMarketOrderItem(steamid: String!, assetid: String!) : String
   }
`;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export default schema;