window.onerror = function() { debugger; }

/**
Helper functions

@module Helpers
**/

/**
The Cosmo Class.

@class Cosmo
@constructor
**/

Cosmo = {};

/**
The Cosmo contract object.

@var (ContractObject)
**/

Cosmo.ContractObject;

/**
The Cosmo contract instance.

@var (contract)
**/

Cosmo.contract;

/**
If Cosmo is connected to Web3.

@method (isConnected)
**/

Cosmo.isConnected = function(){
    if(Session.get('connected'))
        return true;
};

/**
Tailors web3 object for session data.

@var (web3)
**/

Cosmo.web3 = function(){
    return Session.get('web3');
};

/**
The current contract address.

@var (address)
**/

Cosmo.address;

/**
The main ACE editor object.

@var (editorObject)
**/

Cosmo.editorObject;

/**
On ace editor ready.

@var (editorReady)
**/

Cosmo.runtimeInit = false;

/**
The previous input of the ace editor.

@var (previousInput)
**/

Cosmo.previousInput = '';

/**
Deploy the contract live on the blockchain.

@method (deploy)
@param {Array} contract description
@param {Object} transaction options for the deployment.
@return {String} the address of the new contract.
**/

Cosmo.deploy = function(contractAbi, transactionOptions, callback){
    this.ContractObject = web3.eth.contract(contractAbi); 
        
    // Set coinbase as the default account
    web3.eth.defaultAccount = web3.eth.coinbase;  
        
    // Watch Filter
    watch = web3.eth.filter('latest');
    
    this.ContractObject.new(transactionOptions, function(err, contract){ 
        var mined = false;
        
        if(!err) {
            Cosmo.address = contract.address;
            Cosmo.contract = Cosmo.ContractObject.at(Cosmo.address);
            
            watch.watch(function (err, hash) {
                var block = web3.eth.getBlock(hash, true); 
                mined = block.transactions.reduce(function (mined, th) {
                    // TODO: compiled code do not have 0x prefix
                    return mined || (th.from === web3.eth.defaultAccount && th.input.indexOf(transactionOptions.data) !== -1);
                }, false);
                
                if(!mined)
                    return;
                
                callback(err, contract, mined);
                watch.stopWatching();
            });
        }        
        
        callback(err, contract, mined);
    });
};

/**
Compile JSON data from contract.

@method (compileJSON)
@param {String} the input solidity code string to be compiled.
**/

Cosmo.compileJSON = function(input){ 
    var compiler = Module.cwrap("compileJSON", "string", ["string", "number"]);
    return compiler(input, 1);
}

/**
The output that will goto the output window.

@method (output)
@param {String} the output string.
**/

Cosmo.output = function(o) {
    Session.set('output', String(o));
};

/**
The console output command. Add a line to the console.

@method (console)
@param {String} the new output string.
**/

Cosmo.console = function(o) {
    Session.set('consoleData', Session.get('consoleData') + '\n' + String(o));
    $("#consolePre").scrollTop($("#consolePre")[0].scrollHeight + 20);
};

/**
Render contracts from JSON.

@method (renderContracts)
@param {JSON} the JSON objects containing the contracts.
@param {String} the raw string containing the objects.
**/

