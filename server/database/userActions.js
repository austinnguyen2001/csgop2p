import User from '../models/user.model';

const initializeUser = async function initializeUserInDb(steamId) {
    try {
        const user = await User.findOneAndUpdate({ steamid: steamId }, {}, {upsert:true, new: true});
        return user;
    }
    catch(err) {
        console.log(`Failed to update user: ${steamId}`);
        initializeUser(steamId);
    }
}

const updateUserInventory = async function updateUserInventoryInDb(steamId, items) {
    try {
        await User.findOneAndUpdate({ steamid: steamId }, { backpack: items, lastupdate: Date.now() });
    }
    catch(err) {
        console.log(`Failed to update user: ${steamId}`);
        updateUserInventory(steamId, items);
    }
}

const updateUserBalance = async function updateUserBalanceInDb(steamId, amount) {
    try {
        await User.findOneAndUpdate({ steamid: steamId }, { $inc: { balance: amount } });
    }
    catch(err) {
        console.log(`Failed to update user balance: ${steamId}`);
        updateUserInventory(steamId, amount);
    }
}

const getUser = async function getUserInDb(steamId) {
    try {
        const user = await User.findOne({steamid: steamId}).exec();
        return user;
    }
    catch(err) {
        console.log(`Failed to get user balance: ${steamId}`);
    }
}

export { updateUserInventory, updateUserBalance, getUser, initializeUser };