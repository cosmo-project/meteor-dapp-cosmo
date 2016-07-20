# meteor-dapp-cosmo
A MeteorJS realtime solidity development environment DApp.

<img src="app/public/images/screen.jpg" />

** Please note that this DApp is still in Alpha (still working out the bugs).

[DEPRETIATED] -- please use and contribute too: https://github.com/cosmo-project/cosmo, currently under construction however.

## <a name="hosted"></a> Alpha

http://meteor-dapp-cosmo.meteor.com/

## <a name="installation"></a> Installation

Clone this repo

    $ git clone http://github.com/SilentCicero/meteor-dapp-cosmo.git

Start a local geth node:

    $ geth --rpc --rpcaddr="localhost" --mine --unlock=primary --rpcport="8080" --rpccorsdomain="http://localhost:3000" --loglevel=5 --maxpeers=0

Start Cosmo using Meteor

    $ cd meteor-dapp-cosmo/app
    $ meteor

Goto http://localhost:3000, enjoy!

## <a name="functionality"></a> DApp Functionality
- Deploy and test solidity contracts
- Vet contracts using function calls/transactions
- Switch between auto and manual compiling mode
- See your node information in realtime
- Immediate JSON contract descriptions

## <a name="layout"></a> Page Layout
- Source code editor (left column)
- Realtime contract & contract function information (middle column)
- Accounts and console for method testing (right column)

## <a name="about"></a> About

This DApp will help developers code in solidity, so they can build solid contracts in realtime that are thoroughly vetted.

Cosmo uses Chriseth's <a href="http://chriseth.github.io/cpp-ethereum/">Realtime Browser Compiler</a>.

## <a name="todo"></a> TODO
- Better i18n
- Event Handling/Testing Interface
