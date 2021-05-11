const CoinbasePro = require("coinbase-pro");
const Secrets = require("./secrets");

const productionURI = "https://api.pro.coinbase.com";
const sandboxURI = "https://api-public.sandbox.pro.coinbase.com";

const authenticatedProductionClient = new CoinbasePro.AuthenticatedClient(
    Secrets.CoinbaseProductionConfiguration.key,
    Secrets.CoinbaseProductionConfiguration.secret,
    Secrets.CoinbaseProductionConfiguration.passphrase,
    productionURI
);

const authenticatedSandboxClient = new CoinbasePro.AuthenticatedClient(
    Secrets.CoinbaseSandboxConfiguration.key,
    Secrets.CoinbaseSandboxConfiguration.secret,
    Secrets.CoinbaseSandboxConfiguration.passphrase,
    sandboxURI
);

module.exports = {
    getProductTicker: async function (product_id) {
        return authenticatedProductionClient
            .getProductTicker(product_id)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    getProduct24HrStats: async function (product) {
        return authenticatedProductionClient
            .getProduct24HrStats(product)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    getAccount: async function (account_id) {
        return authenticatedProductionClient
            .getAccount(account_id)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    getAccounts: async function () {
        return authenticatedProductionClient
            .getAccounts()
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    getCoinbaseAccounts: async function () {
        return authenticatedProductionClient
            .getCoinbaseAccounts()
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    getFills: async function (productId) {
        return authenticatedProductionClient
            .getFills({product_id: productId})
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    limitBuy: async function (price, size, product_id) {
        return authenticatedProductionClient
            .buy({
                price,
                size,
                product_id,
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    marketBuy: async function (funds, size, product_id) {
        return authenticatedProductionClient
            .buy({
                type: 'market',
                funds,
                size,
                product_id,
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    limitSell: async function (price, size, product_id) {
        return authenticatedProductionClient
            .sell({
                price,
                size,
                product_id,
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    marketSell: async function (size, product_id) {
        return authenticatedProductionClient
            .sell({
                type: 'market',
                size,
                product_id,
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
};
