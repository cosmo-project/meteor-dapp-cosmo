/**
Template Controllers

@module Templates
*/

/**
The accounts template

@class [template] components_accounts
@constructor
*/

Template['components_accounts'].helpers({    
	/**
    Convert Wei to Ether Values

    @method (toEth)
    */

	'toEth': function(wei){
		return web3.fromWei(wei, 'ether').toString(10);
	},

	/**
    Get Eth Accounts

    @method (accounts)
    */

	'accounts': function(){
        if(!Cosmo.isConnected())
            return [];
        
        var accountsArray = [];
		var count = 0;
		_.each(Cosmo.web3().accounts, function(address){
			count += 1;
			accountsArray.push({number: count, address: address, balance: web3.eth.getBalance(address).toString(10), short: address.substr(0, 9) + '..'});
		});
        return accountsArray;
	},
});
