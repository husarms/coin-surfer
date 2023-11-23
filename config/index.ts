export default {
    Coinbase: {
        key: process.env.COINBASE_API_KEY,
        secret: process.env.COINBASE_API_SECRET,
        passphrase: process.env.COINBASE_API_PASSPHRASE,
    },
    CoinbaseAdvanced: {
        key: process.env.COINBASE_ADVANCED_API_KEY,
        secret: process.env.COINBASE_ADVANCED_API_SECRET,
    },
    SendGrid : {
        apiKey: process.env.SENDGRID_API_KEY,
        toAddress: process.env.SENDGRID_TO_ADDRESS,
        fromAddress: process.env.SENDGRID_FROM_ADDRESS,
    },
};