Cosmo.renderContracts = function(data, source) {
    // Get last contract name.
    var craw_1 = source.lastIndexOf("contract");
    var craw_2 = source.indexOf("{", craw_1);
    var craw_3 = source.substr(craw_1 + 8, craw_2 - craw_1);
    var craw_4 = craw_3.trim().split(" ");
    var contractName = craw_4[0].trim();
    var contract = data.contracts[contractName];
    var contractMethods;
    var contractEvents = [];
    
    if(_.isUndefined(contract) || _.isEmpty(contractName))
        return;

    Session.set("contractName", contractName);
    Session.set('contractBytes', (contract.bytecode.length / 2));
    Session.set("hex", contract.bytecode);
    Session.set("abi", JSON.stringify(JSON.parse(contract.interface), null, 2));
    Session.set('contractInterface', contract.solidity_interface);
    
    try{
        contractMethods = JSON.parse(contract.interface);
        Session.set("contractAbi", contractMethods);
    }catch(exception){
        return;
    }
    
    Cosmo.output('===== ' + contractName + ' =====' + 
                 '\nInterface: \n' + contract.solidity_interface + 
                 '\n\n Hex: \n' + contract.bytecode + 
                 '\n\n Opcodes: \n' + contract.opcodes);
    
    if(!_.isArray(contractMethods))
        return;
    
    

    _.each(contractMethods, function(item, index){
        item.index = index;
        item.hasInputs = false;
        item.hasOutputs = false;
        item.callable = false;
        item.transactable = false;
        item.nameClean = item.name;
        
        if(!_.isArray(item.outputs))
            return;
            
        if(item.outputs.length > 0)
            item.callable = true;
            item.hasOutputs = true;

        if(item.outputs.length == 0)
            item.transactable = true;

        if(item.inputs.length > 0)
            item.hasInputs = true;

        item.arguments = [];

        _.each(item.inputs, function(input, inputIndex){
            input.kind = "";
            input.isArray = false;
            input.isInt = false;
            input.isBytes = false;
            input.isBool = false;
            input.isAddress = false;
            input.isHash = false;
            item.arguments.push(input.type);
            
            if(_.isEmpty(input.name))
                input.name = input.type;
            
            if(input.type.indexOf("[") !== -1 && input.type.indexOf("]") !== -1) // TODO more support to come..
                input.isArray = true;

            if(input.type.indexOf("int") !== -1){
                input.kind = "int";
                input.isInt = true;
            }

            if(input.type.indexOf("bytes") !== -1){
                input.kind = "bytes";
                input.isBytes = true;
            }

            if(input.type.indexOf("string") !== -1){
                input.kind = "string";
                input.isBytes = true;
            }

            if(input.type.indexOf("hash") !== -1){
                input.kind = "hash";
                input.isHash = true;
            }

            if(input.type.indexOf("address") !== -1){
                input.kind = "address";  
                input.isAddress = true;     
            }

            if(input.type.indexOf("bool") !== -1){
                input.kind = "bool";
                input.isBool = true;
            }
        });

        if(item.inputs.length > 0)
            item.name = item.name + "(" + String(item.arguments) + ")";
    });

    Session.set('contractMethods', contractMethods);
    var selectedMethod = Session.get('method');
    
    
    _.each(JSON.parse(contract.interface), function(item, index){
        if(item.type != "event")
            return;

        _.each(item.inputs, function(input, index){
            if(_.isUndefined(item.type))
                return;
            
            if(input.type.indexOf("string") !== -1 
              || input.type.indexOf("byte") !== -1
              || input.type.indexOf("hash") !== -1
              || input.type.indexOf("address") !== -1)
                input.isText = true;

            if(input.type.indexOf("int") !== -1)
                input.isNumber = true;

            if(input.type.indexOf("bool") !== -1)
                input.isBool = true;
        });
        
        contractEvents.push(item);
    });
    
    Session.set('contractEvents', contractEvents);
    Session.set('event', {});
    
    if(contractEvents.length > 0)
        Session.set('event', contractEvents[0]);
    
    
    if(!_.isEmpty(selectedMethod))
        Session.set('method', contractMethods[selectedMethod.index]);
    
    
    if(!Session.get('boot')) {
        Session.set('boot', true);
        Session.set('auto', false); // on boot set auto to false.   
    }
};

/**
Turn Solidity code into interface.

@method (onAceUpdate)
@param {Object} event object that is passed on ace update.
**/

Cosmo.onAceUpdate = function(e) {
    var editor = Cosmo.editorObject;
    var input = editor.getValue();
    var data;
    
    LocalStore.set('contractStore', input);
        
    if(!Session.get('auto') && !Session.get('refresh'))
        return;
    
    if(!Cosmo.runtimeInit)
        return;
    
    if (input == Cosmo.previousInput)
        return;
    
    try {
        data = $.parseJSON(Cosmo.compileJSON(input, 1));
    } catch (exception) {
        Cosmo.output("Uncaught JavaScript Exception:\n" + exception + '\n\n' + 'Note, Chrome/Chromium currently reports "Uncaught JavaScript Exception". To work around this problem, enable the debug console (Ctrl+Shift+i) and reload.');
        return;
    }
    
    if (data['error'] !== undefined) {
        Cosmo.output(data['error']);
        
        if(String(data['error']).indexOf('during compilation') !== -1)
        Cosmo.output(data['error'] + ' \n\nNote, Chrome/Chromium currently reports "Unknown exception during compilation.". To work around this problem, enable the debug console (Ctrl+Shift+i) and reload.');
    } else{ 
        Cosmo.renderContracts(data, input);
    }
    
    // Update Clear Button
    $('#cleanAbi').show();
};