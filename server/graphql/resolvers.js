import { getMarketOrders, addMarketOrderItem, delistMarketOrder, purchaseMarketOrderItem } from '../database/marketActions';
import { getUser } from '../database/userActions';
import InventoryModule from '../steamModules/inventoryModule';
import { bitskinsApiKey, bitskinsTwoFactor, bitskinsMarkupPercent } from '../config';
import BitskinsMarketModule from '../bitskinsModules/bitskinsMarketModule';

const inventoryModule = new InventoryModule();
const bitskinsMarketModule = new BitskinsMarketModule(bitskinsApiKey, bitskinsTwoFactor);

export const resolvers = {
    Query : {
        getUser(obj, args, context) {
            return context.user;
        },
        async getMarketOrders(obj, {options = {}}, context) {
            // Default will be all market orders but can use others steamids or yourself
            if (Object.keys(options).length !== 0) {
                if (context && options === 'self') options = String(context.user.steamid);
                options = {owner: options};
            }
            return await getMarketOrders(options);
        },
        async requestCustomMarketOrder(obj, {itemId}) {
            /***
             * Returns itemPrice in which the user will use to confirm the offer 
             * Also multiply buy MarkupPercentage as a service fee
             */
            const itemPrice = (await bitskinsMarketModule.sendPriceRequest(itemId).data.data.items_on_sale[0].price) * bitskinsMarkupPercent;
            return itemPrice;
        }
    },
    Mutation: {   
        // Should create some validators later, but they aren't needed for now
        async setTradeUrl(root, {tradeUrl}) {
            console.log(tradeUrl);
        },
        async addMarketOrderItems(root, {assetids}, context){
            const userInventory = await inventoryModule.getInventory(context.user.steamid);
            const addedItems = await assetids.map(async (assetid) => {
                const selectedInventoryAsset = userInventory.filter(asset => asset.assetid === assetid);
                if (selectedInventoryAsset.length > 0) 
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
                if (marketAsset) {
                    acc.price += marketAsset[0].item.price;
                    acc.assets.push(curr);
                }

                return acc;
            }, Promise.resolve({assets: [], price: 0}));

            // if total price is more than the user balance than exit
            const balance = (await getUser(context.user.steamid)).balance;
            if (assetsDetails.price > balance) return;

            const purchasedArray = assetsDetails.assets.map(async (assetid) => {
                return ((await purchaseMarketOrderItem(context.user.steamid, assetid)) ? assetid : null);
            })

            // remove all null values in case of a mongoose failure
            return purchasedArray.filter(x => x);
        },
        async delistMarketOrderPurchaseMarket(root, {assetid}, context){
            const userMarketOrders = await getMarketOrders({owner: context.user.steamid});

            // Make sure it is their listing before removing it 
            if (userMarketOrders.some(item => item.assetid === assetid)) 
                return (await delistMarketOrder(assetid)) ? true : false;

            return false;
        },
        async buyCustomMarketOrder(root, {itemId, price}, context) {
            /**
             * User will send back the confirmed price from the requestCustomMarketOrder
             * No need to perform a price check they are paying the amount and if the item is already sold then the api will tell us so
             */
            const balance = (await getUser(context.user.steamid)).balance;
            if (price > balance) return;

            return (await bitskinsMarketModule.buyBitskinsItem(itemId, price, context.user.tradeUrl));
        }
    }
};