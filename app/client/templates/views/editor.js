/**
Template Controllers

@module Templates
*/

/**
The editor template

@class [template] views_editor
@constructor
*/

Template['views_editor'].created = function() {
	Meta.setSuffix(TAPi18n.__("dapp.editor.title"));
};

Template['views_editor'].helpers({
});