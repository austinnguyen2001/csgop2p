import { Schema, model } from 'mongoose';

const itemSchema = new Schema({
    assetid: String,
    icon_url: String,
    name: String,
    quality_color: String,
    price: Number
});

const Item = new model("Item", itemSchema);

export default Item;