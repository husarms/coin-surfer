/*
    Example secrets file 
    Create your own in this directory and name it "secrets.ts"
    It should be excluded from source control via .gitignore
*/
export default {
    CoinbaseConfiguration: {
        key: "<Add your key here>",
        secret: "<Add your secret here>",
        passphrase: "<Add your passphrase here>",
    },
    SendGridConfiguration : {
        apiKey: "<Add your api key here>",
    },
    Email: {
        toAddress: "<Add your to address here>",
        fromAddress: "<Add your from address here>",
    },
};
