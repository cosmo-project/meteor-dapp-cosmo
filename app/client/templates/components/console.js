/**
Template Controllers

@module Templates
*/

/**
The console template

@class [template] components_console
@constructor
*/

Template['components_console'].events({   
    /**
    Clear the console.

    @event (click #consoleClear)
    */
    
    'click #consoleClear': function(){
        Session.set('consoleData', '');
    },
});


Template['components_console'].rendered = function() {
    //$("#consolePre").animate({ scrollTop: $(document).height() }, "slow");
    $("#consolePre").scrollTop($("#consolePre")[0].scrollHeight);
};