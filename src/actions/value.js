'use strict';

export default function valueReducer (state, action) {
	if (action.type === 'userInput') {
		state.value = action.value;
		state.userInput = action.value;
		state.suggestionIndex = -1;
	}

	return state;
}

export function userInput (value) {
	return {
		type: 'userInput',
		value: value
	};
}
