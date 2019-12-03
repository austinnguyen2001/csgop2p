import inventoryModule from './inventoryModule';
import { getMarketOrders, completeMarketOrderPurchase, cancelMarketOrderPurchase } from '../database/marketActions';
import { maxTimeToExchangeItems } from '../config';

class inventoryPollModule extends inventoryModule {
    constructor(pollInterval = 10000) {
        super();
        this.doPoll();
        setInterval(() => this.doPoll(), pollInterval);
    }
    async doPoll() {
        const inProgMarketOrders = await getMarketOrders({purchaser: { $ne: null }});
        inProgMarketOrders.forEach(async order => {
            const purchaserInventory = await this.getInventory(order.purchaser);
            const filterPurchaserInventoryForAsset = purchaserInventory.filter(item => item.assetid == order.assetid)

            // If the items have been moved. Complete the marketorder and mutuate balances
            if(filterPurchaserInventoryForAsset.length > 0)
                completeMarketOrderPurchase(filterPurchaserInventoryForAsset[0].assetid);

            // If items have not yet been moved check if its been past the expiration time to make the trade
            else if(Date.now() - order.startedPurchase > maxTimeToExchangeItems)
                cancelMarketOrderPurchase(filterPurchaserInventoryForAsset[0].assetid);
        });
    }
}

export default inventoryPollModule;