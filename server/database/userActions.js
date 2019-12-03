import User from '../models/user.model';

const initializeUser = async function initializeUserInDb(userInfo) {
    try {
        const user = await User.findOneAndUpdate({ steamid: userInfo.steamid }, { avatar: userInfo.avatarmedium, personaname: userInfo.personaname }, {upsert:true, new: true});
        return user;
    }
    catch(err) {
        console.log(`Failed to initialize user: ${err}`);
    }
}

const updateUserInventory = async function updateUserInventoryInDb(steamId, items) {
    try {
        await User.findOneAndUpdate({ steamid: steamId }, { backpack: items, lastupdate: Date.now() });
    }
    catch(err) {
        console.log(`Failed to update user: ${steamId}`);
    }
}

const updateUserBalance = async function updateUserBalanceInDb(steamId, amount) {
    try {
        await User.findOneAndUpdate({ steamid: steamId }, { $inc: { balance: amount } });
    }
    catch(err) {
        console.log(`Failed to update user balance: ${steamId}`);
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