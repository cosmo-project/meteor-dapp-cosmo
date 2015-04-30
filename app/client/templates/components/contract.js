/**
Template Controllers

@module Templates
*/

/**
The contract tempalte.

@class [template] components_contract
@constructor
*/

Template['components_contract'].created = function() {    
    this.contractBalance = Meteor.setInterval(function() {
        if(Session.get('contractAddress') != ""){
            var address = Session.get('contractAddress');
            var originalBalance = 0;
            var balance = web3.eth.getBalance(address);
            var originalBalance = web3.toDecimal(balance);

            Session.set("contractBalance", web3.fromWei(balance, 'ether').toString(10));
        }
    }, 1 * 10000);
};