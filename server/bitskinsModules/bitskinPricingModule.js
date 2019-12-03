import axios from 'axios';
import bitskinsModule from './bitskinsBaseModule';
import { updateItem } from '../database/itemActions';

class bitskinsPricingModule extends bitskinsModule {
    constructor(bitskinsApiKey, bitskinsTwoFactor) {
        super(bitskinsApiKey, bitskinsTwoFactor); 
        this.baseUrl = 'https://bitskins.com/api/v1/get_all_item_prices/';
        this.updatePrices();
    }
    async updatePrices(){
        const response = Object.values((await this.sendRequest()).data.prices);
        const updates = response.map(updateItem);
        await Promise.all(updates);
        console.log("Finished pricing");
    }
    sendRequest() {
        const url = `${this.baseUrl}?api_key=${this.bitskinsApiKey}&code=${this.getTwoFactorCode()}`;
        return axios.get(url);
    }
}

export default bitskinsPricingModule;
