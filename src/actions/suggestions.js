'use strict';

export default function suggestionsReducer (state, action) {
	if (action.type === 'setSuggestions') {
		state.suggestions = action.suggestions;
	} else if (action.type === 'incrSuggestionIndex') {
		state.lastSuggestionIndex = state.suggestionIndex;
		state.suggestionIndex++;
		if (state.suggestionIndex === state.suggestions.length) {
			state.suggestionIndex = -1;
		}
	} else if (action.type === 'decrSuggestionIndex') {
		state.lastSuggestionIndex = state.suggestionIndex;
		state.suggestionIndex--;
		if (state.suggestionIndex < -1) {
			state.suggestionIndex = state.suggestions.length - 1;
		}
	} else if (action.type === 'setSuggestionIndex') {
		if (action.storeLast !== false) {
			state.lastSuggestionIndex = state.suggestionIndex;
		}
		state.suggestionIndex = action.value;
	} else if (action.type === 'selectSuggestion') {
		var cursor = state.selection.end;
		var i = 0;

		// Find start of word
		var start = 0;
		while (i < cursor) {
			if (state.value.charAt(i) === ' ') {
				start = i + 1;
			}
			i++;
		}

		// Find end of word
		var end = i;
		while (i < state.value.length) {
			if (state.value.charAt(i) === ' ') {
				end = i;
				break;
			}
			i++;
		}

		// Add spaces after suggestion?
		var sug = action.suggestion + (end === state.value.length ? ' ' : '');

		// Splice in the new value
		state.value = state.value.slice(0, start) + sug + state.value.slice(end);
		state.userInput = state.value;

		// Update the cursor position
		cursor = start + action.suggestion.length + 1;
		state.selection = {
			start: cursor,
			end: cursor
		};

		// Clear out suggestions
		state.suggestions = [];
		state.suggestionIndex = -1;
	}
	return state;
}

export function selectSuggestion (suggestionText) {
	return {
		type: 'selectSuggestion',
		suggestion: suggestionText
	};
}

export function setSuggestions (suggestions) {
	return {
		type: 'setSuggestions',
		suggestions: suggestions
	};
}

export function setSuggestionIndex (value, storeLast) {
	return {
		type: 'setSuggestionIndex',
		value: value,
		storeLast: storeLast
	};
}

export function decrSuggestionIndex () {
	return {
		type: 'decrSuggestionIndex'
	};
}

export function incrSuggestionIndex () {
	return {
		type: 'incrSuggestionIndex'
	};
}
