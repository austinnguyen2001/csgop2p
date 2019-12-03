import Market from '../models/marketItem.model';
import { findItem } from './itemActions';

const addMarketOrderItem = async function addIteminMarketDb(steamId, item) {
    try {
        const addedItem = await Market.findOneAndUpdate({ assetid: item.assetid }, {
            owner: steamId,
            assetid: item.assetid,
            item: await findItem({name: item.name})
        }, {upsert:true, new: true});
        return addedItem;
    }
    catch(err) {
        console.log(`Failed to add item to market: ${item}`);
    }
}

const getMarketOrders = async function getMarketOrders(options = {}) {
    try {
        const marketOrders = await Market.find(options).exec();
        return marketOrders;
    }
    catch(err) {
        console.log(`Failed to get market orders: ${options}`)
    }
}

const purchaseMarketOrderItem = async function purchaseIteminMarketDb(steamId, assetid) {
    try {
        const purchasedMarketOrder = await Market.findOneAndUpdate({ assetid: assetid }, {
            purchaser: steamId,
            startedPurchase: Date.now()
        });
        return purchasedMarketOrder;
    }
    catch(err) {
        console.log(`Failed to buy item from market: ${assetid}`);
    }
}

const delistMarketOrder = async function deleteMarketOrderinMarketDb(assetid) {
    try {
        const delistedItem = await Market.findOneAndDelete({ assetid: assetid }).exec();
        return delistedItem;
    }
    catch(err) {
        console.log(`Failed to get delete market order: ${assetid}`)
    }
}

const completeMarketOrderPurchase = async function removeCompletedOrderrPurchaseinMarketDb(assetid){
    try {
        await Market.findOneAndDelete({ assetid: assetid }).exec();
    }
    catch(err) {
        console.log(`Failed to get complete market order: ${assetid}`)
    }
}

const cancelMarketOrderPurchase = async function purchaseIteminMarketDb(assetid) {
    try {
        await Market.findOneAndUpdate({ assetid: assetid }, {
            purchaser: null,
            startedPurchase: null
        });
    }
    catch(err) {
        console.log(`Failed to cancel buy order from market: ${assetid}`);
    }
}

export {
    addMarketOrderItem,
    purchaseMarketOrderItem,
    delistMarketOrder,
    getMarketOrders,
    completeMarketOrderPurchase,
    cancelMarketOrderPurchase
};