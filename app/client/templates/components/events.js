/**
Template Controllers

@module Templates
*/

/**
The methods template

@class [template] components_events
@constructor
*/

Template['components_events'].helpers({    
	/**
    The selected method to interact with.

    @method (event)
    */
    
	'event': function(){
		return Session.get('event');
	},
});

var filter;

Template['components_events'].events({    
    /**
    On change select of event.

    @event (change #event)
    */
    
    'change #event': function(){
        var selected = $('#event').val();
        var event = {};
        
        if(_.isEmpty(selected))
            return;
        
        _.each(Session.get('contractEvents'), function(item, index){
            if(item.name == selected)
                event = item;
        });
        
        Session.set('event', event);
        
        console.log('Selecred event', selected, event);
    }, 
    
    
    /**
    On event listen.

    @event (click #eventListen)
    */
    
    'click #eventListen': function(){
        var selectedEvent = Session.get('event');
        var contractAddress = Session.get('contractAddress');
        var contractName = Session.get('contractName');
        var eventParams = {};
        var eventDisplayParams = [];
        
        if(_.isEmpty(selectedEvent))
            return;
        
        _.each(selectedEvent.inputs, function(item, index){
            if(_.isUndefined(item))
                return;
            
            if(_.isUndefined(item.type))
                return;
            
            var value = $('#eInput_' + item.name).val();
            
            if(_.isEmpty(value))
                return;
            
            eventParams[item.name] = value;
            eventDisplayParams.push(item.name + ' ' + item.type);
        });
        
        if(_.isUndefined(Cosmo.contract))
            return;
        
        if(Session.get('isListening')) {
            try {
                filter.stopWatching();
                Cosmo.console('Stopped Listening -> ' + contractName + ' @ ' + contractAddress.substr(0, 5) + '.. ' + selectedEvent.name + ' ' + JSON.stringify(eventParams));
                Session.set('isListening', false);
            }catch(e){
                Session.set('isListening', false);
            }
            return;
        }
        
        try{
            filter = Cosmo.contract[selectedEvent.name](eventParams);

            Cosmo.console('Listening -> ' + contractName + ' @ ' + contractAddress.substr(0, 5) + '.. ' + selectedEvent.name + ' ' + JSON.stringify(eventParams));
            Session.set('isListening', true);

            filter.watch(function (error, log) {
                Cosmo.console('Event Fired -> ' + contractName + ' @ ' + contractAddress.substr(0, 5) + '.. ' + selectedEvent.name);
            });
        }catch(e){
            Cosmo.console('Error while watching filter: ' + String(e));
        }
    },
});