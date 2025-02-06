export default {
    CoinbaseAdvanced: {
        key: process.env.COINBASE_ADVANCED_API_KEY,
        secret: process.env.COINBASE_ADVANCED_API_SECRET,
    },
    CoinbaseCDP: {
        keyName: process.env.COINBASE_CDP_API_KEY_NAME,
        privateKey: process.env.COINBASE_CDP_PRIVATE_KEY,
    },
    SendGrid : {
        apiKey: process.env.SENDGRID_API_KEY,
        toAddress: process.env.SENDGRID_TO_ADDRESS,
        fromAddress: process.env.SENDGRID_FROM_ADDRESS,
    },
};

