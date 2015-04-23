# meteor-dapp-cosmo
A MeteorJS realtime solidity dev. environment DApp.

<img src="app/public/images/screen.jpg" />

** Please note that this DApp is still in Alpha (still working out the bugs and speed issues).

## <a name="installation"></a> Installation

Clone this repo

    $ git clone http://github.com/SilentCicero/meteor-dapp-cosmo.git

Start a local geth node:

    $ geth --rpc --rpcaddr="localhost" --mine --unlock=primary --rpcport="8080" --rpccorsdomain="http://localhost:3000" --loglevel=5 --maxpeers=0

Start your app using meteor

    $ cd meteor-dapp-cosmo/app
    $ meteor

Wait for mining, refresh, enjoy!

## <a name="functionality"></a> DApp Functionality
- deploy solidity contracts
- vet contracts using method calls/transactions
- switch between auto and manual compiling mode
- see your node information in realtime

## <a name="layout"></a> Page Layout
- Source code editor (left column)
- Realtime contract & contract function information (middle column)
- Accounts and console for method testing (right column)

## <a name="about"></a> About

This DApp will help solidity developers, built well vetted contracts in realtime with a light and simple development environment.

Original compiler build by Gav's Solidity CPP and Chriseth's <a href="http://chriseth.github.io/cpp-ethereum/">Realtime Browser Compiler</a>.

## <a name="todo"></a> TODO
- Fix speed issue with compiling
- Allow DApp to boot even without no GETH connection
- Deploy on meteor.com