import axios from 'axios';

class InventoryModule {
    constructor() {
        this.baseUrl = 'https://steamcommunity.com/inventory';
    }
    async getInventory(steamId, appId = 730, contextId = 2) {
        const response = await this.sendRequest(steamId, appId, contextId);
        const assets = response.data.assets;
        const descriptions = response.data.descriptions;
        return this.parseResponse(assets, descriptions);
    }
    parseResponse(assets, descriptions) {
        const inventory = [];
        assets.forEach((asset) => {
            descriptions.forEach((description) => {
                if (asset.classid === description.classid
                        && asset.instanceid === description.instanceid 
                        && description.tradable == 1
                ) {
                    const item = {
                        assetid: asset.assetid,
                        name: description.market_name,
                        icon_url: description.icon_url
                    };
                    inventory.push(item);
                }
            });
        });
        return inventory;
    }
    sendRequest(steamId, appId, contextId) {
        const url = `${this.baseUrl}/${steamId}/${appId}/${contextId}`;
        return axios.get(url);
    }
}

export default InventoryModule;