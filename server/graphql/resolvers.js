import { getMarketOrders } from '../database/marketActions';
import { getUser } from '../database/userActions';

export  const resolvers = {
    Query : {
        async getUser(obj, args, context){
            console.log(args.steamid);
            let user = null;
            if(context.user)
                user = await getUser(context.user.steamid);
            return user;
        },
        async allMarketOrders(){
            return await getMarketOrders();
        }
    },
    Mutation: {   
        /*
        need to verify first *edit got context can use that instead
        addMarketOrderItem(root, {steamid, item}){
           return 'dsd';
        },
        updateProduct(root, {steamid, assetid}){
            return 'dsd';
        },
        */
    }
};