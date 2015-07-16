/**
Template Controllers

@module Templates
*/

/**
The settings template

@class [template] components_settings
@constructor
*/

Template['components_settings'].rendered = function(){
    var rpcProvider = LocalStore.get('rpcProvider');
    
    if(!_.isEmpty(rpcProvider))
        $('#rpcProvider').val(rpcProvider);
};

Template['components_settings'].helpers({
});

Template['components_settings'].events({
    
    /**
    On the change of rpc provider. 

    @event (keyup #rpcProvider)
    */
    
    'keyup #rpcProvider': function(){   
        var rpcProvider = String($('#rpcProvider').val());
        var rpcProviderParsed = rpcProvider.replace(/.*?:\/\//g, ""); // remove http://
        var providerData = rpcProviderParsed.split(":");        
        Session.set('providerHost', ((providerData.length >= 1) ? providerData[0] : ""));
        Session.set('providerPort', ((providerData.length >= 2) ? providerData[1] : ""));
        
        LocalStore.set('rpcProvider', rpcProvider);
    },
    
    /**
    Attempt connecting.

    @event (click #connect)
    */
    
    'click #connect': function(){        
        try{
            var rpcProvider = String($('#rpcProvider').val());     
            web3.setProvider(new web3.providers.HttpProvider(rpcProvider));
            web3.reset();            
            var testGas = web3.eth.gasPrice; 
            Session.set('consoleData', Session.get('consoleData') + 'Web3 Connected! HTTPProvider -> ' + rpcProvider + '\n');  
            Session.set('connected', true);
            Session.set('web3', {
                coinbase: web3.eth.coinbase,
                listening: web3.net.listening,
                peerCount: web3.net.peerCount,
                accounts: web3.eth.accounts,
                gasPriceRaw: web3.eth.gasPrice.toNumber(10),
                gasPrice: web3.fromWei(web3.eth.gasPrice.toNumber(10), LocalStore.get('etherUnit')).toString(10) + ' ' + String(LocalStore.get('etherUnit')).substr(0, 3),
                version: web3.version.api,
                client: web3.version.client,
                mining: web3.eth.mining
            });
            
            web3.eth.getAccounts(function(err, accounts){
                _.each(accounts, function(account, accountIndex){
                    Accounts.upsert({address: account}, {address: account, number: accountIndex});
                });
            });
            
            var coinbase = web3.eth.coinbase;
            var balance = web3.eth.getBalance(coinbase);
            var blockNumber = web3.eth.blockNumber;

            Session.set("balance", balance.toString(10));
            Session.set("blockNumber", blockNumber);
            $('#connect').blur();
        }catch(e){
            Session.set('consoleData', Session.get('consoleData') + String(e) + '\n');
        }
    },
});