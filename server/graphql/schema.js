import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `
   type Item {
      name: String
      assetid: String
      icon_url: String
      quality_color: String
      price: Float
   }

   type MarketItem {
      owner: String
      assetid: String
      item: Item
      purchaser: String
      startedPurchase: Int
   }

   type User {
      steamid: String
      personaname: String
      avatar: String
      tradeurl: String
      balance: Float
      backpack: [Item]
      lastupdate: Int
   }

   type Query {
      getUser: User
      allMarketOrders: [MarketItem]
   }
   
   type Mutation {
      addMarketOrderItems(assetids: [String!]!) : [MarketItem]
      purchaseMarketOrderItem(assetids: [String!]!) : [String]
      delistMarketOrderPurchaseMarket(assetid: String!) : Boolean
   }
`;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export default schema;