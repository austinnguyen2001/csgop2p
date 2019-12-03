import Item from '../models/item.model';

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

export { updateItem, findItem };