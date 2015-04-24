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

Cosmo.deploy = function(contractAbi, transactionOptions){
    this.ContractObject = web3.eth.contract(contractAbi);        
    this.address = web3.eth.sendTransaction(transactionOptions);
    this.contract = new this.ContractObject(this.address);
    return this.address;
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
The output that will goto the console output window.

@method (output)
@param {String} the output string.
**/

Cosmo.output = function(o) {
    Session.set('output', String(o));
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
    
    if(_.isUndefined(contract) || _.isEmpty(contractName))
        return;

    Session.set("contractName", contractName);
    Session.set('contractBytes', (contract.bytecode.length / 2));
    Session.set("hex", contract.bytecode);
    Session.set("abi", contract.interface);
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

    _.each(contractMethods, function(item, index){
        item.index = index;
        item.hasInputs = false;
        item.hasOutputs = false;
        item.callable = false;
        item.transactable = false;
        item.nameClean = item.name;

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
            input.isArray = "";
            input.isInt = false;
            input.isBytes = false;
            input.isBool = false;
            input.isAddress = false;
            input.isHash = false;
            item.arguments.push(input.type);
            
            if(_.isEmpty(input.name))
                input.name = input.type;

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

    if(!_.isEmpty(selectedMethod))
        Session.set('method', contractMethods[selectedMethod.index]);
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
        
    if(!Session.get('auto') && !Session.get('refresh'))
        return;
    
    if(!Cosmo.runtimeInit)
        return;
    
    if (input == Cosmo.previousInput)
        return;
    
    try {
        data = $.parseJSON(Cosmo.compileJSON(input, 1));
    } catch (exception) {
        Cosmo.output("Uncaught JavaScript Exception:\n" + exception + '\n\n' + ' Chrome/Chromium currently reports "Uncaught JavaScript Exception". To work around this problem, enable the debug console (Ctrl+Shift+i) and reload.');
        return;
    }
    
    if (data['error'] !== undefined)
        Cosmo.output(data['error']);
    else
        Cosmo.renderContracts(data, input);
};

/*Cosmo.onAceUpdate = function(e) {
    var editor = Cosmo.editorObject;
    var input = editor.getValue();
    try {
        if(Session.get('auto') == false && Session.get('refresh') != true)
            return;
        
        var output = Cosmo.compileString(input); 

        var craw_1 = input.lastIndexOf("contract");
        var craw_2 = input.indexOf("{", craw_1);
        var craw_3 = input.substr(craw_1 + 8, craw_2 - craw_1);
        var craw_4 = craw_3.trim().split(" ");
        var contractName = craw_4[0].trim();

        Session.set('contractName', contractName);
        
        if(output.indexOf("======= "+contractName+" =======") == -1) {
            Session.set('output', output.trim());
            return;
        }

        var raw_1 = output.trim().between("======= "+contractName+" =======", "VM assembly:").trim();                

        if(output.indexOf(contractName) !== -1){
            Session.set('output', "======= "+contractName+" =======" + '\n' + output.trim().between("======= "+contractName+" =======", "EVM assembly:"));
        }else{
            Session.set('output', output.trim());
        }

        var raw_2 = raw_1.indexOf("{") + 1;
        var raw_3 = raw_1.lastIndexOf("}");
        var raw_4 = raw_1.substr(raw_2, raw_3 - raw_2);
        var raw_5 = raw_4.split("function");
        
        // Get Solidity Interface
        var solidityInterface = raw_1.between("Interfaces:", "Opcodes:");
        var lastBracket = solidityInterface.lastIndexOf('}');
        solidityInterface = solidityInterface.substr(0, lastBracket);
        solidityInterface = solidityInterface.trim().collapseWhitespace();
        
        Session.set('contractInterface', solidityInterface);

        var abi = [];

        _.each(raw_5, function(item, index){
            var raw_10 = String(item).trim(); // remove white spaces
            var raw_11 = raw_10.indexOf("("); // first '('

            if(raw_10.length < 3 || raw_11 === -1)
                return;

            var name = raw_10.substr(0, raw_11); // func name
            var raw_12 = raw_10.indexOf(")", raw_11 - 2) // end param ')'
            var raw_13 = raw_10.substr(raw_11 + 1, raw_12 - raw_11 - 1); // input params

            var raw_input_params = raw_13.trim(); // trim
            raw_input_params = raw_input_params.split(','); // to arr
            var input_params = [];

            _.each(raw_input_params, function(raw_input_param){
                raw_input_param = raw_input_param.trim();

                if(raw_input_param.length < 3)
                    return;

                raw_input_param = raw_input_param.split(' ');

                var inputParamName = raw_input_param[1];

                if(_.isUndefined(inputParamName))
                    inputParamName = "";

                var inputParamObj = {
                    "name": inputParamName,
                    "type": raw_input_param[0]
                };

                input_params.push(inputParamObj);
            });

            var functionParams = "";

            if(input_params.length > 0) {
                functionParams += "(";
                _.each(input_params, function(input_param, index){
                    var putComma = index != input_params.length - 1 ? ',' : '';
                    functionParams += input_param.type + putComma;
                });         
                functionParams += ")";     
            }

            var output_params = [];

            if(raw_10.indexOf("returns") !== -1){
                var raw_15 = raw_10.indexOf("returns");
                var raw_16 = raw_10.indexOf("(", raw_15 + 5);
                var raw_17 = raw_10.indexOf(")", raw_16);
                var raw_18 = raw_10.substr(raw_16 + 1, raw_17 - raw_16 - 1);

                var raw_output_params = raw_18.trim(); // trim
                raw_output_params = raw_output_params.split(','); // to arr

                _.each(raw_output_params, function(raw_output_param){

                    raw_output_param = raw_output_param.trim();

                    if(raw_output_param.length < 3)
                        return;

                    raw_output_param = raw_output_param.split(' ');

                    var outputParamName = raw_output_param[1];

                    if(_.isUndefined(outputParamName))
                        outputParamName = "";

                    var outputParamObj = {
                        "name": outputParamName,
                        "type": raw_output_param[0]
                    };

                    output_params.push(outputParamObj);

                });
            }

            var isConstant = false;

            if(raw_10.indexOf("constant") !== -1)
                isConstant = true;

            var funcObj = {
                "name": name + functionParams,
                "constant": isConstant,
                "type": "function",
                "inputs": input_params,
                "outputs": output_params
            };

            abi.push(funcObj);
        });

        var hex = raw_1.between("Hex: ", "E");
        hex = hex.collapseWhitespace();
        hex = hex.replace(/ /g,'');

        Session.set('contractBytes', hex.length);
        Session.set('hex', hex);
        Session.set('contractAbi', abi);
        Session.set('abi', JSON.stringify(abi, null, 2));

        var contractMethods = abi;

        _.each(contractMethods, function(item, index){
            item.index = index;
            item.hasInputs = false;
            item.hasOutputs = false;
            item.callable = false;
            item.transactable = false;

            var nameClean = item.name.split("(");
            item.nameClean = nameClean[0];

            if(item.outputs.length > 0)
                item.callable = true;
                item.hasOutputs = true;

            if(item.outputs.length == 0)
                item.transactable = true;

            if(item.inputs.length > 0)
                item.hasInputs = true;

            _.each(item.inputs, function(input, inputIndex){
                input.kind = "";
                input.isArray = "";
                input.isInt = false;
                input.isBytes = false;
                input.isBool = false;
                input.isAddress = false;
                input.isHash = false;

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
        });

        Session.set('contractMethods', contractMethods);
        var selectedMethod = Session.get('method');

        if(!_.isEmpty(selectedMethod))
            Session.set('method', contractMethods[selectedMethod.index]);

    } catch (exception) {
        Session.set('output', "Uncaught JavaScript Exception:\n" + exception + '\n\n' + ' Chrome/Chromium currently reports "Uncaught JavaScript Exception". To work around this problem, enable the debug console (Ctrl+Shift+i) and reload.');
    }
};*/