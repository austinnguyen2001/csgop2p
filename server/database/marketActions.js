import Market from '../models/marketItem.model';
import { findItem } from './itemActions';

const addMarketOrderItem = async function addIteminMarketDb(steamId, item) {
    try {
        await Market.findOneAndUpdate({ assetid: item.assetid }, {
            owner: steamId,
            assetid: item.assetid,
            item: await findItem({name: item.name})
        }, {upsert:true});
    }
    catch(err) {
        console.log(`Failed to add item to market: ${item}`);
        addMarketOrderItem(steamId, item);
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
        await Market.findOneAndUpdate({ assetid: assetid }, {
            purchaser: steamId,
            startedPurchase: Date.now()
        });
    }
    catch(err) {
        console.log(`Failed to buy item from market: ${assetid}`);
        addMarketOrderItem(steamId, assetid);
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
        cancelMarketOrderPurchase(assetid);
    }
}

export {
    addMarketOrderItem,
    purchaseMarketOrderItem,
    getMarketOrders,
    completeMarketOrderPurchase,
    cancelMarketOrderPurchase
};