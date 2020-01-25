import puppeteer from 'puppeteer';
import { generateCode } from 'steamguard-totp';
import { steamUserName, steamPassword, steamSharedSecret } from '../config'

/**
 * Need to use web automation to allow for direct item transfers. 
 * This might be banned in the future as this might not in the api on purpose.
 */

const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

class bitskinsWebAutomationModule {
    constructor() {
        // Man the url is long
        this.bitskinLoginUrl = 'https://steamcommunity.com/openid/login?openid.ax.if_available=ext4%2Cext5%2Cext6%2Cext7%2Cext8&openid.ax.mode=fetch_request&openid.ax.required=ext0%2Cext1%2Cext2%2Cext3&openid.ax.type.ext0=http%3A%2F%2Faxschema.org%2Fcontact%2Femail&openid.ax.type.ext1=http%3A%2F%2Faxschema.org%2FnamePerson&openid.ax.type.ext2=http%3A%2F%2Faxschema.org%2FnamePerson%2Ffirst&openid.ax.type.ext3=http%3A%2F%2Faxschema.org%2FnamePerson%2Flast&openid.ax.type.ext4=http%3A%2F%2Faxschema.org%2FnamePerson%2Ffriendly&openid.ax.type.ext5=http%3A%2F%2Faxschema.org%2Fcontact%2Fcity%2Fhome&openid.ax.type.ext6=http%3A%2F%2Faxschema.org%2Fcontact%2Fstate%2Fhome&openid.ax.type.ext7=http%3A%2F%2Faxschema.org%2Fcontact%2Fweb%2Fdefault&openid.ax.type.ext8=http%3A%2F%2Faxschema.org%2Fmedia%2Fimage%2Faspect11&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.ax=http%3A%2F%2Fopenid.net%2Fsrv%2Fax%2F1.0&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.realm=https%3A%2F%2Fbitskins.co&openid.return_to=https%3A%2F%2Fbitskins%2Eco%2Fusers%2Fauth%2Fsteam%2Fcallback%3Flh_r%3D559d1074ec5a7d%26_method%3Dpost&openid.sreg.optional=postcode%2Cnickname&openid.sreg.required=email%2Cfullname';
        this.bitskinSettingUrl ='https://bitskins.com/settings';
        this.puppeteerSetup().then(() => this.bitskinLoginHandler());
    }
    async puppeteerSetup() {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
    }
    async bitskinLoginHandler() {
        await this.page.goto(this.bitskinLoginUrl);

        // Wait until the input fields are loaded
        await Promise.all([
            this.page.waitFor('#steamAccountName'),
            this.page.waitFor('#steamPassword'),
            this.page.waitFor('#imageLogin'),
            this.page.waitFor('#twofactorcode_entry'),
            this.page.waitFor('#login_twofactorauth_buttonset_entercode > [data-modalstate="submit"]')
        ])

        // Login with user details
        await this.page.type('input[id="steamAccountName"]', steamUserName);
        await this.page.type('input[id="steamPassword"]', steamPassword);
        await this.page.click('input[id="imageLogin"]');

        // Delay for the steam modal popup animation
        await this.page.waitFor(2000);

        const code = await generateCode(steamSharedSecret);
        await this.page.type('input[id="twofactorcode_entry"]', code);
        await this.page.click('#login_twofactorauth_buttonset_entercode > [data-modalstate="submit"]')

        await this.page.waitFor(2000);

        /**
         * Navigate to the setting page for setting the trade url
         * Now we dont need to call refresh page on every setTradeUrl call
         */
        await this.page.goto(this.bitskinSettingUrl);
    }
    async setTradeUrl(tradeUrl) {
        // Wait until the input fields are loaded
        await Promise.all([
            this.page.waitFor('#trade_url'),
            this.page.waitFor('#setTradeUrlButton'),
            this.page.waitFor('#text-muted > em')
        ])

        await this.page.type('input[id="trade_url"]', tradeUrl);
        await this.page.click('#setTradeUrlButton');

        // async to tell us when its done updating so we can tell our market module to continue
        await this.checkTradeUrl(tradeUrl);
    }
    async checkTradeUrl(tradeUrl) {
        // Refresh the page
        await this.page.goto(this.bitskinSettingUrl);

        await this.page.waitFor('#text-muted > em');
        const last3CharsSavedTradeUrl = await this.page.$eval('#text-muted > em', (element) => element.innerText);

        // Break out if it updates else continue
        if (last3CharsSavedTradeUrl === tradeUrl.slice(-3)) return;

        // Wait two seconds before checking again
        await wait(2000);
        return await this.checkTradeUrl(tradeUrl);
    }
}

export default bitskinsWebAutomationModule;
