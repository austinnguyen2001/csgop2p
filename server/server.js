import InventoryModule from './steamModules/inventoryModule';
import InventoryPollModule from './steamModules/inventoryPollModule';
import mongoose from 'mongoose';
import { updateUser } from './database/actions';
import { mongoDbPath, bitskinsApiKey, bitskinsTwoFactor } from './config';
import bitskinsPricingModule from './bitskinsModules/bitskinPricingModule';

import { addMarketOrderItem } from './database/actions';

const inventoryModule = new InventoryModule();
const inventoryPollModule = new InventoryPollModule();
const bitskinsPricingMod = new bitskinsPricingModule(bitskinsApiKey, bitskinsTwoFactor);

// Connect to our db
const connect = () => {
    mongoose.connect(`mongodb://localhost/${mongoDbPath}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }, err => {
        if (err) throw err;
        console.log('Successfully connected');
    });
}
connect();

// Reconnect in case of disconnect
mongoose.connection.on('disconnected', connect);

// Crashes until you fill db with pricing info *for now cause its a wip
// Uncomment when the prices are updated

/*
const steamId = '76561197967452730';

inventoryModule.getInventory(steamId)
    .then(response => {
        updateUser(steamId, response);
        response.forEach(item => {
            // Default is 7 days
            addMarketOrderItem('76561197967452730', item);
            bitskinsPricingMod.getPrice(item.name).then(result => {
                //console.log(result);
            });
        })
    })
    .catch(error => console.log('error'));
*/
