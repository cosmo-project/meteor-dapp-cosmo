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
            web3.eth.getBalance(address, function(err, result){
                var balance = result;
                var originalBalance = web3.toDecimal(balance);
                Session.set("contractBalance", web3.fromWei(balance, 'ether').toString(10));
                
                if(!_.isEmpty(err))
                    Cosmo.console(err);
            });
        }
    }, 1 * 10000);
};

//cleanAbi

Template['components_contract'].events({   
    /**
    Clean up ABI.

    @event (click #cleanAbi)
    */
    
    'click #cleanAbi': function(){
        var abi = Session.get('abi');
        Session.set('abi', abi.replace(/(\r\n|\n|\r|\t)/gm,"").replace(/ +(?= )/g,''));
        $('#cleanAbi').hide();
        Session.set('auto', false);
    },
    
    
    /**
    Select all text when you click contract abi.

    @event (click #contractAbi)
    */
    
    'click #contractAbi': function(){
        $('#contractAbi').selectText();
    },
});