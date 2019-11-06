import { Schema, model } from 'mongoose';
import Item from './item.model';

const marketSchema = new Schema({
    owner: String,
    purchaser: String,
    assetid: String,
    startedPurchase: Number,
    item: Item.schema
});

const MarketItem = new model("MarketItem", marketSchema);

export default MarketItem;