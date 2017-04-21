'use strict';
import {createStore} from '@streammedev/flux-store';
import valueReducer from './actions/value';
import selectionReducer from './actions/selection';
import suggestionsReducer from './actions/suggestions';

module.exports = function (initialState) {
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
