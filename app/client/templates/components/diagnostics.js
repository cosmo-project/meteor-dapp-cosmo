/**
Template Controllers

@module Templates
*/

/**
The accounts template

@class [template] components_diagnostics
@constructor
*/
    
Template['components_diagnostics'].created = function() {
    this.updateBalance = Meteor.setInterval(function() {
        var coinbase = web3.eth.coinbase;
        var balance = web3.eth.getBalance(coinbase);
        var blockNumber = web3.eth.blockNumber;

        Session.set("balance", balance.toString(10));
        Session.set("blockNumber", blockNumber);
    }, 1 * 1000);
};

Template['components_diagnostics'].helpers({
	/**
    Get the number of accounts.

    @method (accountCount)
    */
    
	'accountCount': function(){
		return web3.eth.accounts.length;
	},  
    
	/**
    Get whether web3 object exists.

    @method (web3Exists)
    */
    
	'web3Exists': function(){
		return (_.isObject(web3) ? 'True' : 'False');
	},
    
	/**
    Get whether web3 object exists.

    @method (web3Exists)
    */
    
	'balance': function(){
		return web3.fromWei(Session.get('balance'), 'ether').toString(10) + ' ' + 'ether';
	},

	/**
    Get coinbase address.

    @method (coinbase)
    */
    
	'coinbase': function(){
		return web3.eth.coinbase.substr(0, 9);
	},

	/**
    See if client is listening.

    @method (listening)
    */
    
	'listening': function(){
		return (_.isUndefined(web3.net) ? '--' : web3.net.listening);
	},

	/**
    Get number of peers.

    @method (peerCount)
    */
    
	'peerCount': function(){
		return (_.isUndefined(web3.net) ? '--' : web3.net.peerCount);
	},

	/**
    Get gas price.

    @method (gasPrice)
    */
    
	'gasPrice': function(){
		return web3.eth.gasPrice;
	},

	/**
    Get version.

    @method (version)
    */
    
	'version': function(){
		return web3.version.api;
	},

	/**
    Get client version.

    @method (client)
    */
    
	'client': function(){
		return web3.version.client;
	},

	/**
    Get default block number. (Not working for Go Eth Cli).

    @method (defaultBlock)
    */
    
	'defaultBlock': function(){
		return web3.eth.defaultBlock;
	},

	/**
    Get present block number.

    @method (blockNumber)
    */
    
	'blockNumber': function(){
		return Session.get('blockNumber');
	},

	/**
    Get whether mining is turned on.

    @method (mining)
    */
    
	'mining': function(){
		return web3.eth.mining;
	},
});