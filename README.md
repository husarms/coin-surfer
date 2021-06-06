# coin-surfer
Node.js app for automated cryptocurrency trading

## Setup
1. Currently using the Coinbase Pro API https://docs.pro.coinbase.com/ - will require an account
2. Create a secrets.ts file under the "gateways" folder with your own key, secret and passphrase
3. Set your own parameters for cryptocurrency, buy / sell thresholds and budget in index.js

## How to run
Navigate to the main directory
Install depedencies
```bash
npm install
```
Run 
```bash
npm run start
```
Run with log file
```bash
npm run start-and-log
```
