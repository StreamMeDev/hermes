'use strict';
const {createStore} = require('@streammedev/flux-store');
const valueReducer = require('./actions/value');
const selectionReducer = require('./actions/selection');
const suggestionsReducer = require('./actions/suggestions');

module.exports = function createDefaultStore (initialState) {
	return createStore({
		changeValue: valueReducer,
		changeSelection: selectionReducer,
		setSuggestions: suggestionsReducer,
		setSuggestionIndex: suggestionsReducer,
		incrSuggestionIndex: suggestionsReducer,
		decrSuggestionIndex: suggestionsReducer,
		selectSuggestion: suggestionsReducer
	}, initialState);
};
