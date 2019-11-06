import Item from '../models/item.model'
import User from '../models/user.model'
import Market from '../models/marketItem.model';

const updateItem = async function updateItemInItemDb(item) {
    try {
        await Item.findOneAndUpdate({ name: item.market_hash_name }, { 
            icon_url: item.icon_url,
            quality_color: item.quality_color,
            price: parseFloat(item.price)
        }, { upsert:true, new: true });
    }
    catch(err) {
        console.log(`Failed to update item trying again: ${item}`)
        updateItem(item);
    }
}

const findItem = async function findItemInItemDb(options) {
    try {
        const itemDetails = await Item.findOne(options).exec();
        return itemDetails;
    }
    catch(err) {
        console.log(`Failed to find item with options: ${options}`)
    }
}

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

const buyMarketOrderItem = async function buyIteminMarketDb() {

}

//const closeMarketOrder = async function

const updateUser = async function updateUserInDb(steamId, items) {
    try {
        await User.findOneAndUpdate({ steamid: steamId }, { backpack: items }, {upsert:true});
    }
    catch(err) {
        console.log(`Failed to update user: ${steamId}`);
        updateUser(steamId, items);
    }
}

export {
    updateItem,
    findItem,
    addMarketOrderItem,
    updateUser,
    buyMarketOrderItem,
    getMarketOrders
};