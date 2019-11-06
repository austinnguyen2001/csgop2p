import { totp } from 'notp';
import base32 from 'thirty-two';

class bitskinsModule {
    constructor(bitskinsApiKey, bitskinsTwoFactor) {
        this.bitskinsTwoFactor = bitskinsTwoFactor;
        this.bitskinsApiKey = bitskinsApiKey;
    }
    getTwoFactorCode() {
        return totp.gen(base32.decode(this.bitskinsTwoFactor));
    }
}

export default bitskinsModule;