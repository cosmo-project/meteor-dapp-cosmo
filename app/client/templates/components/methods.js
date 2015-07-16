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
        if(!Cosmo.isConnected())
            return [];
        
        var accounts_arr = [];

        _.each(Cosmo.web3().accounts, function(account, index){
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
        var gas = parseInt($('#methodGas').val());
        var value = parseInt($('#methodValue').val());
        var consoleObject = Session.get('consoleData');
        var call = "";

        if(from == "")
            from = Cosmo.web3().accounts[0];

        if(gas == "" || gas == 0)
            gas = 900000;
        
        if(_.isEmpty(value))
            value = 0;
        
        var methodArguments = [];        
        _.each(methodObject.inputs, function(argumentRaw, index){
            var arg = $('#input_' + argumentRaw.name).val();
            
            methodArguments.push(arg);
        });        
        
        methodArguments.push({from: from, gas: gas, gasPrice: Cosmo.web3().gasPriceRaw});
        methodArguments.push(function(err, result){
            var resultArray = result;
            
            // THIS IS THE WORKING POINT
            if(methodObject.outputs.length > 1) {
                _.each(result, function(item, itemIndex){
                    if(methodObject.outputs[itemIndex].type == 'bytes32')
                        resultArray[itemIndex] = String(web3.toAscii(resultArray[itemIndex]));
                });
            }
            
            console.log(resultArray);
            
            Cosmo.console('Call -> ' 
                          + contractName 
                          + ' @ ' 
                          + contractAddress.substr(0, 5) 
                          + '.. ' 
                          + methodObject.nameClean 
                          + '(' 
                          + String(methodArguments.slice(0, methodArguments.length - 2)) + ')' 
                          + ':'
                          + "\n" + ' ' 
                          + String(resultArray));
        });

        if($('#method').val() == "blank") {
            web3.eth.call(methodArguments);
        }else{
            call = Cosmo.contract[methodObject.nameClean].call.apply(this, methodArguments);
        }

        if(_.isObject(call))
            call = call.toString(10);
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
        
        if(gas == 0 || _.isEmpty(gas) || gas == NaN) {
            transactionOptions.gas = 1800000;
            transactionOptions.gasPrice = Cosmo.web3().gasPriceRaw;
        }
        
        if(gas > 0) {
            transactionOptions.gas = gas;
            transactionOptions.gasPrice = Cosmo.web3().gasPriceRaw;
        }
        
        if(_.isEmpty(value)){
            transactionOptions.value = 0;
        }else{
            transactionOptions.value = value;
        }
        
        var methodArguments = [];        
        _.each(methodObject.inputs, function(argumentRaw, index){
            var arg = $('#input_' + argumentRaw.name).val();
            
            if(argumentRaw.isArray)
                arg = arg.split(',');
            
            methodArguments.push(arg);
        });

        if($('#method').val() == "blank") {
            transactionOptions.to = contractAddress;
            transact = web3.eth.sendTransaction(transactionOptions, function(err, result){
                if(!_.isEmpty(err))
                    Cosmo.console(err);
            });
        }else{
            methodArguments.push(transactionOptions);
            methodArguments.push(function(err, result){
                if(!_.isEmpty(err))
                    Cosmo.console(err);
            });
            
            transact = Cosmo.contract[methodObject.nameClean].sendTransaction.apply(this, methodArguments);
        }
        
        Cosmo.console('Tx -> ' + contractName + ' @ ' + contractAddress.substr(0, 5) + '.. ' + methodObject.nameClean + '(' + String(methodArguments.slice(0, methodArguments.length - 2)) + ')');

        //Session.set('consoleData', String(consoleObject) + '\nTx -> ' + contractName + ' @ ' + contractAddress.substr(0, 5) + '.. ' + methodObject.nameClean + '(' + String(methodArguments) + ')');
        
    }, 
});