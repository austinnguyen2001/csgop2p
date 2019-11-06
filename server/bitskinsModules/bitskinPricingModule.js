import axios from 'axios';
import bitskinsModule from './bitskinsBaseModule';
import { updateItem, findItem } from '../database/actions';

class bitskinsPricingModule extends bitskinsModule {
    constructor(bitskinsApiKey, bitskinsTwoFactor) {
        super(bitskinsApiKey, bitskinsTwoFactor); 
        this.baseUrl = 'https://bitskins.com/api/v1/get_all_item_prices/';
        this.updatePrices();
    }
    async updatePrices(){
        const response = await this.sendRequest();
        Object.values(response.data.prices).forEach(item => {
            updateItem(item);
        });
    }
    async getPrice(itemMarketName) {
        const itemDetails = await findItem({name: itemMarketName});
        return itemDetails.price;
    }
    sendRequest() {
        const url = `${this.baseUrl}?api_key=${this.bitskinsApiKey}&code=${this.getTwoFactorCode()}`;
        return axios.get(url);
    }
}

export default bitskinsPricingModule;
