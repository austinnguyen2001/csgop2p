import { Schema, model } from 'mongoose';
import Item from './item.model';

const userSchema = new Schema({
    steamid: Number,
    balance: {
        type: Number,
        default: 0
    },
    backpack: [Item.schema],
    lastupdate: {
        type: Number,
        default: Date.now
    }
});

const User = new model("User", userSchema);

export default User;