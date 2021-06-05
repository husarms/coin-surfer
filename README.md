                       88                                                 ad88                       
                       ""                                                d8"                         
                                                                         88                          
 ,adPPYba,  ,adPPYba,  88 8b,dPPYba,  ,adPPYba, 88       88 8b,dPPYba, MM88MMM ,adPPYba, 8b,dPPYba,  
a8"     "" a8"     "8a 88 88P'   `"8a I8[    "" 88       88 88P'   "Y8   88   a8P_____88 88P'   "Y8  
8b         8b       d8 88 88       88  `"Y8ba,  88       88 88           88   8PP""""""" 88          
"8a,   ,aa "8a,   ,a8" 88 88       88 aa    ]8I "8a,   ,a88 88           88   "8b,   ,aa 88          
 `"Ybbd8"'  `"YbbdP"'  88 88       88 `"YbbdP"'  `"YbbdP'Y8 88           88    `"Ybbd8"' 88          
                                                                                                

# coin-surfer
Node.js app for automated cryptocurrency trading

## Setup
1. Currently using the Coinbase Pro API https://docs.pro.coinbase.com/ - will require an account
2. Create a secrets.js file under the "gateways" folder with your own key, secret and passphrase
3. Set your own parameters for cryptocurrency, buy / sell thresholds and budget in index.js

## How to run
1. Navigate to the main directory
2. Run npm install
3. Run node index.js (or node index.js > log.file.txt to save a log)
