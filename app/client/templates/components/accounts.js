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
        return Accounts.find({});
	},
});
