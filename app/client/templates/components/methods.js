/**
Template Controllers

@module Templates
*/

/**
The methods template

@class [template] components_methods
@constructor
*/

Template['components_methods'].helpers({    
	/**
    The selected method to interact with.

    @method (method)
    */
    
	'method': function(){
		return Session.get('method');
	},

	/**
    Get web3 accounts.

    @method (accounts)
    */
    
	'accounts': function(){
        var accounts_arr = [];
        
        _.each(web3.eth.accounts, function(account, index){
            var account_object = {
                index: index,
                address: account,
                short: account.substr(0, 9) + ".."
            };
            
            accounts_arr.push(account_object);
        });
        
		return accounts_arr;
	},
});

Template['components_methods'].events({    
    /**
    On change select of method.

    @event (change #method)
    */
    
    'change #method': function(){
        var contractMethods = Session.get('contractMethods');
        var method = {};
        
        if($('#method').val() == "blank"){
            method.name = "";
            method.nameClean = "";
            method.callable = true;
            method.transactable = true;
        }else{
            method = contractMethods[parseInt($('#method').val())];
        }            
            
        Session.set("method", method);  
    },
    
    /**
    On call.

    @event (click #methodCall)
    */
    
    'click #methodCall': function(){
        var contractAddress = Session.get('contractAddress');
        var contractName = Session.get('contractName');
        var methodObject = Session.get('method');
        
        if(contractAddress == "" || _.isEmpty(methodObject))
            return;
        
        var from = $('#methodFrom').val();
        var gas = $('#methodGas').val();
        var value = $('#methodValue').val();
        var consoleObject = Session.get('consoleData');
        var call = "";

        if(from == "")
            from = web3.eth.accounts[0];

        if(gas == "" || gas == 0)
            gas = 9000000;
        
        if(_.isEmpty(value))
            value = 0;
        
        var methodArguments = [];        
        _.each(methodObject.inputs, function(argumentRaw, index){
            var arg = $('#input_' + argumentRaw.name).val();
            
            methodArguments.push(arg);
        });

        if($('#method').val() == "blank") {
            call = web3.eth.call({from: from, to: contractAddress, gas: gas, value: value, gasPrice: web3.eth.gasPrice});
        }else{
            call = Cosmo.contract.call({from: from, gas: gas, gasPrice: web3.eth.gasPrice})[methodObject.nameClean].apply(this, methodArguments);
        }

        if(_.isObject(call))
            call = call.toString(10);

        Session.set('consoleData', String(consoleObject) + '\nCall -> ' + contractName + ' @ ' + contractAddress.substr(0, 5) + '.. ' + methodObject.nameClean + '(' + String(methodArguments) + ')' + ':' + "\n" + String(call));
        $("#consolePre").scrollTop($("#consolePre")[0].scrollHeight + 20);
    },
    
    /**
    On transact.

    @event (change #methodTransact)
    */
    
    'click #methodTransact': function(){
        var contractAddress = Session.get('contractAddress');
        var contractName = Session.get('contractName');
        var methodObject = Session.get('method');
        
        if(contractAddress == "" || _.isEmpty(methodObject))
            return;
        
        var from = $('#methodFrom').val();
        var gas = parseInt($('#methodGas').val());
        var value = $('#methodValue').val();
        var consoleObject = Session.get('consoleData');
        var transactionOptions = {from: web3.eth.accounts[0]};
        var call = "";

        if(_.isEmpty(from))
            from = web3.eth.accounts[0];
        
        if(gas == 0) {
            transactionOptions.gas = 1800000;
            transactionOptions.gasPrice = web3.eth.gasPrice;
        }
        
        if(gas > 0) {
            transactionOptions.gas = gas;
            transactionOptions.gasPrice = web3.eth.gasPrice;
        }
        
        if(_.isEmpty(value)){
            transactionOptions.value = 0;
        }else{
            transactionOptions.value = value;
        }
        
        var methodArguments = [];        
        _.each(methodObject.inputs, function(argumentRaw, index){
            var arg = $('#input_' + argumentRaw.name).val();
            
            methodArguments.push(arg);
        });

        if($('#method').val() == "blank") {
            transactionOptions.to = contractAddress;
            transact = web3.eth.sendTransaction(transactionOptions);
        }else{
            
            console.log(Cosmo.contract);
            
            transact = Cosmo.contract.sendTransaction(transactionOptions)[methodObject.nameClean].apply(this, methodArguments);
        }

        Session.set('consoleData', String(consoleObject) + '\nTx -> ' + contractName + ' @ ' + contractAddress.substr(0, 5) + '.. ' + methodObject.nameClean + '(' + String(methodArguments) + ')');
        $("#consolePre").scrollTop($("#consolePre")[0].scrollHeight + 20);
    }, 
});