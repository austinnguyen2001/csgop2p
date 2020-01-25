import axios from 'axios';
import bitskinsModule from './bitskinsBaseModule';
import bitskinsWebAutomationModule from './bitskinsWebAutomationModule';

const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

class bitskinsMarketModule extends bitskinsModule {
    constructor(bitskinsApiKey, bitskinsTwoFactor) {
        super(bitskinsApiKey, bitskinsTwoFactor); 
        this.baseBuyUrl = 'https://bitskins.com/api/v1/buy_item/';
        this.baseWithdrawUrl = 'https://bitskins.com/api/v1/withdraw_item/';
        this.basePriceUrl = 'https://bitskins.com/api/v1/get_specific_items_on_sale/';
        this.bitskinsWebAutomationModule = new bitskinsWebAutomationModule();

        /**
         * Set up queue for the trades that need to be sent out (we are using 1 account so we have to do this)
         * Using WebAutomation for this as I don't really want to implement our own bots (maintenance trade lock etc..)
         * Could rework queue into a set
         */    
        this.queue = [];
    }
    async buyBitskinsItem(itemId, price, tradeUrl) {
        await this.processBuyRequest(itemId, price, tradeUrl);
    }
    async processBuyRequest(itemId, price, tradeUrl) {
        // If the item isn't in the queue, then add it (no dups)
        if (!this.queue.some(item => item.itemId === itemId)) this.queue.push({itemId, price, tradeUrl});
        
        if (this.queue[0].itemId === itemId) {
            await this.bitskinsWebAutomationModule.setTradeUrl(this.queue[0].tradeUrl);
            await this.sendBuyRequest(itemId, this.queue[0].price);
            await this.sendWithdrawRequest(itemId);
            return this.queue.shift();
        } else {
            await wait(2000);
            return await this.processBuyRequest(itemId);
        }
    }
    sendPriceRequest(itemId) {
        const url = `${this.basePriceUrl}?api_key=${this.bitskinsApiKey}&code=${this.getTwoFactorCode()}&item_ids=${itemId}`;
        return axios.get(url);
    }
    sendBuyRequest(itemId, price) {
        // We want auto trade to be false as we are using their bots as our bots (we don't have a bot to store items)
        const url = `${this.baseBuyUrl}?api_key=${this.bitskinsApiKey}&code=${this.getTwoFactorCode()}&item_ids=${itemId}&prices=${price}&auto_trade=false`;
        return axios.get(url);
    }
    sendWithdrawRequest(itemId) {
        const url = `${this.baseWithdrawUrl}?api_key=${this.bitskinsApiKey}&code=${this.getTwoFactorCode()}&item_ids=${itemId}`;
        return axios.get(url);
    }
}

export default bitskinsMarketModule;
