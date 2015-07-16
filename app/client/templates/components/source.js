/**
Template Controllers

@module Templates
*/

/**
The accounts template

@class [template] components_source
@constructor
*/

Template['components_source'].created = function(){  
    var count = 0;
    this.runtimeInitInterval = Meteor.setInterval(function() {
        if(count >= 1)
            Cosmo.onAceUpdate({});
        
        if(Cosmo.runtimeInit) {
            count ++;
            return;
        }
    }, 1 * 2000);
};

Template['components_source'].rendered = function(){
    $.when(
    $.getScript( "/soljson.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
    ).done(function(){
        Module['onRuntimeInitialized'] = function() {
            Cosmo.runtimeInit = true;            
            
            Session.set('refresh', true);          
            Cosmo.editorObject.setValue(Cosmo.editorObject.getValue() + ' ');
            Session.set('refresh', false);
        };
    });  
};

Template['components_source'].helpers({
	/**
    On Ace editor render.

    @method (onAce)
    */
    
    'onAce': function(){ return function(editor){
        editor.setTheme('ace/theme/monokai');
        editor.getSession().setMode('ace/mode/javascript');
        editor.setShowPrintMargin(false);
        editor.getSession().setUseWrapMode(true);
        editor.getSession().setTabSize(4);
        editor.getSession().setUseSoftTabs(true);
        Cosmo.editorObject = editor;
        editor.getSession().on('change', Cosmo.onAceUpdate);
        
        if(!_.isEmpty(LocalStore.get('contractStore')))
            editor.insert(LocalStore.get('contractStore'));
        else
            editor.insert('contract Ballot {\n    \/\/ Create a new ballot with $(_numProposals) different proposals.\n    function Ballot() {\n        address sender = msg.sender;\n        chairperson = sender;\n        numProposals = 5;\n    }\n\n    \/\/ Give $(voter) the right to vote on this ballot.\n    \/\/ May only be called by $(chairperson).\n    function giveRightToVote(address voter) {\n        if (msg.sender != chairperson || voted[voter]) return;\n        voterWeight[voter] = 1;\n    }\n\n    \/\/ Delegate your vote to the voter $(to).\n    function delegate(address to) {\n        address sender = msg.sender;\n        if (voted[sender]) return;\n        while (delegations[to] != address(0) && delegations[to] != sender)\n            to = delegations[to];\n        if (to == sender) return;\n        voted[sender] = true;\n        delegations[sender] = to;\n        if (voted[to]) voteCounts[votes[to]] += voterWeight[sender];\n        else voterWeight[to] += voterWeight[sender];\n    }\n\n    \/\/ Give a single vote to proposal $(proposal).\n    function vote(uint8 proposal) {\n        address sender = msg.sender;\n        if (voted[sender] || proposal >= numProposals) return;\n        voted[sender] = true;\n        votes[sender] = proposal;\n        voteCounts[proposal] += voterWeight[sender];\n    }\n\n    function winningProposal() constant returns (uint8 winningProposal) {\n        uint256 winningVoteCount = 0;\n        uint8 proposal = 0;\n        while (proposal < numProposals) {\n            if (voteCounts[proposal] > winningVoteCount) {\n                winningVoteCount = voteCounts[proposal];\n                winningProposal = proposal;\n            }\n            ++proposal;\n        }\n    }\n\n    address public chairperson;\n    uint8 public numProposals;\n    mapping(address => uint256) public voterWeight;\n    mapping(address => bool) public voted;\n    mapping(address => uint8) public votes;\n    mapping(address => address) public delegations;\n    mapping(uint8 => uint256) public voteCounts;\n}\n');
        editor.gotoLine(0);
        editor.scrollToLine(0);
        editor.scrollToRow(0);
    }},
});

Template['components_source'].events({   
    /**
    Simple store.

    @event (click #contractSimpleStore)
    */
    
    'click #contractSimpleStore': function(){
        Session.set('refresh', true);
        var contractData = 'contract SimpleStorage {\n    uint storedData;\n    function set(uint x) {\n        storedData = x;\n    }\n    function get() constant returns (uint retVal) {\n        return storedData;\n    }\n}';
        Cosmo.editorObject.setValue(contractData);
        Session.set('refresh', false);
    },
    
    
    /**
    Name Reg.

    @event (click #contractNameReg)
    */
    
    'click #contractBallot': function(){
        Session.set('refresh', true);
        var contractData = 'contract Ballot {\n    \/\/ Create a new ballot with $(_numProposals) different proposals.\n    function Ballot() {\n        address sender = msg.sender;\n        chairperson = sender;\n        numProposals = 5;\n    }\n\n    \/\/ Give $(voter) the right to vote on this ballot.\n    \/\/ May only be called by $(chairperson).\n    function giveRightToVote(address voter) {\n        if (msg.sender != chairperson || voted[voter]) return;\n        voterWeight[voter] = 1;\n    }\n\n    \/\/ Delegate your vote to the voter $(to).\n    function delegate(address to) {\n        address sender = msg.sender;\n        if (voted[sender]) return;\n        while (delegations[to] != address(0) && delegations[to] != sender)\n            to = delegations[to];\n        if (to == sender) return;\n        voted[sender] = true;\n        delegations[sender] = to;\n        if (voted[to]) voteCounts[votes[to]] += voterWeight[sender];\n        else voterWeight[to] += voterWeight[sender];\n    }\n\n    \/\/ Give a single vote to proposal $(proposal).\n    function vote(uint8 proposal) {\n        address sender = msg.sender;\n        if (voted[sender] || proposal >= numProposals) return;\n        voted[sender] = true;\n        votes[sender] = proposal;\n        voteCounts[proposal] += voterWeight[sender];\n    }\n\n    function winningProposal() constant returns (uint8 winningProposal) {\n        uint256 winningVoteCount = 0;\n        uint8 proposal = 0;\n        while (proposal < numProposals) {\n            if (voteCounts[proposal] > winningVoteCount) {\n                winningVoteCount = voteCounts[proposal];\n                winningProposal = proposal;\n            }\n            ++proposal;\n        }\n    }\n\n    address public chairperson;\n    uint8 public numProposals;\n    mapping(address => uint256) public voterWeight;\n    mapping(address => bool) public voted;\n    mapping(address => uint8) public votes;\n    mapping(address => address) public delegations;\n    mapping(uint8 => uint256) public voteCounts;\n}\n';
        Cosmo.editorObject.setValue(contractData);
        Session.set('refresh', false);
    },
    
    /**
    Name Reg.

    @event (click #contractNameReg)
    */
    
    'click #contractNameReg': function(){
        Session.set('refresh', true);
        var contractData = '\/\/sol NameReg\n\/\/ Simple global name registrar.\n\/\/ @authors:\n\/\/   Gav Wood <g@ethdev.com>\n\ncontract NameRegister {\n\tfunction getAddress(string32 _name) constant returns (address o_owner) {}\n\tfunction getName(address _owner) constant returns (string32 o_name) {}\n}\n\nimport \"service\";\nimport \"owned\";\n\ncontract NameReg is service(1), owned, NameRegister {\n  \tevent AddressRegistered(address indexed account);\n  \tevent AddressDeregistered(address indexed account);\n\n\tfunction register(string32 name) {\n\t\t\/\/ Don\'t allow the same name to be overwritten.\n\t\tif (toAddress[name] != address(0))\n\t\t\treturn;\n\t\t\/\/ Unregister previous name if there was one.\n\t\tif (toName[msg.sender] != \"\")\n\t\t\ttoAddress[toName[msg.sender]] = 0;\n\t\t\t\n\t\ttoName[msg.sender] = name;\n\t\ttoAddress[name] = msg.sender;\n\t\tAddressRegistered(msg.sender);\n\t}\n\n\tfunction unregister() {\n\t\tstring32 n = toName[msg.sender];\n\t\tif (n == \"\")\n\t\t\treturn;\n\t\tAddressDeregistered(toAddress[n]);\n\t\ttoName[msg.sender] = \"\";\n\t\ttoAddress[n] = address(0);\n\t}\n\n\tfunction addressOf(string32 name) constant returns (address addr) {\n\t\treturn toAddress[name];\n\t}\n\n\tfunction nameOf(address addr) constant returns (string32 name) {\n\t\treturn toName[addr];\n\t}\n\t\n\tmapping (address => string32) toName;\n\tmapping (string32 => address) toAddress;\n}\n   ';
       
        Cosmo.editorObject.setValue(contractData);
        Session.set('refresh', false);
    },
    
    /**
    Coin Contract

    @event (click #contractCoin)
    */
    
    'click #contractCoin': function(){
        Session.set('refresh', true);     
        var contractData = 'contract Coin {\n    address minter;\n    mapping (address => uint) balances;\n\n    event Send(address from, address to, uint value);\n\n    function Coin() {\n        minter = msg.sender;\n    }\n    function mint(address owner, uint amount) {\n        if (msg.sender != minter) return;\n        balances[owner] += amount;\n    }\n    function send(address receiver, uint amount) {\n        if (balances[msg.sender] < amount) return;\n        balances[msg.sender] -= amount;\n        balances[receiver] += amount;\n        Send(msg.sender, receiver, amount);\n    }\n    function queryBalance(address addr) constant returns (uint balance) {\n        return balances[addr];\n    }\n}';
        Cosmo.editorObject.setValue(contractData);
        Session.set('refresh', false);
    },
    
    /**
    Crowdfunding Contract

    @event (click #contractCrowdfunding)
    */
    
    'click #contractCrowdfunding': function(){
        Session.set('refresh', true); 
        var contractData = 'contract CrowdFunding {\n  struct Funder {\n    address addr;\n    uint amount;\n  }\n  struct Campaign {\n    address beneficiary;\n    uint fundingGoal;\n    uint numFunders;\n    uint amount;\n    mapping (uint => Funder) funders;\n  }\n  uint numCampaigns;\n  mapping (uint => Campaign) campaigns;\n  function newCampaign(address beneficiary, uint goal) returns (uint campaignID) {\n    campaignID = numCampaigns++; \/\/ campaignID is return variable\n    Campaign c = campaigns[campaignID];  \/\/ assigns reference\n    c.beneficiary = beneficiary;\n    c.fundingGoal = goal;\n  }\n  function contribute(uint campaignID) {\n    Campaign c = campaigns[campaignID];\n    Funder f = c.funders[c.numFunders++];\n    f.addr = msg.sender;\n    f.amount = msg.value;\n    c.amount += f.amount;\n  }\n  function checkGoalReached(uint campaignID) returns (bool reached) {\n    Campaign c = campaigns[campaignID];\n    if (c.amount < c.fundingGoal)\n      return false;\n    c.beneficiary.send(c.amount);\n    c.amount = 0;\n    return true;\n  }\n}';
        Cosmo.editorObject.setValue(contractData);
        Session.set('refresh', false);
    },
    
    /**
    On refresh page.

    @event (click #refresh)
    */
    
    'click #refresh': function(){
        Session.set('refresh', true);          
        Cosmo.editorObject.setValue(Cosmo.editorObject.getValue() + ' ');
        Session.set('refresh', false);
    },
    
    /**
    Toggle auto update on/off.

    @event (click #auto)
    */
    
    'click #auto': function(){
        Session.set('auto', (Session.get('auto') ? false : true));
        $('#auto').blur();
    },
    
    /**
    on contract deploy.

    @event (change #method)
    */
    
    'click #deploy': function(){
        Session.set('isListening', false);
        Cosmo.console('Your contract is being deployed. This may take a minute...');
        var gasValue = parseInt($('#deployGas').val());
        var contractAbi = Session.get('contractAbi');
        var contractHex = Session.get('hex');
        var transactionOptions = {from: Cosmo.web3().accounts[0], data: contractHex};
        
        if(gasValue == 0 || _.isUndefined(gasValue) || _.isEmpty(gasValue)) {
            transactionOptions.gas = 1800000;
            transactionOptions.gasPrice = Cosmo.web3()
                .gasPriceRaw
                .toString(10);
        }
        
        if(gasValue > 0) {
            transactionOptions.gas = gasValue;
            transactionOptions.gasPrice = Cosmo.web3().gasPriceRaw.toString(10);
        }
            
        if(!_.isArray(contractAbi) || contractAbi.length == 0)
            return;
        
        if(contractHex.length == 0)
            return;
        
        Cosmo.deploy(contractAbi, transactionOptions, function(err, contract, mined) {
            if(!err) {
                Session.set('contractAddress', contract.address);
                Cosmo.console('Contract deploying at ' + String(contract.address));
                
                if(mined)
                    Cosmo.console('Contract deployed at ' + String(contract.address));
            } else {
                Session.set('consoleData', Session.get('consoleData') + '\n' + String(err));                
            }
        });        
    },
});