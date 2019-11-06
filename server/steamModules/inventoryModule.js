import axios from 'axios';

class InventoryModule {
    constructor() {
        this.baseUrl = 'https://steamcommunity.com/inventory';
    }
    async getInventory(steamId, appId, contextId) {
        const response = await this._sendRequest(steamId, appId, contextId);
        const assets = response.data.assets;
        const descriptions = response.data.descriptions;
        return this._parseResponse(assets, descriptions);
    }
    _parseResponse(assets, descriptions) {
        const inventory = [];
        assets.forEach((asset) => {
            descriptions.forEach((description) => {
                if (asset.classid === description.classid
                        && asset.instanceid === description.instanceid 
                        && description.tradable == 1
                ) {
                    const item = {
                        assetid: asset.assetid,
                        name: description.market_name
                    };
                    inventory.push(item);
                }
            });
        });
        return inventory;
    }
    _sendRequest(steamId, appId = 730, contextId = 2) {
        const url = `${this.baseUrl}/${steamId}/${appId}/${contextId}`;
        return axios.get(url);
    }
}

export default InventoryModule;