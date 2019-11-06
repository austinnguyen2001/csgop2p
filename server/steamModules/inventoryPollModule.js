import inventoryModule from './inventoryModule';
import { getMarketOrders } from '../database/actions';

class inventoryPollModule extends inventoryModule {
    constructor(pollInterval = 10000) {
        super();
        this.pollInterval = pollInterval;
        this.doPoll();
        setInterval(this.doPoll, pollInterval);
    }
    async doPoll() {
        const inProgMarketOrders = await getMarketOrders({purchaser: { $ne: null }});
        inProgMarketOrders.forEach(order => {
            console.log(order);
        })
    }
}

export default inventoryPollModule;