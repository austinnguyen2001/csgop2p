import { Schema, model } from 'mongoose';
import Item from './item.model';

const userSchema = new Schema({
    steamid: String,
    avatar: String,
    personaname: String,
    tradeUrl: String,
    isPurchasing: {
        type: Boolean,
        default: false
    },
    balance: {
        type: Number,
        default: 0
    },
    backpack: [Item.schema],
    lastupdate: Number
});

const User = new model("User", userSchema);

export default User;