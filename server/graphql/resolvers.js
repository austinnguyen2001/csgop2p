import { getMarketOrders, addMarketOrderItem, delistMarketOrder, purchaseMarketOrderItem } from '../database/marketActions';
import InventoryModule from '../steamModules/inventoryModule';

const inventoryModule = new InventoryModule();

export const resolvers = {
    Query : {
        getUser(obj, args, context) {
            return context.user;
        },
        async allMarketOrders() {
            return await getMarketOrders();
        }
    },
    Mutation: {   
        // Should create some validators later, but they aren't needed for now
        async addMarketOrderItems(root, {assetids}, context){
            const userInventory = await inventoryModule.getInventory(context.user.steamid);
            const addedItems = await assetids.map(async (assetid) => {
                const selectedInventoryAsset = userInventory.filter(asset => asset.assetid === assetid);
                if(selectedInventoryAsset.length > 0) 
                    // Get item's marketname from ourside so they can't abuse the system
                    return (await addMarketOrderItem(context.user.steamid, {
                        assetid: assetid,
                        name: selectedInventoryAsset.name
                    }));
            });      
            
            // remove all null values in case of a mongoose failure
            return addedItems.filter(x => x);
        },
        async purchaseMarketOrderItem(root, {assetids}, context){
            const assetsDetails = await assetids.reduce(async (accPromise, curr) => {
                const acc = await accPromise;
                const marketAsset = await getMarketOrders({assetid: curr});

                // skip if asset doesn't exist in the market
                if(marketAsset) {
                    acc.price += marketAsset[0].item.price;
                    acc.assets.push(curr);
                }

                return acc;
            }, Promise.resolve({assets: [], price: 0}));

            // if total price is more than the user balance than exit
            if(assetsDetails.price > context.user.balance) return;

            const purchasedArray = assetsDetails.assets.map(async (assetid) => {
                return ((await purchaseMarketOrderItem(context.user.steamid, assetid)) ? assetid : null);
            })

            // remove all null values in case of a mongoose failure
            return purchasedArray.filter(x => x);
        },
        async delistMarketOrderPurchaseMarket(root, {assetid}, context){
            const userMarketOrders = await getMarketOrders({owner: context.user.steamid});

            // Make sure it is their listing before removing it 
            if(userMarketOrders.some(item => item.assetid === assetid)) 
                return (await delistMarketOrder(assetid)) ? true : false;

            return false;
        },
    }
};